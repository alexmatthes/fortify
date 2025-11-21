import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger'; // Restrict to specific string values
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className = '', ...props }) => {
	const baseStyles = 'font-bold py-2 px-4 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2';

	const variants = {
		primary: 'bg-primary hover:bg-primary-hover text-white shadow-primary/20',
		secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
		danger: 'bg-red-600 hover:bg-red-700 text-white',
	};

	return (
		<button className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading || props.disabled} {...props}>
			{isLoading ? (
				// Simple SVG Spinner
				<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
