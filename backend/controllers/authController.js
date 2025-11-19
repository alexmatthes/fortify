const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma'); // Import our singleton

exports.signup = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			return res.status(400).json({ message: 'Email already in use.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		res.status(201).json({ id: newUser.id, email: newUser.email });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid email or password.' });

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.status(200).json({ token, userId: user.id, email: user.email });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong.', error: error.message });
	}
};
