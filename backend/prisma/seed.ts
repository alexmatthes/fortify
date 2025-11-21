import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const standardRudiments = [
		{
			name: 'Single Stroke Roll',
			category: 'Rolls',
			description: 'Alternating single strokes (RLRL).',
			tempoIncrement: 5,
			isStandard: true,
		},
		{
			name: 'Double Stroke Roll',
			category: 'Rolls',
			description: 'Alternating double strokes (RRLL).',
			tempoIncrement: 5,
			isStandard: true,
		},
		{
			name: 'Paradiddle',
			category: 'Diddles',
			description: 'RLRR LRLL.',
			tempoIncrement: 5,
			isStandard: true,
		},
		{
			name: 'Flam Tap',
			category: 'Flams',
			description: 'Flam followed by a tap.',
			tempoIncrement: 2,
			isStandard: true,
		},
	];

	for (const r of standardRudiments) {
		// 1. Check if it exists first
		const existing = await prisma.rudiment.findFirst({
			where: {
				name: r.name,
				isStandard: true,
			},
		});

		// 2. Only create if it doesn't exist
		if (!existing) {
			await prisma.rudiment.create({
				data: r,
			});
			console.log(`Created: ${r.name}`);
		} else {
			console.log(`Skipped: ${r.name} (Already exists)`);
		}
	}

	console.log('Standard rudiments seeded!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
