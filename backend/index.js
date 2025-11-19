// This first line loads all your secrets from .env into the app
require('dotenv').config();

// 1. Import all your tools
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

// 2. Create your "app" (your server)
const app = express();
const prisma = new PrismaClient();
const PORT = 8000; // You can use any port, 8000 is common for APIs

// 3. Add your "middleware" (the plumbing and security)
// This tells Express to use the 'cors' permission slip
app.use(cors());
// This tells Express to automatically 'translate'
// any incoming JSON data into an object we can use
app.use(express.json());

// 4. Create a test "route" to make sure it's working
// A 'route' is just a URL that your server knows how to respond to.
app.get('/', (req, res) => {
	res.send('Hello from the Fortify API!');
});

// --- AUTHENTICATION ROUTES ---
// 1. SIGNUP route
// 'app.post' means this route is for "POST" requests (creating new data)
// 'async' means this function contains code that must 'await' a result
app.post('/api/auth/signup', async (req, res) => {
	try {
		// req.body is the JSON data the user sent: { "email": "...", "password": "..." }
		const { email, password } = req.body;

		// A. Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (existingUser) {
			// 400 means "Bad Request" - the user made a mistake
			return res.status(400).json({ message: 'Email already in use.' });
		}

		// B. Hash the password
		// 'bcrypt.hash' scrambles the password. 10 is the 'salt rounds' (how complex the scramble is)
		const hashedPassword = await bcrypt.hash(password, 10);

		// C. Save the new user to the database
		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
			},
		});

		// 201 means "Created" - success!
		// We send back the new user's data (but NOT the password!)
		res.status(201).json({ id: newUser.id, email: newUser.email });
	} catch (error) {
		// 500 means "Internal Server Error" - something broke on our end
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// 2. LOGIN route
app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// A. Find the user in the database
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user) {
			// 400 Bad Request - we don't say "user not found" for security
			return res.status(400).json({ message: 'Invalid email or password.' });
		}

		// B. Check if their password is correct
		// 'bcrypt.compare' securely compares the password they sent with the
		// scrambled 'hash' we have stored in the database.
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid email or password.' });
		}

		// C. Create their "VIP pass" (JWT Token)
		// We 'sign' a token with our secret key.
		// The 'payload' (first object) is the data we want to store
		// inside the token. We only need the user's ID.
		const token = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET, // Your secret key from the .env file
			{ expiresIn: '7d' } // The token will be valid for 7 days
		);

		// 200 OK - success! Send the token back to the user.
		res.status(200).json({ token: token, userId: user.id, email: user.email });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// --- RUDIMENT LIBRARY ROUTES (Protected) ---
// All routes in this section will be protected by our 'auth' middleware.

