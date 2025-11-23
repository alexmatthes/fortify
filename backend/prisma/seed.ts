import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const standardRudiments = [
		{
			name: 'Single-Stroke Roll',
			category: 'Roll',
			description: 'Alternating strokes played evenly at any tempo.',
			tempoIncrement: 5,
			isStandard: true,
		},
		{
			name: 'Single-Stroke Four',
			category: 'Roll',
			description: 'Four rapid single strokes ending with an accent.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Single-Stroke Seven',
			category: 'Roll',
			description: 'Seven alternating strokes played as a fast burst.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Multiple-Bounce Roll',
			category: 'Roll',
			description: 'Continuous bounces used for buzz rolls and sustained sounds.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Triple-Stroke Roll',
			category: 'Roll',
			description: 'Repeated triple strokes (RRR LLL) requiring finger control.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Double-Stroke Roll',
			category: 'Roll',
			description: 'Alternating double strokes (RR LL) focused on rebound',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Five-Stroke Roll',
			category: 'Roll',
			description: 'Two doubles plus an accent release stroke.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Six-Stroke Roll',
			category: 'Roll',
			description: 'Alternating pattern with internal doubles, often swung.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Seven-Stroke Roll',
			category: 'Roll',
			description: 'Three doubles plus an accented release.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Nine-Stroke Roll',
			category: 'Roll',
			description: 'Four doubles plus an accented release.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Ten-Stroke Roll',
			category: 'Roll',
			description: 'Alternating doubles leading to an accent; used in marches.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Eleven-Stroke Roll',
			category: 'Roll',
			description: 'Five doubles ending with an accented release stroke.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Thirteen-Stroke Roll',
			category: 'Roll',
			description: 'Six doubles and an accented release stroke.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Fifteen-Stroke Roll',
			category: 'Roll',
			description: 'Seven doubles ending with a strong release stroke.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Seventeen-Stroke Roll',
			category: 'Roll',
			description: 'Eight doubles and an accented release, often in long phrases.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Single Paradiddle',
			category: 'Diddle',
			description: 'Alternating pattern mixing single and double strokes.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Double Paradiddle',
			category: 'Diddle',
			description: 'Two sets of singles followed by a double stroke.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Triple Paradiddle',
			category: 'Diddle',
			description: 'Three single groups followed by a double stroke.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Paradiddle-Diddle',
			category: 'Diddle',
			description: 'A paradiddle ending with two doubles; great for triplets.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Single Flammed Mill',
			category: 'Diddle',
			description: 'Inverted paradiddle with a flam on the first note.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Flam Paradiddle',
			category: 'Diddle',
			description: 'Paradiddle-diddle with flams on the lead notes.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Flam',
			category: 'Flam',
			description: 'Grace note followed by a primary stroke, played as one sound.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Flam Accent',
			category: 'Flam',
			description: 'Triplet-based pattern with a flam on the first note.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Flam Tap',
			category: 'Flam',
			description: 'Alternating flams followed by taps on the same hand.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Flamacue',
			category: 'Flam',
			description: 'Syncopated flam pattern ending with an accented flam.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Swiss Army Triplet',
			category: 'Flam',
			description: 'Triplet with a flam on the downbeat and double strokes.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Inverted Flam Tap',
			category: 'Flam',
			description: 'Variation of the flam tap with reversed sticking.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Flam Drag',
			category: 'Flam',
			description: 'Flam followed by a quick drag figure.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Pataflafla',
			category: 'Flam',
			description: 'Alternating flams separated by single strokes.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Single Flammed Mill',
			category: 'Flam',
			description: 'Inverted paradiddle with flams applied.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Flam Paradiddle',
			category: 'Flam',
			description: 'Paradiddle with flams on the lead strokes.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Drag (Ruff)',
			category: 'Drag',
			description: 'Two quick grace notes before the primary stroke.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Single Drag Tap',
			category: 'Drag',
			description: 'Drag followed by a tap; alternates hands.',
			tempoIncrement: 4,
			isStandard: true,
		},
		{
			name: 'Double Drag Tap',
			category: 'Drag',
			description: 'Double drag figure ending with a tap.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Lesson 25',
			category: 'Drag',
			description: 'Drag figure leading into accented single strokes.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Single Dragadiddle',
			category: 'Drag',
			description: 'Drag attached to a paradiddle sticking.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Double Dragadiddle',
			category: 'Drag',
			description: 'Two drags leading into a paradiddle pattern.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Drag Paradiddle #1',
			category: 'Drag',
			description: 'Drag leading into a full paradiddle figure.',
			tempoIncrement: 3,
			isStandard: true,
		},
		{
			name: 'Drag Paradiddle #2',
			category: 'Drag',
			description: 'Alternate-hand version of Drag Paradiddle #1.',
			tempoIncrement: 3,
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

		if (!existing) {
			// 2. Create if it doesn't exist
			await prisma.rudiment.create({
				data: r,
			});
			console.log(`Created: ${r.name}`);
		} else {
			// 3. UPDATE if it does exist (This is the part you were missing!)
			await prisma.rudiment.update({
				where: { id: existing.id },
				data: {
					category: r.category,
					description: r.description,
					tempoIncrement: r.tempoIncrement,
				},
			});
			console.log(`Updated: ${r.name}`);
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
