/// <reference types="react-scripts" />

// Wake Lock API type definitions
interface WakeLockSentinel extends EventTarget {
	readonly released: boolean;
	readonly type: 'screen';
	release(): Promise<void>;
	addEventListener(type: 'release', listener: () => void): void;
}

interface WakeLock {
	request(type: 'screen'): Promise<WakeLockSentinel>;
}