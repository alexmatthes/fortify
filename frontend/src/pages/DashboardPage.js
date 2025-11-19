import {
	ArcElement,
	CategoryScale,
	Chart as ChartJS, // 1. Import ArcElement for Doughnut charts
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import api from '../api';
import Card from '../components/Card';
import Metronome from '../components/Metronome';
// Ensure you created this component from the previous step

// 2. Register ALL elements, including ArcElement
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

function DashboardPage() {
	const [showLogModal, setShowLogModal] = useState(false);
	const [showMetronome, setShowMetronome] = useState(false);
	const [loading, setLoading] = useState(true);

	// Data States
	const [stats, setStats] = useState({ totalTime: 0, fastestTempo: 0, mostPracticed: 'N/A' });
	const [rudiments, setRudiments] = useState([]);
	const [chartData, setChartData] = useState([]);

	// Form State
	const [formData, setFormData] = useState({ rudimentId: '', duration: '', tempo: '' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsRes, rudimentsRes, sessionsRes] = await Promise.all([api.get('/dashboard/stats'), api.get('/rudiments'), api.get('/sessions')]);
				setStats(statsRes.data);
				setRudiments(rudimentsRes.data);
				setChartData(sessionsRes.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching dashboard data', error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post('/sessions', formData);
			toast.success('Session logged successfully!');
			setShowLogModal(false);
			setFormData({ rudimentId: '', duration: '', tempo: '' });
			// Refresh stats
			const [statsRes, sessionsRes] = await Promise.all([api.get('/dashboard/stats'), api.get('/sessions')]);
			setStats(statsRes.data);
			setChartData(sessionsRes.data);
		} catch (error) {
			toast.error('Could not log session. Please try again.');
		}
	};

	// 3. Define modernChartOptions here
	const modernChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false }, // Hide legend for cleaner look
			tooltip: {
				backgroundColor: '#0A0A0A',
				titleColor: '#ffffff',
				bodyColor: '#9ca3af',
				borderColor: '#374151',
				borderWidth: 1,
				padding: 10,
				displayColors: false,
			},
		},
		scales: {
			y: {
				grid: {
					color: '#202020', // Very subtle grid
					drawBorder: false,
				},
				ticks: { color: '#6b7280', font: { family: 'JetBrains Mono' } },
			},
			x: {
				grid: { display: false },
				ticks: { color: '#6b7280', font: { family: 'JetBrains Mono' } },
			},
		},
		elements: {
			line: {
				tension: 0.4, // Smooth curves
			},
			point: {
				radius: 4,
				backgroundColor: '#0A0A0A',
				borderWidth: 2,
				hoverRadius: 6,
			},
		},
	};

	const chartConfig = {
		labels: chartData.map((session) => new Date(session.date).toLocaleDateString()),
		datasets: [
			{
				label: 'Tempo',
				data: chartData.map((session) => session.tempo),
				borderColor: '#3B82F6', // Primary Blue
				backgroundColor: (context) => {
					const ctx = context.chart.ctx;
					const gradient = ctx.createLinearGradient(0, 0, 0, 300);
					gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
					gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
					return gradient;
				},
				fill: true,
			},
		],
	};

	if (loading) return <div className="min-h-screen bg-dark-bg p-8 text-white font-mono animate-pulse">Initializing...</div>;

	// Helper to count occurrences
	const sessionCounts = {};
	chartData.forEach((session) => {
		const id = session.rudimentId;
		sessionCounts[id] = (sessionCounts[id] || 0) + 1;
	});

	const doughnutData = {
		labels: Object.keys(sessionCounts).map((id) => {
			const r = rudiments.find((r) => r.id === id);
			return r ? r.name : 'Unknown';
		}),
		datasets: [
			{
				data: Object.values(sessionCounts),
				backgroundColor: [
					'#3B82F6', // Blue
					'#10B981', // Emerald
					'#8B5CF6', // Violet
					'#F59E0B', // Amber
					'#EF4444', // Red
					'#6366F1', // Indigo
				],
				borderWidth: 0,
				hoverOffset: 4,
			},
		],
	};

	const doughnutOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'right',
				labels: {
					color: '#9ca3af',
					font: { family: 'Inter', size: 11 },
					usePointStyle: true,
					pointStyle: 'circle',
				},
			},
		},
		cutout: '75%', // Thinner ring
	};

	const handleRudimentChange = async (e) => {
		const selectedId = e.target.value;
		setFormData({ ...formData, rudimentId: selectedId });

		if (!selectedId) return;

		try {
			const response = await api.get(`/rudiments/${selectedId}/suggested-tempo`);
			setFormData((prev) => ({
				...prev,
				tempo: response.data.suggested_tempo,
			}));
		} catch (error) {
			console.error('Could not fetch suggested tempo');
		}
	};

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
			<header className="mb-12 flex justify-between items-end">
				<div>
					<h1 className="text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Dashboard</h1>
					<p className="text-gray-400 font-mono text-sm">Good afternoon. Ready to grind?</p>
				</div>
				<button onClick={() => setShowLogModal(true)} className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
					+ Log Session
				</button>
			</header>

			{/* BENTO GRID LAYOUT */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
				{/* Stat 1: Total Time */}
				<Card>
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Total Time</h3>
					<div className="text-4xl font-mono font-bold text-white">
						{Math.floor(stats.totalTime / 60)}
						<span className="text-gray-600">h</span> {stats.totalTime % 60}
						<span className="text-gray-600">m</span>
					</div>
				</Card>

				{/* Stat 2: Top Speed */}
				<Card>
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Max Speed</h3>
					<div className="text-4xl font-mono font-bold text-accent">
						{stats.fastestTempo} <span className="text-sm text-gray-600 align-top">BPM</span>
					</div>
				</Card>

				{/* Stat 3: Most Practiced (Spans 2 cols) */}
				<Card className="md:col-span-2">
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Focus Rudiment</h3>
					<div className="text-3xl font-bold text-white truncate bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{stats.mostPracticed}</div>
				</Card>

				{/* Chart Section (Spans 2 Rows, 3 Cols) */}
				<Card className="md:col-span-3 md:row-span-2 min-h-[300px]">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-gray-300 font-semibold">Velocity Trajectory</h3>
						<span className="text-xs text-primary border border-primary/30 px-2 py-1 rounded bg-primary/10">Last 30 Days</span>
					</div>
					<div className="h-64 w-full">{chartData.length > 0 ? <Line options={modernChartOptions} data={chartConfig} /> : <div className="text-gray-600 h-full flex items-center justify-center font-mono text-sm">No data logged</div>}</div>
				</Card>

				{/* Doughnut Chart */}
				<Card className="md:col-span-1 md:row-span-2 flex flex-col justify-center">
					<div className="h-48">{Object.keys(sessionCounts).length > 0 ? <Doughnut data={doughnutData} options={doughnutOptions} /> : <div className="flex items-center justify-center text-gray-500 h-full">No sessions</div>}</div>
					<div className="text-center mt-4 text-sm text-gray-500 font-mono">Distribution</div>
				</Card>
			</div>

			{/* Floating Metronome Button */}
			<button
				onClick={() => setShowMetronome(true)}
				className="fixed bottom-10 right-10 w-16 h-16 bg-black border border-gray-700 text-primary rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center hover:scale-110 hover:border-primary transition-all z-50 group"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:animate-pulse">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
					/>
				</svg>
			</button>

			{/* Metronome Modal */}
			{showMetronome && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
					<div className="bg-card-bg p-8 rounded-2xl border border-card-border w-full max-w-sm shadow-2xl relative">
						<button onClick={() => setShowMetronome(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
							✕
						</button>
						<h2 className="text-xl font-bold text-white mb-6 text-center font-mono">METRONOME</h2>
						<Metronome />
					</div>
				</div>
			)}

			{/* Log Session Modal */}
			{showLogModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="bg-card-bg p-8 rounded-2xl border border-card-border w-full max-w-md shadow-2xl animate-fade-in">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-white">Log Session</h2>
							<button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-white">
								✕
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-gray-400 text-xs uppercase font-bold mb-2">Rudiment</label>
								<select
									required
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
									value={formData.rudimentId}
									onChange={handleRudimentChange}
								>
									<option value="">Select a rudiment...</option>
									{rudiments.map((r) => (
										<option key={r.id} value={r.id}>
											{r.name}
										</option>
									))}
								</select>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-gray-400 text-xs uppercase font-bold mb-2">Duration (min)</label>
									<input
										type="number"
										required
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
										placeholder="15"
										value={formData.duration}
										onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
									/>
								</div>
								<div>
									<label className="block text-gray-400 text-xs uppercase font-bold mb-2">BPM</label>
									<input
										type="number"
										required
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
										placeholder="120"
										value={formData.tempo}
										onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
									/>
								</div>
							</div>
							<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg mt-4 transition-colors shadow-lg shadow-primary/20">
								Save Session
							</button>
						</form>
					</div>
				</div>
			)}

			<footer className="text-center py-8 text-gray-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Fortify. Built by a drummer, for drummers.</p>
			</footer>
		</div>
	);
}

export default DashboardPage;
