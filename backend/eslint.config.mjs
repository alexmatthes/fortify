// backend/eslint.config.mjs
import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	// 1. Global ignores (replaces .eslintignore)
	{ ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },

	// 2. Base configuration for all files
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: globals.node,
		},
	},

	// 3. Recommended configs
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,

	// 4. Custom Rules (Ported from your old .eslintrc)
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
];
