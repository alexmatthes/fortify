/* eslint-disable no-restricted-globals */

const ctx: Worker = self as any;

let timerID: number | null = null;
let interval = 25.0;

ctx.onmessage = function (e: MessageEvent) {
	if (e.data === 'start') {
		timerID = setInterval(function () {
			ctx.postMessage('tick');
		}, interval);
	} else if (e.data === 'stop') {
		if (timerID) {
			clearInterval(timerID);
			timerID = null;
		}
	} else if (e.data.interval) {
		interval = e.data.interval;
		if (timerID) {
			clearInterval(timerID);
			timerID = setInterval(function () {
				ctx.postMessage('tick');
			}, interval);
		}
	}
};

export {};
