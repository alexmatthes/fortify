import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger'; // Restrict to specific string values
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
	// Ensure minimum 44x44px touch target for mobile accessibility
	// Rounded rectangles (not pills) - using rounded-lg for soft corners
	const baseStyles = 'font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] relative';

	const variants = {
		primary: 'bg-signal text-dark-bg hover:bg-signal/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-signal/50',
		secondary: 'bg-transparent border border-signal/20 text-signal hover:border-signal/40 hover:bg-signal/5 active:scale-[0.98] active:animate-flash focus:outline-none focus:ring-2 focus:ring-signal/30',
		danger: 'bg-transparent border border-signal/30 text-signal hover:border-signal/60 hover:bg-signal/10 active:scale-[0.98] active:animate-flash focus:outline-none focus:ring-2 focus:ring-signal/30',
	};

	return (
		<button className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading || props.disabled} {...props}>
			{isLoading ? (
				// Spinner
				<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			) : (
				<span>{children}</span>
			)}
		</button>
	);
};

export default Button;
