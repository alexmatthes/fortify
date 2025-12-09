import { ArrowLeft, CheckCircle2, Pause, Play, SkipForward } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import HeadlessMetronome from '../components/features/HeadlessMetronome';
import QualityRatingModal from '../components/features/QualityRatingModal';
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
	const itemRatingsRef = useRef<Map<string, number>>(new Map()); // Track quality ratings by item ID
	const [showQualityModal, setShowQualityModal] = useState(false);
	const [pendingItemId, setPendingItemId] = useState<string | null>(null);
	const [pendingRudimentName, setPendingRudimentName] = useState<string>('');
	const [beatFlash, setBeatFlash] = useState(false);
	const [ghostMode, setGhostMode] = useState(false);
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
					// Get rating for this item, default to 4 if not rated
					const rating = itemRatingsRef.current.get(item.id) || 4;
					return api
						.post('/sessions', {
							rudimentId: item.rudiment.id,
							duration: item.duration, // minutes
							tempo: item.targetTempo,
							quality: rating,
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

	// Fetch Data and resolve smart tempos
	useEffect(() => {
		const fetchRoutine = async () => {
			try {
				// First get the routine
				const routineRes = await api.get<Routine>(`/routines/${routineId}`);
				const routine = routineRes.data;

				// Resolve smart tempos at runtime
				const resolvedRes = await api.get<Routine>(`/routines/${routineId}/resolve-tempos`);
				const resolvedRoutine = resolvedRes.data;

				setRoutine(resolvedRoutine);
				if (resolvedRoutine.items.length > 0) {
					setTimeRemaining(resolvedRoutine.items[0].duration * 60);
				}
				setLoading(false);
			} catch (error) {
				toast.error(getErrorMessage(error));
				navigate('/dashboard');
			}
		};

		fetchRoutine();
	}, [routineId, navigate]);

	// Handle quality rating
	const handleQualityRate = useCallback((rating: number) => {
		if (pendingItemId) {
			itemRatingsRef.current.set(pendingItemId, rating);
		}
		setShowQualityModal(false);
		setPendingItemId(null);
		setPendingRudimentName('');
		// Continue with rest or next item
		if (!routine) return;
		const currentItem = routine.items[currentIndex];
		if (currentItem.restDuration > 0) {
			setPhase('REST');
			setTimeRemaining(currentItem.restDuration);
		} else {
			advanceNext();
		}
	}, [pendingItemId, routine, currentIndex, advanceNext]);

	const handleQualitySkip = useCallback(() => {
		// Default to 4 if skipped
		if (pendingItemId) {
			itemRatingsRef.current.set(pendingItemId, 4);
		}
		setShowQualityModal(false);
		setPendingItemId(null);
		setPendingRudimentName('');
		// Continue with rest or next item
		if (!routine) return;
		const currentItem = routine.items[currentIndex];
		if (currentItem.restDuration > 0) {
			setPhase('REST');
			setTimeRemaining(currentItem.restDuration);
		} else {
			advanceNext();
		}
	}, [pendingItemId, routine, currentIndex, advanceNext]);

	// 2. Wrap handlePhaseComplete in useCallback
	const handlePhaseComplete = useCallback(() => {
		if (!routine) return;
		const currentItem = routine.items[currentIndex];

		if (phase === 'WORK') {
			// Mark item as completed
			completedItemsRef.current.push(currentItem);

			// Show quality rating modal
			setPendingItemId(currentItem.id);
			setPendingRudimentName(currentItem.rudiment.name);
			setShowQualityModal(true);
			setIsPlaying(false); // Pause while rating
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

	// Handle metronome beat for visual feedback
	const handleMetronomeBeat = useCallback(() => {
		setBeatFlash(true);
		setTimeout(() => setBeatFlash(false), 100); // Flash duration
	}, []);

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
			<div className="h-screen bg-dark-bg flex flex-col items-center justify-center text-signal p-6 text-center relative overflow-hidden">
				{saveStatus === 'SAVING' ? (
					<>
						<div className="animate-spin rounded-full h-20 w-20 border-4 border-[rgba(238,235,217,0.2)] border-t-signal mb-8 relative z-10"></div>
						<h1 className="text-3xl font-heading font-semibold mb-2 relative z-10 text-signal">Saving Progress...</h1>
					</>
				) : (
					<>
						<CheckCircle2 size={80} className="text-signal mb-8 relative z-10 animate-fade-in" />
						<h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 relative z-10 text-signal tracking-tight">SESSION COMPLETE</h1>
						<div className="text-[rgba(238,235,217,0.6)] mb-10 max-w-md relative z-10">
							<p className="mb-6 text-lg">Great work! Your consistency score is up.</p>
							{sessionSummary.length > 0 && (
								<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-xl p-6 text-left text-sm space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
									{sessionSummary.map((s, i) => (
										<div key={i} className="flex items-center gap-3">
											<div className="w-2 h-2 rounded-full bg-signal/60" />
											<span className="text-[rgba(238,235,217,0.8)]">{s}</span>
										</div>
									))}
								</div>
							)}
						</div>
						<button onClick={() => navigate('/dashboard')} className="bg-signal text-dark-bg font-semibold py-3.5 px-10 rounded-lg transition-all duration-200 hover:bg-signal/95 active:scale-95 relative z-10">
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
		<div className="h-screen bg-dark-bg flex flex-col relative overflow-hidden text-signal font-sans">
			{/* Progress Bar */}
			<div className="absolute top-0 left-0 w-full h-1.5 bg-[rgba(238,235,217,0.05)] z-10">
				<div className="h-full bg-signal transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
			</div>

			{/* Header */}
			<header className="p-6 flex items-center justify-between z-20 bg-[rgba(40,36,39,0.8)] backdrop-blur-[24px] border-b border-[rgba(238,235,217,0.1)]">
				<button onClick={() => navigate('/dashboard')} className="text-[rgba(238,235,217,0.6)] hover:text-signal transition-colors duration-200 active:scale-95 p-2 rounded-lg" aria-label="Back to dashboard">
					<ArrowLeft size={20} />
				</button>
				<div className="text-center">
					<h2 className="text-xs font-heading font-semibold text-[rgba(238,235,217,0.6)] tracking-widest uppercase">{routine.name}</h2>
					<p className="text-xs text-[rgba(238,235,217,0.4)] font-mono mt-1 tabular-nums">
						ITEM {currentIndex + 1} / {routine.items.length}
					</p>
				</div>
				<button
					onClick={() => setGhostMode(!ghostMode)}
					className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
						ghostMode
							? 'bg-signal/20 text-signal border border-signal/30'
							: 'bg-[rgba(238,235,217,0.05)] text-[rgba(238,235,217,0.6)] border border-[rgba(238,235,217,0.1)] hover:border-[rgba(238,235,217,0.3)]'
					}`}
					aria-label={ghostMode ? 'Disable ghost mode' : 'Enable ghost mode'}
					title="Ghost Mode: Randomly silence beats to train internal timing"
				>
					{ghostMode ? '👻 ON' : '👻 OFF'}
				</button>
			</header>

			{/* Main Content */}
			<main id="main-content" className="flex-1 flex flex-col items-center justify-center z-20 pb-20 relative" aria-live="polite" aria-atomic="true">
				<div
					className={`mb-10 px-5 py-2 rounded-full text-[10px] font-heading font-semibold uppercase tracking-widest border backdrop-blur-sm relative z-10 ${
						isRest 
							? 'border-[rgba(238,235,217,0.3)] bg-[rgba(238,235,217,0.05)] text-[rgba(238,235,217,0.8)]' 
							: 'border-[rgba(238,235,217,0.4)] bg-[rgba(238,235,217,0.05)] text-signal'
					}`}
					role="status"
					aria-label={isRest ? 'Rest period' : 'Active practice'}
				>
					{isRest ? 'Rest & Recover' : 'Focus Mode'}
				</div>

				<div 
					className={`text-[120px] md:text-[140px] font-black leading-none font-mono mb-8 tabular-nums tracking-tighter relative z-10 text-signal transition-all duration-100 ${
						beatFlash && !isRest ? 'scale-105 text-signal drop-shadow-[0_0_20px_rgba(238,235,217,0.5)]' : ''
					}`}
					aria-live="polite" 
					aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
				>
					{formatTime(timeRemaining)}
				</div>

				<div className="text-center space-y-3 mb-14 relative z-10">
					<h1 className="text-3xl md:text-5xl font-heading font-bold text-signal">{isRest ? `Up Next: ${routine.items[currentIndex + 1]?.rudiment.name || 'Finish'}` : currentItem.rudiment.name}</h1>
					{!isRest && (
						<p className="text-xl text-[rgba(238,235,217,0.6)] font-mono tabular-nums">
							Target: <span className="text-signal font-bold">{currentItem.targetTempo} BPM</span>
						</p>
					)}
				</div>

				<div className="flex items-center gap-8 relative z-10">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						aria-label={isPlaying ? 'Pause session' : 'Start session'}
						aria-pressed={isPlaying}
						className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal/50 ${
							isPlaying
								? 'bg-transparent border-4 border-[rgba(238,235,217,0.4)] text-[rgba(238,235,217,0.8)] hover:border-signal hover:text-signal active:scale-95 active:animate-flash'
								: 'bg-signal text-dark-bg hover:bg-signal/95 active:scale-95'
						}`}
					>
						{isPlaying ? <Pause size={36} fill="currentColor" aria-hidden="true" /> : <Play size={36} fill="currentColor" className="ml-1" aria-hidden="true" />}
					</button>

					<button
						onClick={advanceNext}
						aria-label="Skip to next exercise"
						className="w-16 h-16 rounded-full bg-transparent border-2 border-[rgba(238,235,217,0.2)] flex items-center justify-center text-[rgba(238,235,217,0.6)] hover:text-signal hover:border-[rgba(238,235,217,0.4)] transition-all duration-200 active:scale-95 active:animate-flash focus:outline-none focus:ring-2 focus:ring-signal/50"
					>
						<SkipForward size={26} aria-hidden="true" />
					</button>
				</div>
			</main>

			{/* Metronome (Hidden Audio Engine) */}
			<HeadlessMetronome 
				bpm={isRest ? 0 : currentItem.targetTempo} 
				isPlaying={isPlaying && !isRest} 
				mute={isRest}
				onBeat={handleMetronomeBeat}
				ghostMode={ghostMode && !isRest}
				ghostFrequency={0.1}
			/>

			{/* Quality Rating Modal */}
			<QualityRatingModal
				isOpen={showQualityModal}
				rudimentName={pendingRudimentName}
				onRate={handleQualityRate}
				onSkip={handleQualitySkip}
			/>
		</div>
	);
};

export default SessionPage;
