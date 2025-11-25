/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/tests/setup.ts'],
	testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
	transform: {
		...tsJestTransformCfg,
	},
};
