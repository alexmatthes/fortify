const prisma = require('../lib/prisma');

exports.logSession = async (req, res) => {
	try {
		const { rudimentId, duration, tempo } = req.body;
		if (!rudimentId || !duration || !tempo) {
			return res.status(400).json({ message: 'Please provide all fields.' });
		}

		const newSession = await prisma.practiceSession.create({
			data: {
				duration: parseInt(duration, 10),
				tempo: parseInt(tempo, 10),
				userId: req.userId,
				rudimentId,
			},
		});
		res.status(201).json(newSession);
	} catch (error) {
		res.status(500).json({ message: 'Error logging session.', error: error.message });
	}
};

exports.getAllSessions = async (req, res) => {
	try {
		const sessions = await prisma.practiceSession.findMany({
			where: { userId: req.userId },
			orderBy: { date: 'desc' },
		});
		res.status(200).json(sessions);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching sessions.', error: error.message });
	}
};

exports.getDashboardStats = async (req, res) => {
	try {
		const [statsAggregated, statsMostPracticed] = await Promise.all([
			prisma.practiceSession.aggregate({
				where: { userId: req.userId },
				_sum: { duration: true },
				_max: { tempo: true },
			}),
			prisma.practiceSession.groupBy({
				by: ['rudimentId'],
				where: { userId: req.userId },
				_count: { id: true },
				orderBy: { _count: { id: 'desc' } },
				take: 1,
			}),
		]);

		let mostPracticedName = 'N/A';
		if (statsMostPracticed.length > 0) {
			const rudiment = await prisma.rudiment.findUnique({
				where: { id: statsMostPracticed[0].rudimentId },
			});
			if (rudiment) mostPracticedName = rudiment.name;
		}

		res.status(200).json({
			totalTime: statsAggregated._sum.duration || 0,
			fastestTempo: statsAggregated._max.tempo || 0,
			mostPracticed: mostPracticedName,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching stats.', error: error.message });
	}
};
