import { X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Props to support both "Headless" (Session) and "Interactive" (Popup) modes
interface MetronomeProps {
	// Controlled Props (for SessionPage)
	bpm?: number;
	isPlaying?: boolean;
	mute?: boolean;
	headless?: boolean;

	// Interactive Props (for Dashboard)
	onClose?: () => void;
}

const Metronome: React.FC<MetronomeProps> = ({ bpm: externalBpm, isPlaying: externalIsPlaying, mute = false, headless = false, onClose }) => {
	// --- State (Used for Interactive Mode) ---
	const [internalBpm, setInternalBpm] = useState(100);
	const [internalIsPlaying, setInternalIsPlaying] = useState(false);

	// Determine effective state (External overrides Internal)
	const bpm = externalBpm ?? internalBpm;
	const isPlaying = externalIsPlaying ?? internalIsPlaying;

	// --- Audio Engine Refs ---
	const audioContext = useRef<AudioContext | null>(null);
	const nextNoteTime = useRef(0.0);
	const worker = useRef<Worker | null>(null);
	const bpmRef = useRef(bpm);

	const scheduleAheadTime = 0.1;

	// Sync Ref
	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	// --- Sound Generation ---
	const scheduleNote = useCallback(
		(time: number) => {
			if (!audioContext.current || mute) return;

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
		},
		[mute]
	);

	const nextNote = useCallback(() => {
		const secondsPerBeat = 60.0 / bpmRef.current;
		nextNoteTime.current += secondsPerBeat;
	}, []);

	const scheduler = useCallback(() => {
		if (!audioContext.current) return;
		while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
			scheduleNote(nextNoteTime.current);
			nextNote();
		}
	}, [nextNote, scheduleNote]);

	// --- Worker Lifecycle ---
	useEffect(() => {
		// Initialize Worker
		worker.current = new Worker(new URL('./metronome.worker.ts', import.meta.url));

		worker.current.onmessage = (e: MessageEvent) => {
			if (e.data === 'tick') scheduler();
		};

		if (!audioContext.current) {
			const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
			if (AudioCtor) audioContext.current = new AudioCtor();
		}

		return () => {
			worker.current?.terminate();
			audioContext.current?.close();
		};
	}, [scheduler]);

	// --- Play/Stop Logic ---
	useEffect(() => {
		if (!audioContext.current || !worker.current) return;

		if (isPlaying) {
			if (audioContext.current.state === 'suspended') {
				audioContext.current.resume();
			}
			nextNoteTime.current = audioContext.current.currentTime + 0.05;
			worker.current.postMessage('start');
		} else {
			worker.current.postMessage('stop');
		}
	}, [isPlaying]);

	// -------------------------------------------------------------------------
	// RENDER LOGIC
	// -------------------------------------------------------------------------

	// CASE 1: Headless Mode (SessionPage) -> Render Nothing
	if (headless) return null;

	// CASE 2: Interactive Mode (Dashboard) -> Render Pop-up UI
	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in">
			<div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 w-full max-w-sm relative shadow-2xl">
				{/* Close Button */}
				<button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
					<X size={24} />
				</button>

				<div className="flex flex-col items-center w-full">
					{/* BPM Display */}
					<div className="mb-8 text-center">
						<span className="text-6xl font-black text-white tracking-tighter block">{bpm}</span>
						<span className="text-primary font-bold text-sm uppercase tracking-widest">BPM</span>
					</div>

					{/* Slider */}
					<div className="w-full px-2 mb-10">
						<input type="range" min="40" max="240" value={bpm} onChange={(e) => setInternalBpm(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-cyan-300" />
						<div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
							<span>40</span>
							<span>140</span>
							<span>240</span>
						</div>
					</div>

					{/* Start/Stop Button */}
					<button
						onClick={() => setInternalIsPlaying(!internalIsPlaying)}
						className={`
                            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl
                            ${internalIsPlaying ? 'bg-gray-800 text-white border-2 border-gray-700 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]' : 'bg-primary text-black hover:scale-105 shadow-[0_0_30px_-5px_rgba(0,229,255,0.4)]'}
                        `}
					>
						{internalIsPlaying ? <span className="material-symbols-outlined text-3xl font-bold">pause</span> : <span className="material-symbols-outlined text-3xl font-bold ml-1">play_arrow</span>}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Metronome;
