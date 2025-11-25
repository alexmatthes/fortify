import React, { useCallback, useEffect, useRef, useState } from 'react';

const Metronome: React.FC = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [bpm, setBpm] = useState(100);

	// Refs
	const audioContext = useRef<AudioContext | null>(null);
	const nextNoteTime = useRef(0.0);
	const worker = useRef<Worker | null>(null);

	// 1. Create a Ref for BPM so the scheduler can read it without re-triggering
	const bpmRef = useRef(bpm);

	const scheduleAheadTime = 0.1;

	// 2. Keep the Ref in sync with the State
	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	// 3. Wrap functions in useCallback so they are stable
	const nextNote = useCallback(() => {
		const secondsPerBeat = 60.0 / bpmRef.current;
		nextNoteTime.current += secondsPerBeat;
	}, []);

	const scheduleNote = useCallback((time: number) => {
		if (!audioContext.current) return;

		const osc = audioContext.current.createOscillator();
		const envelope = audioContext.current.createGain();

		osc.frequency.value = 800;
		envelope.gain.value = 1;
		envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
		envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

		osc.connect(envelope);
		envelope.connect(audioContext.current.destination);

		osc.start(time);
		osc.stop(time + 0.03);
	}, []);

	const scheduler = useCallback(() => {
		if (!audioContext.current) return;
		while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
			scheduleNote(nextNoteTime.current);
			nextNote();
		}
	}, [nextNote, scheduleNote]);

	// 4. The Worker Effect
	useEffect(() => {
		worker.current = new Worker(new URL('./metronome.worker.ts', import.meta.url));

		worker.current.onmessage = (e: MessageEvent) => {
			if (e.data === 'tick') {
				scheduler();
			}
		};

		if (!audioContext.current) {
			const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
			if (AudioCtor) {
				audioContext.current = new AudioCtor();
			}
		}

		return () => {
			worker.current?.terminate();
			audioContext.current?.close();
		};
	}, [scheduler]);

	const startStop = () => {
		if (!audioContext.current || !worker.current) return;

		if (isPlaying) {
			worker.current.postMessage('stop');
			setIsPlaying(false);
		} else {
			if (audioContext.current.state === 'suspended') {
				audioContext.current.resume();
			}

			// Start slightly in the future to avoid "clumping"
			nextNoteTime.current = audioContext.current.currentTime + 0.05;

			worker.current.postMessage('start');
			setIsPlaying(true);
		}
	};

	return (
		<div className="flex flex-col items-center w-full">
			{/* BPM Display */}
			<div className="mb-8 text-center">
				<span className="text-6xl font-bold text-white tracking-tighter block">{bpm}</span>
				<span className="text-gray-400 text-sm uppercase tracking-widest">BPM</span>
			</div>

			{/* Slider */}
			<div className="w-full px-4 mb-10">
				<input type="range" min="40" max="240" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary-hover" />
				<div className="flex justify-between text-xs text-gray-500 mt-2">
					<span>40</span>
					<span>140</span>
					<span>240</span>
				</div>
			</div>

			{/* Big Start/Stop Button */}
			<button
				onClick={startStop}
				className={`
					w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-2xl
					${isPlaying ? 'border-red-500 bg-red-500/20 text-red-500 animate-pulse shadow-red-500/30' : 'border-primary bg-transparent text-primary hover:bg-primary/10 hover:scale-105'}
				`}
			>
				{isPlaying ? <span className="material-symbols-outlined text-3xl font-bold">■</span> : <span className="material-symbols-outlined text-3xl font-bold">▶</span>}
			</button>
		</div>
	);
};

export default Metronome;
