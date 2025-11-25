import { ArcElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Clock, Play, Plus, Trash2 } from 'lucide-react';
import posthog from 'posthog-js';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Doughnut, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Metronome from '../components/features/Metronome';
import api from '../services/api';
import { DashboardStats, Routine, Rudiment, Session, SessionFormData, SessionHistory } from '../types/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface VelocityPoint {
	date: string;
	tempo: number;
}

function DashboardPage() {
	const navigate = useNavigate();
	const [showLogModal, setShowLogModal] = useState(false);
	const [showMetronome, setShowMetronome] = useState(false); // Controls the popup
	const [loading, setLoading] = useState(true);

	const [stats, setStats] = useState<DashboardStats>({ totalTime: 0, fastestTempo: 0, mostPracticed: 'N/A' });
	const [rudiments, setRudiments] = useState<Rudiment[]>([]);
	const [chartData, setChartData] = useState<Session[]>([]);
	const [routines, setRoutines] = useState<Routine[]>([]);
	const [history, setHistory] = useState<SessionHistory[]>([]);
	const [velocityData, setVelocityData] = useState<VelocityPoint[]>([]);

	const [formData, setFormData] = useState<SessionFormData>({
		rudimentId: '',
		duration: '',
		tempo: '',
		quality: '3',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsRes, rudimentsRes, velocityRes, historyRes, sessionRes, routinesRes] = await Promise.all([
					api.get<DashboardStats>('/dashboard/stats'),
					api.get<Rudiment[]>('/rudiments'),
					api.get<VelocityPoint[]>('/sessions/velocity'),
					api.get<{ date: string; duration: number }[]>('/sessions/history'),
					api.get<any>('/sessions?limit=100'),
					api.get<Routine[]>('/routines'),
				]);

				setStats(statsRes.data);
				setRudiments(rudimentsRes.data);
				setVelocityData(velocityRes.data);
				setChartData(sessionRes.data.sessions);
				setRoutines(routinesRes.data);

				const historyMap: Record<string, number> = {};
				historyRes.data.forEach((session) => {
					const localDate = new Date(session.date).toLocaleDateString('en-CA');
					historyMap[localDate] = (historyMap[localDate] || 0) + session.duration;
				});
				setHistory(Object.entries(historyMap).map(([date, count]) => ({ date, count })));

				setLoading(false);
			} catch (error) {
				console.error('Error fetching dashboard data', error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// --- Actions ---
	const handleRudimentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = e.target.value;
		setFormData((prev) => ({ ...prev, rudimentId: selectedId }));
		if (!selectedId) return;
		try {
			const response = await api.get<{ suggested_tempo: number }>(`/rudiments/${selectedId}/suggested-tempo`);
			if (response.data.suggested_tempo) {
				setFormData((prev) => ({ ...prev, tempo: String(response.data.suggested_tempo) }));
			}
		} catch (error) {
			console.error('Could not fetch suggested tempo');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post('/sessions', formData);
			posthog.capture('session_logged', { ...formData });
			toast.success('Practice session logged!');
			setShowLogModal(false);
			setFormData({ rudimentId: '', duration: '', tempo: '', quality: '3' });
			const statsRes = await api.get<DashboardStats>('/dashboard/stats');
			setStats(statsRes.data);
		} catch (error) {
			toast.error('Failed to log session.');
		}
	};

	const handleDeleteRoutine = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		if (!window.confirm('Delete this routine?')) return;
		try {
			await api.delete(`/routines/${id}`);
			setRoutines((prev) => prev.filter((r) => r.id !== id));
			toast.success('Routine deleted');
		} catch (e) {
			toast.error('Failed to delete');
		}
	};

	// --- Chart Prep ---
	const lineChartData = {
		labels: velocityData.map((s) => new Date(s.date).toLocaleDateString()),
		datasets: [
			{
				label: 'Tempo (BPM)',
				data: velocityData.map((s) => s.tempo),
				borderColor: '#00E5FF',
				backgroundColor: 'rgba(0, 229, 255, 0.1)',
				tension: 0.4,
				fill: true,
				pointBackgroundColor: '#00E5FF',
				pointBorderColor: '#fff',
				pointRadius: 4,
			},
		],
	};

	const sessionCounts: Record<string, number> = {};
	chartData.forEach((session) => {
		const rName = rudiments.find((r) => r.id === session.rudimentId)?.name || 'Unknown';
		sessionCounts[rName] = (sessionCounts[rName] || 0) + 1;
	});

	const doughnutData = {
		labels: Object.keys(sessionCounts),
		datasets: [
			{
				data: Object.values(sessionCounts),
				backgroundColor: ['#00E5FF', '#7C3AED', '#FF2975', '#FF9900', '#10B981', '#3B82F6'],
				borderWidth: 0,
				hoverOffset: 4,
			},
		],
	};

	const modernChartOptions: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
			x: { grid: { display: false }, ticks: { display: false } },
		},
	};

	const doughnutOptions: ChartOptions<'doughnut'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { position: 'right', labels: { color: '#cbd5e1', font: { size: 12 } } } },
		cutout: '70%',
	};

	if (loading) return <div className="p-8 text-white text-center">Loading Dashboard...</div>;

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto pb-32 relative">
			<header className="mb-12 flex justify-between items-end">
				<div>
					<h1 className="text-5xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Dashboard</h1>
					<p className="text-gray-400 font-mono text-sm">Good afternoon. Ready to grind?</p>
				</div>
				<button onClick={() => setShowLogModal(true)} className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
					+ Log Session
				</button>
			</header>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
				<Card>
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Total Time</h3>
					<div className="text-4xl font-mono font-bold text-white">
						{Math.floor(stats.totalTime / 60)}
						<span className="text-gray-600">h</span> {stats.totalTime % 60}
						<span className="text-gray-600">m</span>
					</div>
				</Card>
				<Card>
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Max Speed</h3>
					<div className="text-4xl font-mono font-bold text-accent">
						{stats.fastestTempo} <span className="text-sm text-gray-600 align-top">BPM</span>
					</div>
				</Card>
				<Card className="md:col-span-2">
					<h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Focus Rudiment</h3>
					<div className="text-3xl font-bold text-white truncate bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{stats.mostPracticed}</div>
				</Card>

				{/* Routines Section */}
				<div className="md:col-span-4 mt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-black text-white uppercase tracking-wider">Your Routines</h2>
						<button onClick={() => navigate('/routines/new')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
							<Plus size={16} /> Build New
						</button>
					</div>
					{routines.length === 0 ? (
						<div className="border-2 border-dashed border-gray-800 rounded-2xl p-12 text-center bg-card-bg">
							<p className="text-gray-500 mb-4">No routines found.</p>
							<button onClick={() => navigate('/routines/new')} className="text-white font-bold underline">
								Build your first routine
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{routines.map((routine) => {
								const totalMins = routine.items.reduce((acc, i) => acc + i.duration, 0);
								return (
									<div key={routine.id} className="bg-card-bg border border-gray-800 rounded-xl p-6 hover:border-primary/50 transition-all group flex flex-col">
										<div className="flex-1">
											<h3 className="text-xl font-bold text-white mb-2">{routine.name}</h3>
											<div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-6">
												<Clock size={12} /> {totalMins} mins • {routine.items.length} Exercises
											</div>
										</div>
										<div className="flex gap-3 mt-4">
											<button
												onClick={() => navigate(`/session/${routine.id}`)}
												className="flex-1 bg-white/5 hover:bg-primary hover:text-black text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
											>
												<Play size={16} fill="currentColor" /> Start
											</button>
											<button onClick={(e) => handleDeleteRoutine(e, routine.id)} className="p-2.5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
												<Trash2 size={18} />
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<Card className="md:col-span-4 mt-8">
					<div className="flex justify-between items-end mb-4">
						<h3 className="text-gray-300 font-semibold">Consistency Streak</h3>
						<span className="text-xs text-gray-500 font-mono">Last 365 Days</span>
					</div>
					<div className="w-full overflow-x-auto pb-2">
						<CalendarHeatmap
							startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
							endDate={new Date()}
							values={history}
							classForValue={(value) => (value ? `color-scale-${Math.min(4, Math.ceil(value.count / 15))}` : 'color-empty')}
							showWeekdayLabels={true}
						/>
					</div>
				</Card>

				<Card className="md:col-span-3 md:row-span-2 min-h-96">
					<div className="h-80 w-full">
						<Line data={lineChartData} options={modernChartOptions} />
					</div>
				</Card>

				<Card className="md:col-span-1 md:row-span-2 flex flex-col justify-center">
					<div className="h-64 relative">{Object.keys(sessionCounts).length > 0 ? <Doughnut data={doughnutData} options={doughnutOptions} /> : <div className="flex h-full items-center justify-center text-gray-500">No data</div>}</div>
				</Card>
			</div>

			{/* THE ORIGINAL FLOATING METRONOME BUTTON */}
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

			{/* THE ORIGINAL METRONOME POPUP */}
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

			{/* Log Session Modal - Kept from your current implementation */}
			{showLogModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
					<div className="bg-card-bg p-8 rounded-2xl border border-card-border w-full max-w-md shadow-2xl">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-white">Log Session</h2>
							<button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-white">
								✕
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-gray-400 text-xs uppercase font-bold mb-2">Rudiment</label>
								<select required className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 h-10 text-white focus:border-primary outline-none" value={formData.rudimentId} onChange={handleRudimentChange}>
									<option value="">Select...</option>
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
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 h-10 text-white focus:border-primary outline-none"
										value={formData.duration}
										onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
									/>
								</div>
								<div>
									<label className="block text-gray-400 text-xs uppercase font-bold mb-2">BPM</label>
									<input
										type="number"
										className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 h-10 text-white focus:border-primary outline-none"
										value={formData.tempo}
										onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
									/>
								</div>
							</div>
							<button type="submit" className="w-full bg-primary text-black font-bold h-10 rounded-lg mt-2 hover:bg-cyan-300 transition-colors">
								Save Log
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default DashboardPage;
