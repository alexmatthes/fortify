import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger'; // Restrict to specific string values
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
	// Ensure minimum 44x44px touch target for mobile accessibility
	const baseStyles = 'font-bold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] relative overflow-hidden group';

	const variants = {
		primary: 'bg-primary hover:bg-primary-hover text-dark-bg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] font-semibold',
		secondary: 'bg-gray-800/80 hover:bg-gray-700/90 text-white border border-gray-700/50 hover:border-gray-600 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm',
		danger: 'bg-red-600/90 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98]',
	};

	return (
		<button className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading || props.disabled} {...props}>
			{isLoading ? (
				// Premium SVG Spinner
				<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			) : (
				<span className="relative z-10">{children}</span>
			)}
			{variant === 'primary' && !isLoading && (
				<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
			)}
		</button>
	);
};

export default Button;
