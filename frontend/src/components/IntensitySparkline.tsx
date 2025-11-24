import React from 'react';

interface Props {
	items: Array<{ targetTempo: number; duration: number }>;
}

export const IntensitySparkline: React.FC<Props> = ({ items }) => {
	if (items.length === 0) {
		return <div className="h-16 w-full bg-gray-900/50 rounded-xl border border-gray-800 flex items-center justify-center text-xs text-gray-600 font-mono uppercase tracking-widest">Intensity Graph</div>;
	}

	// Calculate dimensions and points
	const maxBpm = Math.max(...items.map((i) => i.targetTempo), 100) + 20;
	const width = 100;
	const height = 100;

	// Create points for the SVG path
	const points = items
		.map((item, index) => {
			const x = (index / (items.length - 1 || 1)) * width;
			// Invert Y because SVG 0 is at the top
			const y = height - (item.targetTempo / maxBpm) * height;
			return `${x},${y}`;
		})
		.join(' ');

	// If only 1 item, draw a flat line
	const pathD = items.length === 1 ? `M0,${height - (items[0].targetTempo / maxBpm) * height} L100,${height - (items[0].targetTempo / maxBpm) * height}` : `M${points}`;

	const fillD = items.length === 1 ? `M0,${height} L0,${height - (items[0].targetTempo / maxBpm) * height} L100,${height - (items[0].targetTempo / maxBpm) * height} L100,${height} Z` : `M0,${height} ${points} L${width},${height} Z`;

	return (
		<div className="relative h-16 w-full bg-black/20 rounded-xl border border-gray-800 overflow-hidden group">
			<div className="absolute top-2 left-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest z-10">Intensity Curve</div>
			<svg className="w-full h-full absolute bottom-0 left-0" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
				<defs>
					<linearGradient id="intensityGrad" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
						<stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
					</linearGradient>
				</defs>
				{/* Gradient Fill */}
				<path d={fillD} fill="url(#intensityGrad)" />
				{/* Stroke Line */}
				<path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
			</svg>
		</div>
	);
};
