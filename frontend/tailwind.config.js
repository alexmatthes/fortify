/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'dark-bg': '#101922',
				'card-bg': '#1C2834',
				primary: '#2B8CEE',
				'primary-hover': '#1D4ED8',
			},
		},
	},
	plugins: [],
};
