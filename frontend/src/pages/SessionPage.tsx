import { ArrowLeft, CheckCircle2, Pause, Play, SkipForward } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import HeadlessMetronome from '../components/HeadlessMetronome';
import { Routine } from '../types';

const SessionPage = () => {
	const { routineId } = useParams();
	const navigate = useNavigate();

	const [routine, setRoutine] = useState<Routine | null>(null);
	const [loading, setLoading] = useState(true);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [phase, setPhase] = useState<'WORK' | 'REST' | 'FINISHED'>('WORK');
	const [isPlaying, setIsPlaying] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);

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
			.catch(() => {
				toast.error('Could not load routine');
				navigate('/dashboard');
			});
	}, [routineId, navigate]);

	// 1. Wrap advanceNext in useCallback
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
		}
	}, [routine, currentIndex]);

	// 2. Wrap handlePhaseComplete in useCallback
	const handlePhaseComplete = useCallback(() => {
		if (!routine) return;
		const currentItem = routine.items[currentIndex];

		if (phase === 'WORK') {
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

	if (loading || !routine) return <div className="h-screen bg-[#0B1219] flex items-center justify-center text-white">Loading...</div>;

	if (phase === 'FINISHED') {
		return (
			<div className="h-screen bg-[#0B1219] flex flex-col items-center justify-center text-white p-6 text-center">
				<CheckCircle2 size={64} className="text-primary mb-6" />
				<h1 className="text-4xl font-black mb-2">SESSION COMPLETE</h1>
				<p className="text-gray-400 mb-8">Great work! Your consistency score is up.</p>
				<button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-cyan-300 text-black font-bold py-3 px-8 rounded-lg">
					Back to Dashboard
				</button>
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
			<div className="absolute top-0 left-0 w-full h-2 bg-gray-800 z-10">
				<div className={`h-full transition-all duration-1000 ease-linear ${isRest ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${progress}%` }} />
			</div>

			{/* Header */}
			<header className="p-6 flex items-center justify-between z-20">
				<button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white transition-colors">
					<ArrowLeft />
				</button>
				<div className="text-center">
					<h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase">{routine.name}</h2>
					<p className="text-xs text-gray-600 font-mono mt-1">
						ITEM {currentIndex + 1} / {routine.items.length}
					</p>
				</div>
				<div className="w-6" />
			</header>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center z-20 pb-20">
				<div className={`mb-8 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isRest ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
					{isRest ? 'Rest & Recover' : 'Focus Mode'}
				</div>

				<div className="text-[120px] font-black leading-none font-mono mb-6 tabular-nums tracking-tighter">{formatTime(timeRemaining)}</div>

				<div className="text-center space-y-2 mb-12">
					<h1 className="text-3xl md:text-5xl font-bold text-white">{isRest ? `Up Next: ${routine.items[currentIndex + 1]?.rudiment.name || 'Finish'}` : currentItem.rudiment.name}</h1>
					{!isRest && (
						<p className="text-xl text-gray-400 font-mono">
							Target: <span className="text-primary font-bold">{currentItem.targetTempo} BPM</span>
						</p>
					)}
				</div>

				<div className="flex items-center gap-6">
					<button
						onClick={() => setIsPlaying(!isPlaying)}
						className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] ${
							isPlaying ? 'bg-gray-800 text-white border border-gray-700' : 'bg-primary text-black hover:scale-105 shadow-[0_0_30px_-5px_rgba(0,229,255,0.4)]'
						}`}
					>
						{isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
					</button>

					<button onClick={advanceNext} className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all">
						<SkipForward size={24} />
					</button>
				</div>
			</main>

			{/* Metronome (Hidden Audio Engine) */}
			<HeadlessMetronome bpm={isRest ? 0 : currentItem.targetTempo} isPlaying={isPlaying && !isRest} mute={isRest} />
		</div>
	);
};

export default SessionPage;
