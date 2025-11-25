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
				// Premium heading font with technical character
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
				// Use mono for ALL data/metrics for engineering precision
				mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
			},
			colors: {
				// Industrial luxury dark mode - refined color system
				'dark-bg': '#0a0e17', // Base background
				'surface': '#111620', // Card surface (lighter than background)
				'card-bg': '#111620', // Alias for surface
				'card-border': 'rgba(255, 255, 255, 0.1)', // 10% opacity borders
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
