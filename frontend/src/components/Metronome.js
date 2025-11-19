import React, { useEffect, useRef, useState } from 'react';

const Metronome = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [bpm, setBpm] = useState(100);

	// Refs for audio timing
	const audioContext = useRef(null);
	const nextNoteTime = useRef(0.0);
	const timerID = useRef(null);
	const bpmRef = useRef(bpm);

	const lookahead = 25.0;
	const scheduleAheadTime = 0.1;

	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	const nextNote = () => {
		const secondsPerBeat = 60.0 / bpmRef.current;
		nextNoteTime.current += secondsPerBeat;
	};

	const scheduleNote = (time) => {
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
	};

	const scheduler = () => {
		while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
			scheduleNote(nextNoteTime.current);
			nextNote();
		}
		timerID.current = window.setTimeout(scheduler, lookahead);
	};

	const startStop = () => {
		if (isPlaying) {
			window.clearTimeout(timerID.current);
			setIsPlaying(false);
		} else {
			if (audioContext.current === null) {
				audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
			}
			if (audioContext.current.state === 'suspended') {
				audioContext.current.resume();
			}
			nextNoteTime.current = audioContext.current.currentTime + 0.05;
			scheduler();
			setIsPlaying(true);
		}
	};

	useEffect(() => {
		return () => {
			window.clearTimeout(timerID.current);
			if (audioContext.current) {
				audioContext.current.close();
			}
		};
	}, []);

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
