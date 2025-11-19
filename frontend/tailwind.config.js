/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				// Modern web relies heavily on variable sans-serifs
				sans: ['Inter', 'system-ui', 'sans-serif'],
				// Use mono for numbers (BPM, Timers) for that "technical" feel
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Go darker and cooler for the background
				'dark-bg': '#050505',
				'card-bg': '#0A0A0A',
				'card-border': '#202020',
				// A more electric, vibrant primary blue
				primary: '#3B82F6',
				'primary-hover': '#2563EB',
				'primary-glow': 'rgba(59, 130, 246, 0.5)',
				// Accent for "success" or "active" states
				accent: '#10B981',
			},
			backgroundImage: {
				// subtle mesh gradient for backgrounds
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
			},
			animation: {
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
			},
			keyframes: {
				'border-beam': {
					'100%': {
						'offset-distance': '100%',
					},
				},
			},
		},
	},
	plugins: [],
};
