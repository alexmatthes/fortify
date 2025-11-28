// scripts/generate-instagram-content.ts
import { PrismaClient } from '@prisma/client';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Instagram image dimensions
const INSTAGRAM_SIZE = 1080;
const CHART_WIDTH = 800;
const CHART_HEIGHT = 400;

// Brand colors from your Tailwind config
const COLORS = {
	darkBg: '#282427',
	signal: '#EEEBD9',
	signalFaded: 'rgba(238, 235, 217, 0.6)',
	cream: ['rgba(238, 235, 217, 0.9)', 'rgba(238, 235, 217, 0.7)', 'rgba(238, 235, 217, 0.5)', 'rgba(238, 235, 217, 0.4)', 'rgba(238, 235, 217, 0.3)', 'rgba(238, 235, 217, 0.2)'],
};

// Hashtag sets for different post types
const HASHTAGS = {
	general: [
		'#drumming',
		'#drummer',
		'#drumlessons',
		'#drumpractice',
		'#drummingtips',
		'#drumminglife',
		'#practicemakesperfect',
		'#musician',
		'#drumkit',
		'#drummingprogress',
		'#drummingmotivation',
		'#drummingapp',
		'#drummingtools',
		'#drummingtechnique',
		'#rudiments',
	],
	technical: ['#webdev', '#reactjs', '#typescript', '#datavisualization', '#progressiveoverload', '#linearrgression'],
};

// Educational content templates
const EDUCATIONAL_TIPS = [
	{
		title: 'Start Slow, Build Speed',
		content: `🐢 Slow practice = fast progress.

Practice at 60% of your max tempo first. Master the pattern cleanly, then gradually increase speed.

Your metronome is your best friend—use it religiously.`,
		tip: 'Practice at 60% of max tempo first',
	},
	{
		title: 'Track Every Session',
		content: `📊 Data beats guesswork.

Log every practice session—even the short ones. Over time, you'll see patterns you never noticed.

Consistency > intensity. 15 minutes daily beats 2 hours once a week.`,
		tip: 'Log every session, even short ones',
	},
	{
		title: 'Quality Over Quantity',
		content: `⭐ Perfect practice makes perfect.

Focus on clean execution at a slower tempo rather than sloppy speed. Your quality rating matters more than your BPM.

Rate your sessions honestly. This data helps Fortify calculate your next target tempo.`,
		tip: 'Quality beats quantity',
	},
	{
		title: 'Progressive Overload Works',
		content: `📈 Small increments = big gains.

Increase tempo by 2-5 BPM only when you can play cleanly. Linear regression calculates the perfect next step.

Trust the algorithm. It's based on proven training principles.`,
		tip: 'Increase by 2-5 BPM increments',
	},
	{
		title: 'Rest Days Are Training',
		content: `💤 Recovery is part of practice.

Your muscles need time to adapt. Don't skip rest days—they're when real improvement happens.

Track your consistency, not just your speed.`,
		tip: 'Rest days are essential',
	},
	{
		title: 'Master the Basics First',
		content: `🎯 Fundamentals before flash.

Single-stroke roll, double-stroke roll, and paradiddles are the foundation. Master these before moving to advanced rudiments.

Fortify tracks your progress on each rudiment individually.`,
		tip: 'Master basics before advanced',
	},
];

const RUDIMENT_SPOTLIGHTS = [
	{
		name: 'Single-Stroke Roll',
		description: 'The foundation of all drumming. Alternating single strokes (RLRL).',
		tip: 'Start at 60 BPM, focus on even spacing between strokes.',
	},
	{
		name: 'Double-Stroke Roll',
		description: 'Two strokes per hand (RRLL). Builds control and endurance.',
		tip: 'Keep both strokes equal in volume and timing.',
	},
	{
		name: 'Paradiddle',
		description: 'RLRR LRLL. The most versatile rudiment for fills and grooves.',
		tip: 'Practice leading with both hands for versatility.',
	},
	{
		name: 'Flam',
		description: 'A grace note followed by a primary stroke. Adds texture and dynamics.',
		tip: 'The grace note should be very close to the main stroke.',
	},
	{
		name: 'Drag',
		description: 'Two quick grace notes before the primary stroke. Creates rhythmic interest.',
		tip: 'Keep the drag strokes quiet and quick.',
	},
];

interface PostContent {
	imagePath: string;
	caption: string;
	hashtags: string;
	type: string;
}

// Initialize Chart.js renderer
const chartJSNodeCanvas = new ChartJSNodeCanvas({
	width: CHART_WIDTH,
	height: CHART_HEIGHT,
	backgroundColour: COLORS.darkBg,
});

