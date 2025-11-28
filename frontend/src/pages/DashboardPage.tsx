import { ArcElement, CategoryScale, Chart as ChartJS, ChartOptions, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Clock, Play, Plus, Trash2, X } from 'lucide-react';
import posthog from 'posthog-js';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Doughnut, Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { Footer } from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Metronome from '../components/features/Metronome';
import api from '../services/api';
import { DashboardStats, Routine, Rudiment, Session, SessionFormData, SessionHistory } from '../types/types';
import { getErrorMessage } from '../utils/errorHandler';

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
					api.get<{ sessions: Session[] }>('/sessions?limit=100'),
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
				toast.error(getErrorMessage(error));
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
			// Silently fail - user can still enter tempo manually
			console.warn('Could not fetch suggested tempo:', getErrorMessage(error));
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
			toast.error(getErrorMessage(error));
		}
	};

	const handleDeleteRoutine = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		if (!window.confirm('Delete this routine?')) return;
		try {
			await api.delete(`/routines/${id}`);
			setRoutines((prev) => prev.filter((r) => r.id !== id));
			toast.success('Routine deleted');
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	// --- Chart Prep ---
	// Optimize chart data: sample large datasets to improve performance
	const optimizeChartData = (data: VelocityPoint[], maxPoints: number = 100) => {
		if (data.length <= maxPoints) return data;
		// Sample evenly across the dataset
		const step = Math.ceil(data.length / maxPoints);
		return data.filter((_, index) => index % step === 0);
	};

	const optimizedVelocityData = optimizeChartData(velocityData);
	const lineChartData = {
		labels: optimizedVelocityData.map((s) => new Date(s.date).toLocaleDateString()),
		datasets: [
			{
				label: 'Tempo (BPM)',
				data: optimizedVelocityData.map((s) => s.tempo),
				borderColor: '#EEEBD9',
				backgroundColor: (context: any) => {
					const ctx = context.chart.ctx;
					const gradient = ctx.createLinearGradient(0, 0, 0, 400);
					gradient.addColorStop(0, 'rgba(238, 235, 217, 0.2)');
					gradient.addColorStop(1, 'rgba(238, 235, 217, 0)');
					return gradient;
				},
				tension: 0.4,
				fill: true,
				pointBackgroundColor: '#EEEBD9',
				pointBorderColor: '#282427',
				pointBorderWidth: 2,
				pointRadius: optimizedVelocityData.length > 50 ? 2 : 4,
				pointHoverRadius: optimizedVelocityData.length > 50 ? 4 : 6,
				pointHoverBackgroundColor: '#EEEBD9',
				pointHoverBorderColor: '#282427',
			},
		],
	};

	const sessionCounts: Record<string, number> = {};
	chartData.forEach((session) => {
		const rName = rudiments.find((r) => r.id === session.rudimentId)?.name || 'Unknown';
		sessionCounts[rName] = (sessionCounts[rName] || 0) + 1;
	});

	// Monochrome color variations using cream opacity
	const creamColors = [
		'rgba(238, 235, 217, 0.9)',
		'rgba(238, 235, 217, 0.7)',
		'rgba(238, 235, 217, 0.5)',
		'rgba(238, 235, 217, 0.4)',
		'rgba(238, 235, 217, 0.3)',
		'rgba(238, 235, 217, 0.2)',
	];
	
	const doughnutData = {
		labels: Object.keys(sessionCounts),
		datasets: [
			{
				data: Object.values(sessionCounts),
				backgroundColor: creamColors.slice(0, Object.keys(sessionCounts).length),
				borderWidth: 0,
				hoverOffset: 4,
			},
		],
	};

	const modernChartOptions: ChartOptions<'line'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			// Disable animations for large datasets to improve performance
			...(optimizedVelocityData.length > 50 && { animation: false }),
		},
		scales: {
			y: {
				grid: {
					color: 'rgba(238, 235, 217, 0.05)',
					drawBorder: false,
				} as any,
				ticks: {
					color: 'rgba(238, 235, 217, 0.4)',
					font: { family: 'JetBrains Mono', size: 11 },
				},
				border: { display: false },
			},
			x: {
				grid: { display: false },
				ticks: { display: false },
				border: { display: false },
			},
		},
		animation: {
			duration: 1500,
			easing: 'easeOutQuart' as any,
		},
	};

	const doughnutOptions: ChartOptions<'doughnut'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { position: 'right', labels: { color: 'rgba(238, 235, 217, 0.6)', font: { size: 12 } } } },
		cutout: '70%',
	};

	if (loading) {
		return <LoadingSpinner fullPage message="Loading Dashboard..." />;
	}

	return (
		<div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto pb-32 relative">
			<header className="mb-12 flex justify-between items-end">
				<div>
					<h1 className="text-5xl md:text-6xl font-heading font-semibold tracking-tight mb-2 text-signal">Dashboard</h1>
					<p className="text-[rgba(238,235,217,0.6)] font-mono text-sm mt-2">Good afternoon. Ready to grind?</p>
				</div>
				<button
					onClick={() => setShowLogModal(true)}
					aria-label="Log a new practice session"
					className="bg-signal text-dark-bg font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:bg-signal/95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-signal/50"
				>
					+ Log Session
				</button>
			</header>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
				<Card className="relative overflow-hidden">
					<h3 className="premium-label mb-6">Total Time</h3>
					<div className="text-6xl font-mono font-bold text-signal leading-none">
						<span className="tabular-nums">{Math.floor(stats.totalTime / 60)}</span>
						<span className="text-2xl text-[rgba(238,235,217,0.6)] font-normal align-baseline ml-1">h</span>
						<span className="tabular-nums ml-2">{stats.totalTime % 60}</span>
						<span className="text-2xl text-[rgba(238,235,217,0.6)] font-normal align-baseline ml-1">m</span>
					</div>
				</Card>
				<Card className="relative overflow-hidden">
					<h3 className="premium-label mb-6">Max Speed</h3>
					<div className="text-6xl font-mono font-bold text-signal leading-none">
						<span className="tabular-nums">{stats.fastestTempo}</span>
						<span className="text-xl text-[rgba(238,235,217,0.6)] font-normal align-baseline ml-2">BPM</span>
					</div>
				</Card>
				<Card className="md:col-span-2 relative overflow-hidden">
					<h3 className="premium-label mb-6">Focus Rudiment</h3>
					<div className="text-4xl font-heading font-semibold text-signal truncate">{stats.mostPracticed}</div>
				</Card>

				{/* Routines Section */}
				<div className="md:col-span-4 mt-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-heading font-semibold text-signal uppercase tracking-wider">Your Routines</h2>
						<button onClick={() => navigate('/routines/new')} className="text-signal text-sm font-semibold hover:opacity-80 flex items-center gap-1 transition-opacity">
							<Plus size={16} /> Build New
						</button>
					</div>
					{routines.length === 0 ? (
						<div className="border-2 border-dashed border-[rgba(238,235,217,0.1)] rounded-2xl p-16 text-center bg-[rgba(40,36,39,0.3)] backdrop-blur-[24px] hover:border-[rgba(238,235,217,0.3)] transition-all duration-200 relative overflow-hidden">
							<div className="absolute inset-0 opacity-[0.02]">
								<svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50 L120 90 L160 90 L130 120 L140 160 L100 140 L60 160 L70 120 L40 90 L80 90 Z" fill="currentColor" stroke="none" />
								</svg>
							</div>
							<p className="text-[rgba(238,235,217,0.6)] mb-6 relative z-10">No routines found.</p>
							<button
								onClick={() => navigate('/routines/new')}
								className="bg-signal text-dark-bg font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:bg-signal/95 active:scale-95 relative z-10"
							>
								Build your first routine
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{routines.map((routine) => {
								const totalMins = routine.items.reduce((acc, i) => acc + i.duration, 0);
								return (
									<div
										key={routine.id}
										className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-6 hover:border-[rgba(238,235,217,0.3)] transition-all duration-200 group flex flex-col relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
									>
										<div className="flex-1 relative z-10">
											<h3 className="text-xl font-heading font-semibold text-signal mb-2">{routine.name}</h3>
											<div className="flex items-center gap-2 text-xs text-[rgba(238,235,217,0.6)] font-mono mb-6 tabular-nums">
												<Clock size={12} /> {totalMins} mins • {routine.items.length} Exercises
											</div>
										</div>
										<div className="flex gap-3 mt-4 relative z-10">
											<button
												onClick={() => navigate(`/session/${routine.id}`)}
												aria-label={`Start routine: ${routine.name}`}
												className="flex-1 bg-signal hover:bg-signal/95 text-dark-bg font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-signal/50"
											>
												<Play size={16} fill="currentColor" aria-hidden="true" /> Start
											</button>
											<button
												onClick={(e) => handleDeleteRoutine(e, routine.id)}
												aria-label={`Delete routine: ${routine.name}`}
												className="p-2.5 text-[rgba(238,235,217,0.6)] hover:text-signal hover:bg-[rgba(238,235,217,0.05)] rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-signal/50"
											>
												<Trash2 size={18} aria-hidden="true" />
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				<Card className="md:col-span-4 mt-8">
					<div className="flex justify-between items-end mb-6">
						<h3 className="premium-label">Consistency Streak</h3>
						<span className="text-xs text-[rgba(238,235,217,0.6)] font-mono">Last 365 Days</span>
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
					<div className="h-64 relative">{Object.keys(sessionCounts).length > 0 ? <Doughnut data={doughnutData} options={doughnutOptions} /> : <div className="flex h-full items-center justify-center text-[rgba(238,235,217,0.6)]">No data</div>}</div>
				</Card>
			</div>

			{/* FLOATING METRONOME BUTTON */}
			<button
				onClick={() => setShowMetronome(true)}
				aria-label="Open metronome"
				className="fixed bottom-10 right-10 w-16 h-16 bg-[rgba(40,36,39,0.8)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.2)] text-signal rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-110 hover:border-[rgba(238,235,217,0.4)] transition-all duration-200 z-50 active:scale-95 active:animate-flash focus:outline-none focus:ring-2 focus:ring-signal/50"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
					/>
				</svg>
			</button>

			{/* METRONOME POPUP */}
			{showMetronome && (
				<div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-md flex justify-center items-center z-50 animate-fade-in">
					<div className="bg-[rgba(40,36,39,0.95)] backdrop-blur-[24px] p-8 rounded-2xl border border-[rgba(238,235,217,0.1)] w-full max-w-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
						<button
							onClick={() => setShowMetronome(false)}
							aria-label="Close metronome"
							className="absolute top-4 right-4 text-[rgba(238,235,217,0.6)] hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg p-2 transition-colors duration-200"
						>
							<X size={20} aria-hidden="true" />
						</button>
						<h2 className="text-xl font-heading font-semibold text-signal mb-6 text-center font-mono tracking-wider">METRONOME</h2>
						<Metronome />
					</div>
				</div>
			)}

			{/* Log Session Modal */}
			{showLogModal && (
				<div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-md flex justify-center items-center z-50 animate-fade-in">
					<div className="bg-[rgba(40,36,39,0.95)] backdrop-blur-[24px] p-8 rounded-2xl border border-[rgba(238,235,217,0.1)] w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-heading font-semibold text-signal">Log Session</h2>
							<button
								onClick={() => setShowLogModal(false)}
								aria-label="Close log session modal"
								className="text-[rgba(238,235,217,0.6)] hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg p-2 transition-colors duration-200"
							>
								<X size={20} aria-hidden="true" />
							</button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label className="premium-label mb-3 block">Rudiment</label>
								<select
									required
									className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200 cursor-pointer"
									value={formData.rudimentId}
									onChange={handleRudimentChange}
								>
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
									<label className="premium-label mb-3 block">Duration (min)</label>
									<input
										type="number"
										className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal font-mono tabular-nums focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
										value={formData.duration}
										onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
									/>
								</div>
								<div>
									<label className="premium-label mb-3 block">BPM</label>
									<input
										type="number"
										className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal font-mono tabular-nums focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
										value={formData.tempo}
										onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
									/>
								</div>
							</div>
							<div>
								<label className="premium-label mb-3 block">Quality</label>
								<div className="grid grid-cols-4 gap-3">
									<button
										type="button"
										onClick={() => setFormData({ ...formData, quality: '1' })}
										className={`aspect-square rounded-lg font-semibold text-base transition-all flex items-center justify-center ${
											formData.quality === '1'
												? 'bg-signal text-dark-bg border-2 border-signal scale-105'
												: 'bg-transparent text-[rgba(238,235,217,0.6)] border border-[rgba(238,235,217,0.2)] hover:border-[rgba(238,235,217,0.4)] hover:text-[rgba(238,235,217,0.8)]'
										}`}
									>
										Sloppy
									</button>
									<button
										type="button"
										onClick={() => setFormData({ ...formData, quality: '2' })}
										className={`aspect-square rounded-lg font-semibold text-base transition-all flex items-center justify-center ${
											formData.quality === '2'
												? 'bg-signal text-dark-bg border-2 border-signal scale-105'
												: 'bg-transparent text-[rgba(238,235,217,0.6)] border border-[rgba(238,235,217,0.2)] hover:border-[rgba(238,235,217,0.4)] hover:text-[rgba(238,235,217,0.8)]'
										}`}
									>
										Okay
									</button>
									<button
										type="button"
										onClick={() => setFormData({ ...formData, quality: '3' })}
										className={`aspect-square rounded-lg font-semibold text-base transition-all flex items-center justify-center ${
											formData.quality === '3'
												? 'bg-signal text-dark-bg border-2 border-signal scale-105'
												: 'bg-transparent text-[rgba(238,235,217,0.6)] border border-[rgba(238,235,217,0.2)] hover:border-[rgba(238,235,217,0.4)] hover:text-[rgba(238,235,217,0.8)]'
										}`}
									>
										Good
									</button>
									<button
										type="button"
										onClick={() => setFormData({ ...formData, quality: '4' })}
										className={`aspect-square rounded-lg font-semibold text-base transition-all flex items-center justify-center ${
											formData.quality === '4'
												? 'bg-signal text-dark-bg border-2 border-signal scale-105'
												: 'bg-transparent text-[rgba(238,235,217,0.6)] border border-[rgba(238,235,217,0.2)] hover:border-[rgba(238,235,217,0.4)] hover:text-[rgba(238,235,217,0.8)]'
										}`}
									>
										Flawless
									</button>
								</div>
							</div>
							<button
								type="submit"
								className="w-full bg-signal text-dark-bg font-semibold h-11 rounded-lg mt-2 hover:bg-signal/95 transition-all duration-200 active:scale-95"
							>
								Save Log
							</button>
						</form>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
}

export default DashboardPage;