// 1. CREATE a new rudiment
// We add 'auth' as a second argument. Express will run 'auth' *before* our (req, res) function.
app.post('/api/rudiments', auth, async (req, res) => {
	try {
		// We get the data for the new rudiment from the request body
		const { name, description, category, tempoIncrement } = req.body;

		// We get the logged-in user's ID from our 'auth' middleware!
		const userId = req.userId;

		const newRudiment = await prisma.rudiment.create({
			data: {
				name,
				description,
				category,
				tempoIncrement,
				userId: userId, // This links the new rudiment to the logged-in user
			},
		});

		res.status(201).json(newRudiment);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// 2. READ all rudiments (User's Custom + System Standard)
app.get('/api/rudiments', auth, async (req, res) => {
	try {
		const userId = req.userId;

		const rudiments = await prisma.rudiment.findMany({
			where: {
				OR: [
					{ userId: userId }, // 1. Belong to the user
					{ isStandard: true }, // 2. OR are standard system rudiments
				],
			},
			orderBy: [
				{ isStandard: 'desc' }, // Show Standard ones first (optional preference)
				{ name: 'asc' }, // Then sort alphabetically
			],
		});

		res.status(200).json(rudiments);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// 3. UPDATE an existing rudiment
// We use ':id' to create a "URL parameter". This lets us pass the
// rudiment's ID in the URL, like: /api/rudiments/cldf34sks...
app.put('/api/rudiments/:id', auth, async (req, res) => {
	try {
		const { id } = req.params; // Get the rudiment ID from the URL
		const { name, description, category, tempoIncrement } = req.body; // Get new data
		const userId = req.userId; // Get the user ID

		// We use 'updateMany' here for a critical security check.
		// It will ONLY update the rudiment if the 'id' matches AND
		// the 'userId' matches. This stops User A from editing User B's rudiments.
		const result = await prisma.rudiment.updateMany({
			where: {
				id: id,
				userId: userId, // <-- The security check!
			},
			data: {
				name,
				description,
				category,
				tempoIncrement,
			},
		});

		// 'result.count' is the number of records that were updated.
		if (result.count === 0) {
			// This means no rudiment was found with that ID *and* owned by that user.
			return res.status(404).json({ message: 'Rudiment not found or you do not have permission.' });
		}

		res.status(200).json({ message: 'Rudiment updated.' });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

app.delete('/api/rudiments/:id', auth, async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		// Check if the rudiment exists first
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });

		if (!rudiment) {
			return res.status(404).json({ message: 'Rudiment not found' });
		}

		// CRITICAL: Prevent deleting standard rudiments
		if (rudiment.isStandard) {
			return res.status(403).json({ message: 'You cannot delete standard rudiments.' });
		}

		// CRITICAL: Verify ownership
		if (rudiment.userId !== userId) {
			return res.status(403).json({ message: 'You do not have permission to delete this.' });
		}

		// If we pass those checks, delete it
		await prisma.rudiment.delete({ where: { id } });

		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// This is the "Smart" feature route
app.get('/api/rudiments/:id/suggested-tempo', auth, async (req, res) => {
	try {
		const { id } = req.params; // Get rudimentId from the URL
		const userId = req.userId;

		// 1. Find the rudiment to get its increment value
		const rudiment = await prisma.rudiment.findUnique({
			where: { id: id },
		});

		if (!rudiment) {
			return res.status(404).json({ message: 'Rudiment not found.' });
		}

		// 2. Find the user's *most recent* session for this rudiment
		const lastSession = await prisma.practiceSession.findFirst({
			where: {
				userId: userId,
				rudimentId: id,
			},
			orderBy: {
				date: 'desc', // This makes it the most recent
			},
		});

		// 3. Calculate the new tempo
		let suggestedTempo;
		if (lastSession) {
			// If they have practiced it, add the increment
			suggestedTempo = lastSession.tempo + rudiment.tempoIncrement;
		} else {
			// If it's their first time, default to 60 BPM
			suggestedTempo = 60;
		}

		res.status(200).json({ suggested_tempo: suggestedTempo });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// --- PRACTICE SESSION ROUTES (Protected) ---

// 1. CREATE a new practice session
app.post('/api/sessions', auth, async (req, res) => {
	try {
		// Get the data from the request body (from your React form)
		const { rudimentId, duration, tempo } = req.body;

		// Get the user ID from your auth middleware
		const userId = req.userId;

		// Validate the data (basic)
		if (!rudimentId || !duration || !tempo) {
			return res.status(400).json({ message: 'Please provide all fields.' });
		}

		const newSession = await prisma.practiceSession.create({
			data: {
				duration: parseInt(duration, 10), // Ensure 'duration' is an integer
				tempo: parseInt(tempo, 10), // Ensure 'tempo' is an integer
				userId: userId, // Link to the user
				rudimentId: rudimentId, // Link to the rudiment
			},
		});

		res.status(201).json(newSession);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// 2. READ all of a user's practice sessions
// We build this now because you will need it in Phase 7 for the dashboard!
app.get('/api/sessions', auth, async (req, res) => {
	try {
		const userId = req.userId;

		const sessions = await prisma.practiceSession.findMany({
			where: {
				userId: userId, // Only get sessions for the logged-in user
			},
			orderBy: {
				date: 'desc', // Get the most recent sessions first
			},
		});

		res.status(200).json(sessions);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

app.get('/api/dashboard/stats', auth, async (req, res) => {
	try {
		const userId = req.userId;

		const [statsAggregated, statsMostPracticed] = await Promise.all([
			prisma.practiceSession.aggregate({
				where: {
					userId: userId,
				},
				_sum: {
					duration: true,
				},
				_max: {
					tempo: true,
				},
			}),
			prisma.practiceSession.groupBy({
				by: ['rudimentId'],
				where: {
					userId: userId,
				},
				_count: {
					id: true,
				},
				orderBy: {
					_count: {
						id: 'desc',
					},
				},
				take: 1,
			}),
		]);

		// 1. Get the name of the most practiced rudiment
		let mostPracticedName = 'N/A';
		if (statsMostPracticed.length > 0) {
			const mostPracticedRudimentId = statsMostPracticed[0].rudimentId;
			const rudiment = await prisma.rudiment.findUnique({
				where: {
					id: mostPracticedRudimentId,
				},
			});
			mostPracticedName = rudiment ? rudiment.name : 'N/A';
		}

		// 2. Build the final response object
		const responseStats = {
			// Use '|| 0' as a fallback in case they have no sessions yet
			totalTime: statsAggregated._sum.duration || 0,
			fastestTempo: statsAggregated._max.tempo || 0,
			mostPracticed: mostPracticedName,
		};

		// 3. Send the stats back to the frontend
		res.status(200).json(responseStats);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

app.get('/api/dashboard/chart', auth, async (req, res) => {
	try {
		const { rudimentId } = req.query;
		const userId = req.userId;

		const stats = await prisma.practiceSession.findMany({
			where: {
				userId: userId,
				rudimentId: rudimentId,
			},
			orderBy: { date: 'asc' },
		});

		res.status(200).json(stats);
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
});

// 5. Tell your app to start listening for requests
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
