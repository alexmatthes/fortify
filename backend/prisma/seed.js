const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STANDARD_RUDIMENTS = [
	{
		name: 'Single Stroke Roll',
		category: 'Rolls',
		description: 'Alternating strokes between the hands (RLRL...). The foundation of many other rudiments.',
		isStandard: true,
		tempoIncrement: 5,
	},
	{
		name: 'Double Stroke Roll',
		category: 'Rolls',
		description: 'Two strokes per hand (RRLL...). Essential for building speed and control.',
		isStandard: true,
		tempoIncrement: 5,
	},
	{
		name: 'Single Paradiddle',
		category: 'Diddles',
		description: 'A four-note pattern combining single and double strokes (RLRR LRLL).',
		isStandard: true,
		tempoIncrement: 2,
	},
	{
		name: 'Flam',
		category: 'Flams',
		description: 'Two strokes played at almost the same time, with one grace note preceding the primary note.',
		isStandard: true,
		tempoIncrement: 2,
	},
];

async function main() {
	console.log('Start seeding...');

	for (const rudiment of STANDARD_RUDIMENTS) {
		// upsert means: "Update if it exists, Create if it doesn't"
		// This prevents duplicates if you run the seed script multiple times.
		// We use the 'name' to check for uniqueness here, but in a real app, an ID is safer.
		const existing = await prisma.rudiment.findFirst({
			where: { name: rudiment.name, isStandard: true },
		});

		if (!existing) {
			await prisma.rudiment.create({ data: rudiment });
			console.log(`Created standard rudiment: ${rudiment.name}`);
		} else {
			console.log(`Skipped (already exists): ${rudiment.name}`);
		}
	}

	console.log('Seeding finished.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
