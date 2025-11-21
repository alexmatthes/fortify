/* eslint-disable no-restricted-globals */

const ctx: Worker = self as any;

let timerID: number | null = null;
let interval = 25.0;

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