async function getAggregateStats() {
	// Get anonymized aggregate stats across all users
	const totalSessions = await prisma.practiceSession.count();
	const avgTempo = await prisma.practiceSession.aggregate({
		_avg: { tempo: true },
	});
	const maxTempo = await prisma.practiceSession.aggregate({
		_max: { tempo: true },
	});
	const totalTime = await prisma.practiceSession.aggregate({
		_sum: { duration: true },
	});

	// Get velocity data (last 30 days, anonymized)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const velocityData = await prisma.practiceSession.findMany({
		where: {
			date: {
				gte: thirtyDaysAgo,
			},
		},
		select: {
			date: true,
			tempo: true,
		},
		orderBy: {
			date: 'asc',
		},
	});

	// Get most practiced rudiments
	const rudimentCounts = await prisma.practiceSession.groupBy({
		by: ['rudimentId'],
		_count: {
			id: true,
		},
		orderBy: {
			_count: {
				id: 'desc',
			},
		},
		take: 5,
	});

	const rudimentNames = await Promise.all(
		rudimentCounts.map(async (rc) => {
			const rudiment = await prisma.rudiment.findUnique({
				where: { id: rc.rudimentId },
				select: { name: true },
			});
			return {
				name: rudiment?.name || 'Unknown',
				count: rc._count.id,
			};
		})
	);

	return {
		totalSessions,
		avgTempo: Math.round(avgTempo._avg.tempo || 0),
		maxTempo: maxTempo._max.tempo || 0,
		totalTime: totalTime._sum.duration || 0,
		velocityData: velocityData.map((v) => ({
			date: v.date.toISOString().split('T')[0],
			tempo: v.tempo,
		})),
		topRudiments: rudimentNames,
	};
}

async function generateVelocityChart(velocityData: Array<{ date: string; tempo: number }>): Promise<Buffer> {
	// Sample data if too many points
	const maxPoints = 50;
	const sampledData = velocityData.length > maxPoints ? velocityData.filter((_, i) => i % Math.ceil(velocityData.length / maxPoints) === 0) : velocityData;

	const configuration = {
		type: 'line' as const,
		data: {
			labels: sampledData.map((d) => {
				const date = new Date(d.date);
				return `${date.getMonth() + 1}/${date.getDate()}`;
			}),
			datasets: [
				{
					label: 'Tempo (BPM)',
					data: sampledData.map((d) => d.tempo),
					borderColor: COLORS.signal,
					backgroundColor: (context: any) => {
						const ctx = context.chart.ctx;
						const gradient = ctx.createLinearGradient(0, 0, 0, CHART_HEIGHT);
						gradient.addColorStop(0, 'rgba(238, 235, 217, 0.2)');
						gradient.addColorStop(1, 'rgba(238, 235, 217, 0)');
						return gradient;
					},
					tension: 0.4,
					fill: true,
					pointBackgroundColor: COLORS.signal,
					pointBorderColor: COLORS.darkBg,
					pointBorderWidth: 2,
					pointRadius: sampledData.length > 30 ? 2 : 4,
				},
			],
		},
		options: {
			responsive: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				y: {
					grid: {
						color: 'rgba(238, 235, 217, 0.05)',
						drawBorder: false,
					},
					ticks: {
						color: 'rgba(238, 235, 217, 0.4)',
						font: {
							family: 'JetBrains Mono',
							size: 12,
						},
					},
					border: {
						display: false,
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						color: 'rgba(238, 235, 217, 0.4)',
						font: {
							family: 'JetBrains Mono',
							size: 11,
						},
					},
					border: {
						display: false,
					},
				},
			},
		},
	};

	return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function generateRudimentChart(rudiments: Array<{ name: string; count: number }>): Promise<Buffer> {
	const configuration = {
		type: 'doughnut' as const,
		data: {
			labels: rudiments.map((r) => r.name),
			datasets: [
				{
					data: rudiments.map((r) => r.count),
					backgroundColor: COLORS.cream.slice(0, rudiments.length),
					borderWidth: 0,
				},
			],
		},
		options: {
			responsive: false,
			plugins: {
				legend: {
					position: 'right' as const,
					labels: {
						color: 'rgba(238, 235, 217, 0.6)',
						font: {
							size: 12,
						},
					},
				},
			},
			cutout: '70%',
		},
	};

	return await chartJSNodeCanvas.renderToBuffer(configuration);
}

