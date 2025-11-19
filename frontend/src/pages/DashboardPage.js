import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../api';
import Metronome from '../components/Metronome'; // Import the component

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function DashboardPage() {
	const [showLogModal, setShowLogModal] = useState(false);
	const [showMetronome, setShowMetronome] = useState(false); // State for Metronome
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
			alert('Practice session logged!');
			setShowLogModal(false);
			setFormData({ rudimentId: '', duration: '', tempo: '' });
			const statsRes = await api.get('/dashboard/stats');
			setStats(statsRes.data);
		} catch (error) {
			alert('Failed to log session.');
		}
	};

	const chartConfig = {
		labels: chartData.map((session) => new Date(session.date).toLocaleDateString()),
		datasets: [
			{
				label: 'Practice Tempo (BPM)',
				data: chartData.map((session) => session.tempo),
				borderColor: '#2563EB',
				backgroundColor: 'rgba(37, 99, 235, 0.5)',
				tension: 0.4,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: { labels: { color: 'white' } },
			title: { display: true, text: 'Progress Over Time', color: 'gray' },
		},
		scales: {
			y: { grid: { color: '#374151' }, ticks: { color: 'gray' } },
			x: { grid: { display: false }, ticks: { color: 'gray' } },
		},
	};

	if (loading) return <div className="p-8 text-white">Loading Dashboard...</div>;

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white relative">
			<header className="mb-10">
				<h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
				<p className="text-gray-400">Here is your practice summary.</p>
			</header>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
				<div className="bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg">
					<h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Practice Time</h3>
					<div className="text-3xl font-bold text-primary">
						{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m
					</div>
				</div>
				<div className="bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg">
					<h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Fastest Tempo</h3>
					<div className="text-3xl font-bold text-green-400">{stats.fastestTempo} BPM</div>
				</div>
				<div className="bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg">
					<h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Most Practiced</h3>
					<div className="text-3xl font-bold text-purple-400 truncate">{stats.mostPracticed}</div>
				</div>
			</div>

			{/* Main Action Button (For Logging) */}
			<div className="flex justify-end mb-6">
				<button onClick={() => setShowLogModal(true)} className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:-translate-y-1">
					+ Log New Session
				</button>
			</div>

			{/* Chart Section */}
			<div className="bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg mb-10">
				<div className="h-80">
					{chartData.length > 0 ? <Line options={chartOptions} data={chartConfig} /> : <div className="h-full flex items-center justify-center text-gray-500">No practice data yet. Log a session to see your graph!</div>}
				</div>
			</div>

			{/* Floating Action Button (The Metronome!) */}
			<button
				onClick={() => setShowMetronome(true)}
				className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-primary-hover text-white rounded-full shadow-2xl flex items-center justify-center transition-transform transform hover:scale-110 z-50 border-4 border-dark-bg"
				title="Open Metronome"
			>
				{/* Music Note Icon */}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
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
					<div className="bg-card-bg p-8 rounded-2xl border border-gray-700 w-full max-w-sm shadow-2xl relative">
						<button onClick={() => setShowMetronome(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
							✕
						</button>
						<h2 className="text-xl font-bold text-white mb-6 text-center">Metronome</h2>
						<Metronome />
					</div>
				</div>
			)}

			{/* Log Session Modal */}
			{showLogModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="bg-card-bg p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl animate-fade-in">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-white">Log Session</h2>
							<button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-white">
								✕
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-gray-400 text-sm mb-2">Rudiment</label>
								<select
									required
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
									value={formData.rudimentId}
									onChange={(e) => setFormData({ ...formData, rudimentId: e.target.value })}
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
									<label className="block text-gray-400 text-sm mb-2">Duration (min)</label>
									<input
										type="number"
										required
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
										placeholder="15"
										value={formData.duration}
										onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
									/>
								</div>
								<div>
									<label className="block text-gray-400 text-sm mb-2">BPM</label>
									<input
										type="number"
										required
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
										placeholder="120"
										value={formData.tempo}
										onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
									/>
								</div>
							</div>
							<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg mt-4 transition-colors">
								Save Session
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default DashboardPage;
