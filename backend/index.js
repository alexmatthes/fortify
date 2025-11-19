require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const rudimentRoutes = require('./routes/rudimentRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Route Definitions
app.get('/', (req, res) => {
	res.send('Hello from the Fortify API!');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rudiments', rudimentRoutes);

// Note: In your original code, you had /api/sessions AND /api/dashboard
// I grouped them under /api/sessions for cleanliness, but you can split them if you prefer.
// To match your Frontend exactly as it is now (which calls /dashboard/stats):
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', sessionRoutes); // Re-using sessionRoutes to handle dashboard requests

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