async function createInstagramImage(chartBuffer: Buffer | null, title: string, subtitle: string, stats?: { label: string; value: string }[]): Promise<Buffer> {
	const canvas = createCanvas(INSTAGRAM_SIZE, INSTAGRAM_SIZE);
	const ctx = canvas.getContext('2d');

	// Background
	ctx.fillStyle = COLORS.darkBg;
	ctx.fillRect(0, 0, INSTAGRAM_SIZE, INSTAGRAM_SIZE);

	// Title
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 48px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	const titleY = 80;
	ctx.fillText(title, INSTAGRAM_SIZE / 2, titleY);

	// Subtitle
	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '24px "DM Sans", sans-serif';
	const subtitleY = titleY + 70;
	ctx.fillText(subtitle, INSTAGRAM_SIZE / 2, subtitleY);

	// Chart (centered) - only if chartBuffer is provided
	let chartY = subtitleY + 60;
	if (chartBuffer && chartBuffer.length > 0) {
		// Write chart buffer to temp file and load it
		const tempPath = path.join(process.cwd(), 'marketing', 'instagram', `temp-chart-${Date.now()}.png`);
		fs.writeFileSync(tempPath, chartBuffer);
		const chartImg = await loadImage(tempPath);
		const chartX = (INSTAGRAM_SIZE - CHART_WIDTH) / 2;
		ctx.drawImage(chartImg, chartX, chartY);
		// Clean up temp file
		fs.unlinkSync(tempPath);
		chartY = chartY + CHART_HEIGHT + 40;
	} else {
		// No chart, adjust spacing
		chartY = subtitleY + 100;
	}

	// Stats (if provided)
	if (stats && stats.length > 0) {
		const statsY = chartY;
		const statsSpacing = 120;
		const startX = INSTAGRAM_SIZE / 2 - ((stats.length - 1) * statsSpacing) / 2;

		stats.forEach((stat, index) => {
			const x = startX + index * statsSpacing;

			// Value
			ctx.fillStyle = COLORS.signal;
			ctx.font = 'bold 36px "JetBrains Mono", monospace';
			ctx.textAlign = 'center';
			ctx.fillText(stat.value, x, statsY);

			// Label
			ctx.fillStyle = COLORS.signalFaded;
			ctx.font = '16px "DM Sans", sans-serif';
			ctx.fillText(stat.label, x, statsY + 50);
		});
	}

	// Logo/Branding at bottom
	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '20px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('@fortifydrums', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 40);
	ctx.fillText('fortifydrums.com', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 15);

	return canvas.toBuffer('image/png');
}

