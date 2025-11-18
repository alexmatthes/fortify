import React, { useEffect, useRef, useState } from 'react';

const Metronome = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [bpm, setBpm] = useState(100);

	// Refs to maintain state across renders without triggering re-renders inside the scheduler
	const audioContext = useRef(null);
	const nextNoteTime = useRef(0.0); // When the next note is due
	const timerID = useRef(null); // ID for the scheduler timeout

	// We use a ref for BPM so the scheduler function always accesses the current value
	const bpmRef = useRef(bpm);

	// Constants for the scheduler
	const lookahead = 25.0; // How frequently to call the scheduling function (in milliseconds)
	const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)

	// Update the ref whenever the state changes
	useEffect(() => {
		bpmRef.current = bpm;
	}, [bpm]);

	// Calculates the time for the next note based on current BPM
	const nextNote = () => {
		const secondsPerBeat = 60.0 / bpmRef.current;
		nextNoteTime.current += secondsPerBeat;
	};

	// Schedules the audio note to play at the precise time
	const scheduleNote = (time) => {
		const osc = audioContext.current.createOscillator();
		const envelope = audioContext.current.createGain();

		osc.frequency.value = 1000; // Sound pitch (1000Hz = high click)
		envelope.gain.value = 1;

		// Connect oscillator to gain (volume) to destination (speakers)
		osc.connect(envelope);
		envelope.connect(audioContext.current.destination);

		// Start and stop the sound quickly to create a "click"
		osc.start(time);
		osc.stop(time + 0.05);
	};

	// The scheduler loop: checks if a note is due soon and schedules it
	const scheduler = () => {
		// while there are notes that will need to play before the next interval,
		// schedule them and advance the pointer.
		while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
			scheduleNote(nextNoteTime.current);
			nextNote();
		}
		timerID.current = window.setTimeout(scheduler, lookahead);
	};

	const startStop = () => {
		if (isPlaying) {
			// Stop
			window.clearTimeout(timerID.current);
			setIsPlaying(false);
		} else {
			// Start
			// Initialize AudioContext only after a user gesture (Start button click)
			if (audioContext.current === null) {
				audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
			}

			// Resume context if it was suspended by the browser
			if (audioContext.current.state === 'suspended') {
				audioContext.current.resume();
			}

			// Set the first note to play slightly in the future
			nextNoteTime.current = audioContext.current.currentTime + 0.05;

			// Start the scheduler loop
			scheduler();
			setIsPlaying(true);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			window.clearTimeout(timerID.current);
			if (audioContext.current) {
				audioContext.current.close();
			}
		};
	}, []);

	return (
		<div style={styles.container}>
			<h3>Metronome</h3>
			<div style={styles.bpmDisplay}>
				<span style={styles.bpmNumber}>{bpm}</span> BPM
			</div>

			<input type="range" min="40" max="240" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} style={styles.slider} />

			<button onClick={startStop} style={isPlaying ? styles.stopButton : styles.startButton}>
				{isPlaying ? 'Stop' : 'Start'}
			</button>
		</div>
	);
};

const styles = {
	container: {
		border: '1px solid #ddd',
		borderRadius: '8px',
		padding: '20px',
		margin: '20px 0',
		backgroundColor: '#fff',
		textAlign: 'center',
		boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
	},
	bpmDisplay: {
		marginBottom: '15px',
		fontSize: '1.2rem',
	},
	bpmNumber: {
		fontSize: '2rem',
		fontWeight: 'bold',
		color: '#333',
	},
	slider: {
		width: '100%',
		marginBottom: '20px',
		cursor: 'pointer',
	},
	startButton: {
		padding: '10px 24px',
		fontSize: '1rem',
		backgroundColor: '#28a745', // Green
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
	},
	stopButton: {
		padding: '10px 24px',
		fontSize: '1rem',
		backgroundColor: '#dc3545', // Red
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
	},
};

export default Metronome;
