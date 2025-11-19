const prisma = require('../lib/prisma');

exports.createRudiment = async (req, res) => {
	try {
		const { name, description, category, tempoIncrement } = req.body;
		const newRudiment = await prisma.rudiment.create({
			data: { name, description, category, tempoIncrement, userId: req.userId },
		});
		res.status(201).json(newRudiment);
	} catch (error) {
		res.status(500).json({ message: 'Error creating rudiment.', error: error.message });
	}
};

exports.getAllRudiments = async (req, res) => {
	try {
		const rudiments = await prisma.rudiment.findMany({
			where: { OR: [{ userId: req.userId }, { isStandard: true }] },
			orderBy: [{ isStandard: 'desc' }, { name: 'asc' }],
		});
		res.status(200).json(rudiments);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching rudiments.', error: error.message });
	}
};

exports.deleteRudiment = async (req, res) => {
	try {
		const { id } = req.params;
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });

		if (!rudiment) return res.status(404).json({ message: 'Rudiment not found' });
		if (rudiment.isStandard) return res.status(403).json({ message: 'Cannot delete standard rudiments.' });
		if (rudiment.userId !== req.userId) return res.status(403).json({ message: 'Permission denied.' });

		await prisma.rudiment.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Error deleting rudiment.', error: error.message });
	}
};

exports.getSuggestedTempo = async (req, res) => {
	try {
		const { id } = req.params;
		const rudiment = await prisma.rudiment.findUnique({ where: { id } });
		if (!rudiment) return res.status(404).json({ message: 'Rudiment not found.' });

		const lastSession = await prisma.practiceSession.findFirst({
			where: { userId: req.userId, rudimentId: id },
			orderBy: { date: 'desc' },
		});

		const suggestedTempo = lastSession ? lastSession.tempo + rudiment.tempoIncrement : 60;
		res.status(200).json({ suggested_tempo: suggestedTempo });
	} catch (error) {
		res.status(500).json({ message: 'Error calculating tempo.', error: error.message });
	}
};