// Helper function to wrap text
function wrapText(ctx: any, text: string, maxWidth: number, fontSize: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let currentLine = words[0];

	for (let i = 1; i < words.length; i++) {
		const word = words[i];
		const width = ctx.measureText(currentLine + ' ' + word).width;
		if (width < maxWidth) {
			currentLine += ' ' + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

// Add function to generate educational tip image
async function generateTipImage(tip: (typeof EDUCATIONAL_TIPS)[0]): Promise<Buffer> {
	const canvas = createCanvas(INSTAGRAM_SIZE, INSTAGRAM_SIZE);
	const ctx = canvas.getContext('2d');

	// Background
	ctx.fillStyle = COLORS.darkBg;
	ctx.fillRect(0, 0, INSTAGRAM_SIZE, INSTAGRAM_SIZE);

	// Title
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 42px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	const titleY = 100;

	// Wrap title if too long
	const titleLines = wrapText(ctx, tip.title, INSTAGRAM_SIZE - 160, 42);
	titleLines.forEach((line, index) => {
		ctx.fillText(line, INSTAGRAM_SIZE / 2, titleY + index * 55);
	});

	// Content (main text)
	ctx.fillStyle = COLORS.signal;
	ctx.font = '28px "DM Sans", sans-serif';
	const contentY = titleY + titleLines.length * 55 + 60;
	const contentLines = wrapText(ctx, tip.content, INSTAGRAM_SIZE - 120, 28);
	contentLines.forEach((line, index) => {
		ctx.fillText(line, INSTAGRAM_SIZE / 2, contentY + index * 40);
	});

	// Tip highlight box
	const tipY = contentY + contentLines.length * 40 + 80;
	const tipBoxWidth = INSTAGRAM_SIZE - 200;
	const tipBoxHeight = 120;
	const tipBoxX = (INSTAGRAM_SIZE - tipBoxWidth) / 2;

	// Box background
	ctx.fillStyle = 'rgba(238, 235, 217, 0.1)';
	ctx.fillRect(tipBoxX, tipY, tipBoxWidth, tipBoxHeight);

	// Box border
	ctx.strokeStyle = COLORS.signalFaded;
	ctx.lineWidth = 2;
	ctx.strokeRect(tipBoxX, tipY, tipBoxWidth, tipBoxHeight);

	// Tip text
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 24px "Space Grotesk", sans-serif';
	const tipTextLines = wrapText(ctx, `💡 ${tip.tip}`, tipBoxWidth - 40, 24);
	tipTextLines.forEach((line, index) => {
		ctx.fillText(line, INSTAGRAM_SIZE / 2, tipY + 30 + index * 35);
	});

	// Branding
	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '20px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('@fortifydrums', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 40);
	ctx.fillText('fortifydrums.com', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 15);

	return canvas.toBuffer('image/png');
}

// Add function to generate rudiment spotlight
async function generateRudimentSpotlight(rudiment: (typeof RUDIMENT_SPOTLIGHTS)[0]): Promise<Buffer> {
	const canvas = createCanvas(INSTAGRAM_SIZE, INSTAGRAM_SIZE);
	const ctx = canvas.getContext('2d');

	// Background
	ctx.fillStyle = COLORS.darkBg;
	ctx.fillRect(0, 0, INSTAGRAM_SIZE, INSTAGRAM_SIZE);

	// Title
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 48px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	const titleY = 100;
	ctx.fillText('Rudiment Spotlight', INSTAGRAM_SIZE / 2, titleY);

	// Rudiment Name
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 36px "Space Grotesk", sans-serif';
	const nameY = titleY + 80;
	ctx.fillText(rudiment.name, INSTAGRAM_SIZE / 2, nameY);

	// Description
	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '24px "DM Sans", sans-serif';
	const descY = nameY + 70;
	const descLines = wrapText(ctx, rudiment.description, INSTAGRAM_SIZE - 120, 24);
	descLines.forEach((line, index) => {
		ctx.fillText(line, INSTAGRAM_SIZE / 2, descY + index * 35);
	});

	// Tip section
	const tipY = descY + descLines.length * 35 + 60;
	ctx.fillStyle = COLORS.signal;
	ctx.font = 'bold 28px "Space Grotesk", sans-serif';
	ctx.fillText('Practice Tip:', INSTAGRAM_SIZE / 2, tipY);

	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '22px "DM Sans", sans-serif';
	const tipLines = wrapText(ctx, rudiment.tip, INSTAGRAM_SIZE - 120, 22);
	tipLines.forEach((line, index) => {
		ctx.fillText(line, INSTAGRAM_SIZE / 2, tipY + 45 + index * 30);
	});

	// Branding
	ctx.fillStyle = COLORS.signalFaded;
	ctx.font = '20px "Space Grotesk", sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('@fortifydrums', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 40);
	ctx.fillText('fortifydrums.com', INSTAGRAM_SIZE / 2, INSTAGRAM_SIZE - 15);

	return canvas.toBuffer('image/png');
}

// Update generateCaption to include educational types
function generateCaption(type: string, stats: any, tip?: any, rudiment?: any): string {
	const captions: Record<string, string> = {
		velocity: `📈 Progress is data-driven, not guesswork.

See how drummers are tracking their tempo improvements with Fortify. Every practice session builds toward breaking your speed plateau.

Linear regression calculates your next target tempo automatically—no more guessing what speed to practice at next.

Master your hands. Own your data. 🥁

Link in bio to get started.`,
		rudiments: `🥁 What are you practicing?

These are the most practiced rudiments in Fortify. Whether you're working on singles, doubles, or paradiddles, tracking your progress makes all the difference.

Which rudiment are you focusing on this week? Drop a comment below! 👇`,
		stats: `💪 Consistency beats intensity.

${stats.totalSessions.toLocaleString()} practice sessions logged.
${Math.floor(stats.totalTime / 60)} hours of focused practice.
Average tempo: ${stats.avgTempo} BPM.

Small, consistent practice sessions compound into massive progress. Track your data. Break your plateaus.`,
		tip: tip
			? `💡 ${tip.title}

${tip.content}

What's your biggest practice challenge? Share in the comments! 👇`
			: '',
		rudimentSpotlight: rudiment
			? `🥁 Rudiment Spotlight: ${rudiment.name}

${rudiment.description}

${rudiment.tip}

Which rudiment should we spotlight next? Drop your suggestions below! 👇`
			: '',
	};

	return captions[type] || captions.stats;
}

function generateHashtags(type: string): string {
	const baseHashtags = HASHTAGS.general.slice(0, 10);
	const technicalHashtags = type === 'velocity' ? HASHTAGS.technical.slice(0, 3) : [];
	return [...baseHashtags, ...technicalHashtags].join(' ');
}

async function generateAllContent(): Promise<PostContent[]> {
	const stats = await getAggregateStats();
	const outputDir = path.join(process.cwd(), 'marketing', 'instagram');

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const posts: PostContent[] = [];

	// 1. Velocity Chart Post
	if (stats.velocityData.length > 0) {
		const chartBuffer = await generateVelocityChart(stats.velocityData);
		const imageBuffer = await createInstagramImage(chartBuffer, 'Progress Over Time', '30-Day Tempo Trajectory', [
			{ label: 'Avg BPM', value: `${stats.avgTempo}` },
			{ label: 'Max BPM', value: `${stats.maxTempo}` },
		]);

		const imagePath = path.join(outputDir, `velocity-${Date.now()}.png`);
		fs.writeFileSync(imagePath, imageBuffer);
		posts.push({
			imagePath,
			caption: generateCaption('velocity', stats),
			hashtags: generateHashtags('velocity'),
			type: 'velocity',
		});
	}

	// 2. Rudiment Chart Post
	if (stats.topRudiments.length > 0) {
		const chartBuffer = await generateRudimentChart(stats.topRudiments);
		const imageBuffer = await createInstagramImage(chartBuffer, 'Most Practiced Rudiments', 'Community Focus Areas');

		const imagePath = path.join(outputDir, `rudiments-${Date.now()}.png`);
		fs.writeFileSync(imagePath, imageBuffer);
		posts.push({
			imagePath,
			caption: generateCaption('rudiments', stats),
			hashtags: generateHashtags('rudiments'),
			type: 'rudiments',
		});
	}

	// 3. Stats Post
	const statsImageBuffer = await createInstagramImage(
		null, // No chart for stats post
		'Fortify Stats',
		'Community Progress',
		[
			{ label: 'Sessions', value: `${(stats.totalSessions / 1000).toFixed(1)}k` },
			{ label: 'Hours', value: `${Math.floor(stats.totalTime / 60)}` },
			{ label: 'Avg BPM', value: `${stats.avgTempo}` },
		]
	);

	const statsImagePath = path.join(outputDir, `stats-${Date.now()}.png`);
	fs.writeFileSync(statsImagePath, statsImageBuffer);
	posts.push({
		imagePath: statsImagePath,
		caption: generateCaption('stats', stats),
		hashtags: generateHashtags('stats'),
		type: 'stats',
	});

	// 4. Educational Tip Post (randomly select one)
	const randomTip = EDUCATIONAL_TIPS[Math.floor(Math.random() * EDUCATIONAL_TIPS.length)];
	const tipImageBuffer = await generateTipImage(randomTip);
	const tipImagePath = path.join(outputDir, `tip-${Date.now()}.png`);
	fs.writeFileSync(tipImagePath, tipImageBuffer);
	posts.push({
		imagePath: tipImagePath,
		caption: generateCaption('tip', stats, randomTip),
		hashtags: generateHashtags('tip'),
		type: 'tip',
	});

	// 5. Rudiment Spotlight (randomly select one)
	const randomRudiment = RUDIMENT_SPOTLIGHTS[Math.floor(Math.random() * RUDIMENT_SPOTLIGHTS.length)];
	const rudimentImageBuffer = await generateRudimentSpotlight(randomRudiment);
	const rudimentImagePath = path.join(outputDir, `rudiment-spotlight-${Date.now()}.png`);
	fs.writeFileSync(rudimentImagePath, rudimentImageBuffer);
	posts.push({
		imagePath: rudimentImagePath,
		caption: generateCaption('rudimentSpotlight', stats, undefined, randomRudiment),
		hashtags: generateHashtags('rudimentSpotlight'),
		type: 'rudimentSpotlight',
	});

	// Save metadata JSON
	const metadataPath = path.join(outputDir, `posts-${Date.now()}.json`);
	fs.writeFileSync(
		metadataPath,
		JSON.stringify(
			posts.map((p) => ({
				image: path.basename(p.imagePath),
				caption: p.caption,
				hashtags: p.hashtags,
				type: p.type,
				fullCaption: `${p.caption}\n\n${p.hashtags}`,
			})),
			null,
			2
		)
	);

	return posts;
}

// Main execution
async function main() {
	try {
		console.log('🎨 Generating Instagram content...');
		const posts = await generateAllContent();
		console.log(`✅ Generated ${posts.length} Instagram posts`);
		console.log(`📁 Output directory: marketing/instagram/`);
		posts.forEach((post, index) => {
			console.log(`\n${index + 1}. ${post.type.toUpperCase()}`);
			console.log(`   Image: ${post.imagePath}`);
			console.log(`   Caption length: ${post.caption.length} chars`);
		});
	} catch (error) {
		console.error('❌ Error generating content:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
