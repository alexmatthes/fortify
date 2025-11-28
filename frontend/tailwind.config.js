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
				// Body text: DM Sans with tabular figures for precision
				sans: ['DM Sans', 'system-ui', 'sans-serif'],
				// Headings: Space Grotesk - technical, idiosyncratic, retro-future
				heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
				// Use mono for ALL data/metrics for engineering precision
				mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
			},
			colors: {
				// Matte Noir / Soft Tech Edition - Warm Monolith
				// The Void (Background)
				'dark-bg': '#282427', // Matte charcoal - never pure black
				'void': '#282427',
				// The Signal (Foreground)
				'signal': '#EEEBD9', // Warm bone/cream - represents light/active information
				'signal-faded': 'rgba(238, 235, 217, 0.6)', // 60% opacity for secondary text
				// Legacy aliases for compatibility during transition
				'surface': 'rgba(40, 36, 39, 0.7)', // Smoked matte glass surfaces
				'card-bg': 'rgba(40, 36, 39, 0.7)',
				'card-border': 'rgba(238, 235, 217, 0.1)', // Razor-thin cream border at 10% opacity
				// Primary actions use signal color
				primary: '#EEEBD9',
				'primary-hover': '#EEEBD9',
			},
			animation: {
				'flash': 'flash 0.3s ease-out',
			},
			keyframes: {
				flash: {
					'0%, 100%': { borderColor: 'rgba(238, 235, 217, 0.1)' },
					'50%': { borderColor: 'rgba(238, 235, 217, 1)' },
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
