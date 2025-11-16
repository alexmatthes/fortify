const jwt = require('jsonwebtoken');

// This is our "security guard" middleware
const auth = (req, res, next) => {
	try {
		// 1. Get the token from the request's 'Authorization' header
		// The header looks like: "Bearer YOUR_TOKEN_STRING"
		// We split it at the space and take the second part (the token).
		const token = req.header('Authorization').split(' ')[1];

		if (!token) {
			// 401 means "Unauthorized"
			return res.status(401).json({ message: 'No token, authorization denied.' });
		}

		// 2. Verify the token is real
		// This uses your JWT_SECRET to check if the token is valid.
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// 3. Attach the user's ID to the request object
		// The 'decoded' object contains the payload we put in it during login: { userId: '...' }
		// We're adding a new property, 'userId', to the 'req' object.
		req.userId = decoded.userId;

		// 4. Let the request pass through
		// 'next()' tells Express to move on to the *next* function (our route handler)
		next();
	} catch (error) {
		// This 'catch' will run if the token is missing or invalid
		res.status(401).json({ message: 'Token is not valid.' });
	}
};

// Export the 'auth' function so other files can use it
module.exports = auth;
