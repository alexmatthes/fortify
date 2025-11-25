/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	safelist: [
		// Blog post typography classes that are dynamically used in PortableText components
		// These classes are in component objects, so Tailwind's purge might miss them in production
		'text-4xl',
		'text-3xl',
		'text-2xl',
		'font-semibold',
		'mt-12',
		'mt-10',
		'mt-8',
		'mb-6',
		'mb-4',
		'mb-3',
		'text-white',
		'text-gray-200',
		'text-gray-300',
		'text-gray-100',
		'leading-relaxed',
		'border-l-4',
		'border-primary',
		'pl-4',
		'pl-6',
		'italic',
		'my-8',
		'list-disc',
		'list-decimal',
		'space-y-2',
		'text-primary',
		'underline',
		'hover:text-primary-hover',
	],
	theme: {
		extend: {
			fontFamily: {
				// Modern web relies heavily on variable sans-serifs
				sans: ['Inter', 'system-ui', 'sans-serif'],
				// Use mono for numbers (BPM, Timers) for that "technical" feel
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Slate-900 background for "No BS" Dark Mode aesthetic
				'dark-bg': '#0f172a',
				'card-bg': '#0A0A0A',
				'card-border': '#202020',
				// Cyan primary color for "No BS" aesthetic
				primary: '#00E5FF',
				'primary-hover': '#00BCD4',
				'primary-glow': 'rgba(0, 229, 255, 0.5)',
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
	plugins: [require('@tailwindcss/typography')],
};
