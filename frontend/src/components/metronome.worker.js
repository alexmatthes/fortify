/* eslint-disable no-restricted-globals */

// This code runs on a separate thread. It basically just says "TICK"
// repeatedly, very accurately, without being distracted by the UI.

let timerID = null;
let interval = 25.0; // How often to check (in milliseconds)

self.onmessage = function (e) {
	if (e.data === 'start') {
		timerID = setInterval(function () {
			postMessage('tick');
		}, interval);
	} else if (e.data === 'stop') {
		clearInterval(timerID);
		timerID = null;
	} else if (e.data.interval) {
		interval = e.data.interval;
		if (timerID) {
			clearInterval(timerID);
			timerID = setInterval(function () {
				postMessage('tick');
			}, interval);
		}
	}
};

export {};
