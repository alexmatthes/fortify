import React, { useCallback, useEffect, useRef } from 'react';

interface HeadlessMetronomeProps {
	bpm: number;
	isPlaying: boolean;
	mute?: boolean;
}

const HeadlessMetronome: React.FC<HeadlessMetronomeProps> = ({ bpm, isPlaying, mute = false }) => {
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
