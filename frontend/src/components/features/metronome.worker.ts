/* eslint-disable no-restricted-globals */

/**
 * Metronome Web Worker
 *
 * This worker runs in a separate thread to provide precise, non-blocking timing
 * for the metronome. Web Workers execute in an isolated context that cannot access
 * the main thread's DOM, React state, or other browser APIs. This isolation is
 * essential for maintaining accurate timing intervals even when the main thread
 * is busy with UI rendering or other JavaScript execution.
 *
 * We use `self.postMessage` instead of React state because:
 * - Workers run in a completely isolated thread with no access to React's state management
 * - Direct state updates from a worker would violate React's single-threaded execution model
 * - Message passing is the only way to communicate between the worker thread and main thread
 * - This ensures the timing loop runs independently of React's render cycle, preventing
 *   timing drift that would occur if the metronome relied on React state updates
 *
 * The worker receives commands ('start', 'stop', or interval updates) and sends
 * 'tick' messages back to the main thread at the specified interval.
 */

// Web Worker context - self is typed as DedicatedWorkerGlobalScope in worker context
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

let timerID: number | null = null;
let interval = 25.0;

/**
 * Handles messages from the main thread to control the metronome timing.
 *
 * @param {MessageEvent} e - The message event containing the command or interval data
 * @param {string|{interval: number}} e.data - The message payload:
 *   - 'start': Begins the metronome timing loop, sending 'tick' messages at the current interval
 *   - 'stop': Stops the metronome timing loop and clears the interval
 *   - {interval: number}: Updates the timing interval (in milliseconds) and restarts
 *     the loop if it's currently running
 *
 * The handler manages the setInterval timer that sends 'tick' messages back to the
 * main thread, allowing the React component to schedule audio playback without
 * blocking the timing precision.
 */
ctx.onmessage = function (e: MessageEvent) {
	if (e.data === 'start') {
		// Force cast to number to satisfy TS in both Node and Browser contexts
		timerID = setInterval(function () {
			ctx.postMessage('tick');
		}, interval) as unknown as number;
	} else if (e.data === 'stop') {
		if (timerID !== null) {
			clearInterval(timerID);
			timerID = null;
		}
	} else if (e.data.interval) {
		interval = e.data.interval;
		if (timerID !== null) {
			clearInterval(timerID);
			timerID = setInterval(function () {
				ctx.postMessage('tick');
			}, interval) as unknown as number;
		}
	}
};

export {};
