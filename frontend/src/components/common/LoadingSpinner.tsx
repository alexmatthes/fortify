import React from 'react';

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	fullPage?: boolean;
	message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '', fullPage = false, message }) => {
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-8 w-8',
	};

	const spinner = (
		<svg className={`animate-spin ${sizeClasses[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Loading">
			<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
			<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	);

	if (fullPage) {
		return (
			<div className={`min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white relative overflow-hidden ${className}`}>
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
				<div className="relative z-10">
					<div className="relative">
						{spinner}
						<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
					</div>
					{message && <p className="mt-6 text-gray-400 font-medium">{message}</p>}
				</div>
			</div>
		);
	}

	return (
		<div className={`flex items-center justify-center gap-3 ${className}`}>
			<div className="relative">
				{spinner}
				<div className="absolute inset-0 bg-primary/10 blur-md rounded-full"></div>
			</div>
			{message && <span className="text-gray-400 font-medium">{message}</span>}
		</div>
	);
};

export default LoadingSpinner;
