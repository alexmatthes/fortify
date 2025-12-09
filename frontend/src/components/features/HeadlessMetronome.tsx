import React, { useCallback, useEffect, useRef } from 'react';

interface HeadlessMetronomeProps {
	bpm: number;
	isPlaying: boolean;
	mute?: boolean;
	onBeat?: () => void; // Callback for visual feedback
	ghostMode?: boolean; // Randomly silence beats
	ghostFrequency?: number; // Probability of ghosting (0-1, default 0.1)
}

const HeadlessMetronome: React.FC<HeadlessMetronomeProps> = ({ bpm, isPlaying, mute = false, onBeat, ghostMode = false, ghostFrequency = 0.1 }) => {
	const audioContext = useRef<AudioContext | null>(null);
	const nextNoteTime = useRef(0.0);
	const worker = useRef<Worker | null>(null);
	const bpmRef = useRef(bpm);
	const scheduleAheadTime = 0.1;

	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	const scheduleNote = useCallback(
		(time: number) => {
			if (!audioContext.current || mute) return;

			// Ghost mode: randomly silence beats
			const shouldGhost = ghostMode && Math.random() < ghostFrequency;
			if (shouldGhost) {
				// Still trigger visual feedback for ghosted beats
				if (onBeat) {
					onBeat();
				}
				return; // Don't play audio
			}

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
		[mute, ghostMode, ghostFrequency, onBeat]
	);

	const nextNote = useCallback(() => {
		const secondsPerBeat = 60.0 / bpmRef.current;
		nextNoteTime.current += secondsPerBeat;
	}, []);

	const scheduler = useCallback(() => {
		if (!audioContext.current) return;
		while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
			scheduleNote(nextNoteTime.current);
			// Trigger visual feedback callback
			if (onBeat) {
				onBeat();
			}
			nextNote();
		}
	}, [nextNote, scheduleNote, onBeat]);

	useEffect(() => {
		worker.current = new Worker(new URL('./metronome.worker.ts', import.meta.url));
		worker.current.onmessage = (e: MessageEvent) => {
			if (e.data === 'tick') scheduler();
		};

		if (!audioContext.current) {
			const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
			if (AudioCtor) audioContext.current = new AudioCtor();
		}

		return () => {
			worker.current?.terminate();
			if (audioContext.current && audioContext.current.state !== 'closed') {
				audioContext.current.close().catch(() => {});
			}
		};
	}, [scheduler]);

	useEffect(() => {
		if (!audioContext.current || !worker.current) return;
		if (isPlaying) {
			if (audioContext.current.state === 'suspended') audioContext.current.resume();
			nextNoteTime.current = audioContext.current.currentTime + 0.05;
			worker.current.postMessage('start');
		} else {
			worker.current.postMessage('stop');
		}
	}, [isPlaying]);

	return null;
};

export default HeadlessMetronome;
