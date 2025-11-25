import { ArrowLeft, CheckCircle2, Pause, Play, SkipForward } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeadlessMetronome from '../components/features/HeadlessMetronome';
import api from '../services/api';
import { Routine } from '../types/types';
import { getErrorMessage } from '../utils/errorHandler';

const SessionPage = () => {
	const { routineId } = useParams();
	const navigate = useNavigate();

	const [routine, setRoutine] = useState<Routine | null>(null);
	const [loading, setLoading] = useState(true);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [phase, setPhase] = useState<'WORK' | 'REST' | 'FINISHED'>('WORK');
	const [isPlaying, setIsPlaying] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);

	const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');
	const [sessionSummary, setSessionSummary] = useState<string[]>([]);
	const completedItemsRef = useRef<Routine['items'][0][]>([]);
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);

	// Wake Lock API to prevent screen sleep during practice
	useEffect(() => {
		if (!('wakeLock' in navigator)) {
			return; // Wake Lock not supported
		}

		const requestWakeLock = async () => {
			try {
				if (isPlaying && phase !== 'FINISHED') {
					// Type assertion for Wake Lock API
					const navigatorWithWakeLock = navigator as Navigator & {
						wakeLock: {
							request(type: 'screen'): Promise<WakeLockSentinel>;
						};
					};
					const wakeLock = await navigatorWithWakeLock.wakeLock.request('screen');
					wakeLockRef.current = wakeLock;

					// Handle wake lock release
					wakeLock.addEventListener('release', () => {
						wakeLockRef.current = null;
					});
				} else if (wakeLockRef.current) {
					await wakeLockRef.current.release();
					wakeLockRef.current = null;
				}
			} catch (err) {
				// Wake Lock request failed (user denied, tab hidden, etc.)
				console.warn('Wake Lock request failed:', err);
			}
		};

		requestWakeLock();

		// Release wake lock on unmount
		return () => {
			if (wakeLockRef.current) {
				wakeLockRef.current.release().catch(() => {});
			}
		};
	}, [isPlaying, phase]);

	// Callback functions (defined before useEffects that depend on them)
	const saveSessions = useCallback(async () => {
		setSaveStatus('SAVING');
		const items = completedItemsRef.current;
		const summaries: string[] = [];

		if (items.length === 0) {
			setSaveStatus('SUCCESS');
			return;
		}

		try {
			await Promise.all(
				items.map((item) => {
					return api
						.post('/sessions', {
							rudimentId: item.rudiment.id,
							duration: item.duration, // minutes
							tempo: item.targetTempo,
							quality: 4, // Default to 4 ("Great") since we don't have a rating UI yet
						})
						.then(() => {
							summaries.push(`Logged ${item.duration}m of ${item.rudiment.name} at ${item.targetTempo} BPM`);
						})
						.catch((err) => {
							console.error('Failed to log session:', err);
							summaries.push(`Failed to log ${item.rudiment.name}`);
						});
				})
			);
			setSessionSummary(summaries);
			setSaveStatus('SUCCESS');
		} catch (error) {
			console.error('Critical error saving sessions:', error);
			setSaveStatus('ERROR');
		}
	}, []);

	const advanceNext = useCallback(() => {
		if (!routine) return;
		if (currentIndex < routine.items.length - 1) {
			const nextIdx = currentIndex + 1;
			setCurrentIndex(nextIdx);
			setPhase('WORK');
			setTimeRemaining(routine.items[nextIdx].duration * 60);
		} else {
			setPhase('FINISHED');
			setIsPlaying(false);
			saveSessions();
		}
	}, [routine, currentIndex, saveSessions]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return; // Don't interfere with form inputs
			}
			if (e.code === 'Space' && !isPlaying && phase !== 'FINISHED') {
				e.preventDefault();
				setIsPlaying(true);
			} else if (e.code === 'Space' && isPlaying) {
				e.preventDefault();
				setIsPlaying(false);
			} else if (e.code === 'ArrowRight' && phase !== 'FINISHED') {
				e.preventDefault();
				advanceNext();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isPlaying, phase, advanceNext]);

	// Fetch Data
	useEffect(() => {
		api.get(`/routines/${routineId}`)
			.then((res) => {
				setRoutine(res.data);
				if (res.data.items.length > 0) {
					setTimeRemaining(res.data.items[0].duration * 60);
				}
				setLoading(false);
			})
			.catch((error) => {
				toast.error(getErrorMessage(error));
				navigate('/dashboard');
			});
	}, [routineId, navigate]);

	// 2. Wrap handlePhaseComplete in useCallback
	const handlePhaseComplete = useCallback(() => {
		if (!routine) return;
		const currentItem = routine.items[currentIndex];

		if (phase === 'WORK') {
			// Mark item as completed
			completedItemsRef.current.push(currentItem);

			if (currentItem.restDuration > 0) {
				setPhase('REST');
				setTimeRemaining(currentItem.restDuration);
			} else {
				advanceNext();
			}
		} else if (phase === 'REST') {
			advanceNext();
		}
	}, [routine, currentIndex, phase, advanceNext]);

	// 3. Timer Effect with correct dependencies
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isPlaying && phase !== 'FINISHED' && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining((prev) => prev - 1);
			}, 1000);
		} else if (timeRemaining === 0 && isPlaying) {
			handlePhaseComplete();
		}
		return () => clearInterval(interval);
	}, [isPlaying, timeRemaining, phase, handlePhaseComplete]);

	// --- Render Helpers ---
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	};

	if (loading || !routine) {
		return <LoadingSpinner fullPage message="Loading routine..." />;
	}

	if (phase === 'FINISHED') {
		return (
			<div className="h-screen bg-[#0B1219] flex flex-col items-center justify-center text-white p-6 text-center relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none"></div>
				{saveStatus === 'SAVING' ? (
					<>
						<div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/30 border-t-primary mb-8 relative z-10"></div>
						<h1 className="text-3xl font-bold mb-2 relative z-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Saving Progress...</h1>
					</>
				) : (
					<>
						<CheckCircle2 size={80} className="text-primary mb-8 relative z-10 animate-fade-in" />
						<h1 className="text-4xl md:text-5xl font-black mb-4 relative z-10 bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">SESSION COMPLETE</h1>
						<div className="text-gray-400 mb-10 max-w-md relative z-10">
							<p className="mb-6 text-lg">Great work! Your consistency score is up.</p>
							{sessionSummary.length > 0 && (
								<div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-left text-sm space-y-3 shadow-xl">
									{sessionSummary.map((s, i) => (
										<div key={i} className="flex items-center gap-3">
											<div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
											<span className="text-gray-300">{s}</span>
										</div>
									))}
								</div>
							)}
						</div>
						<button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-cyan-300 text-black font-bold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-2xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95 relative z-10">
							Back to Dashboard
						</button>
					</>
				)}
			</div>
		);
	}

	const currentItem = routine.items[currentIndex];
	const isRest = phase === 'REST';
	const totalDuration = isRest ? currentItem.restDuration : currentItem.duration * 60;
	const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;

	return (
		<div className="h-screen bg-[#0B1219] flex flex-col relative overflow-hidden text-white font-sans">
			{/* Progress Bar */}
			<div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900/50 z-10">
				<div className={`h-full transition-all duration-1000 ease-linear ${isRest ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50' : 'bg-gradient-to-r from-primary to-cyan-300 shadow-lg shadow-primary/50'}`} style={{ width: `${progress}%` }} />
			</div>

			{/* Header */}
			<header className="p-6 flex items-center justify-between z-20 bg-[#0B1219]/80 backdrop-blur-sm border-b border-gray-800/30">
				<button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 p-2 rounded-lg hover:bg-gray-800/30">
					<ArrowLeft size={20} />
				</button>
				<div className="text-center">
					<h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase">{routine.name}</h2>
					<p className="text-xs text-gray-600 font-mono mt-1">
						ITEM {currentIndex + 1} / {routine.items.length}
					</p>
				</div>
				<div className="w-6" />
			</header>

			{/* Main Content */}
			<main id="main-content" className="flex-1 flex flex-col items-center justify-center z-20 pb-20 relative" aria-live="polite" aria-atomic="true">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
				<div
					className={`mb-10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm relative z-10 ${
						isRest ? 'border-green-500/40 bg-green-500/10 text-green-400 shadow-lg shadow-green-500/20' : 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/20'
					}`}
					role="status"
					aria-label={isRest ? 'Rest period' : 'Active practice'}
				>
					{isRest ? 'Rest & Recover' : 'Focus Mode'}
				</div>

				<div className="text-[120px] md:text-[140px] font-black leading-none font-mono mb-8 tabular-nums tracking-tighter relative z-10 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent" aria-live="polite" aria-label={`Time remaining: ${formatTime(timeRemaining)}`}>
					{formatTime(timeRemaining)}
				</div>

				<div className="text-center space-y-3 mb-14 relative z-10">
					<h1 className="text-3xl md:text-5xl font-bold text-white">{isRest ? `Up Next: ${routine.items[currentIndex + 1]?.rudiment.name || 'Finish'}` : currentItem.rudiment.name}</h1>
					{!isRest && (
						<p className="text-xl text-gray-400 font-mono">
							Target: <span className="text-primary font-bold bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">{currentItem.targetTempo} BPM</span>
						</p>
					)}
				</div>

				<div className="flex items-center gap-8 relative z-10">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						aria-label={isPlaying ? 'Pause session' : 'Start session'}
						aria-pressed={isPlaying}
						className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg ${
							isPlaying
								? 'bg-gray-800/80 backdrop-blur-sm text-white border-2 border-gray-700 shadow-xl hover:scale-105 active:scale-95'
								: 'bg-primary text-black hover:scale-110 active:scale-95 shadow-2xl shadow-primary/50 hover:shadow-primary/70'
						}`}
					>
						{isPlaying ? <Pause size={36} fill="currentColor" aria-hidden="true" /> : <Play size={36} fill="currentColor" className="ml-1" aria-hidden="true" />}
					</button>

					<button
						onClick={advanceNext}
						aria-label="Skip to next exercise"
						className="w-16 h-16 rounded-full bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg"
					>
						<SkipForward size={26} aria-hidden="true" />
					</button>
				</div>
			</main>

			{/* Metronome (Hidden Audio Engine) */}
			<HeadlessMetronome bpm={isRest ? 0 : currentItem.targetTempo} isPlaying={isPlaying && !isRest} mute={isRest} />
		</div>
	);
};

export default SessionPage;
