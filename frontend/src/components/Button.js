import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
	const baseStyles =
		'relative font-mono font-bold uppercase tracking-wider rounded-lg border-2 transition-all duration-75 active:translate-y-[2px] active:shadow-none select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary';

	const variants = {
		primary: 'bg-primary border-primary text-white shadow-[0_4px_0_rgb(29,78,216)] hover:bg-primary-hover hover:border-primary-hover',
		secondary: 'bg-card-bg border-gray-700 text-gray-300 shadow-[0_4px_0_rgb(55,65,81)] hover:border-gray-500 hover:text-white',
		danger: 'bg-red-600 border-red-600 text-white shadow-[0_4px_0_rgb(185,28,28)] hover:bg-red-500',
		// Ghost buttons shouldn't have the heavy pressed effect
		ghost: 'bg-transparent border-transparent text-gray-400 shadow-none hover:text-white hover:bg-white/5 active:translate-y-0',
	};

	return (
		<button className={`${baseStyles} ${variants[variant]} ${className} px-6 py-3`} onClick={onClick} {...props}>
			{children}
		</button>
	);
};

export default Button;
