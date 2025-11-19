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
app.use('/api/sessions', sessionRoutes);
app.use('/api/dashboard', sessionRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
