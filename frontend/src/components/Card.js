import React from 'react';

const Card = ({ children, className = '' }) => {
	return (
		<div className={`relative group bg-card-bg border border-card-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-600 ${className}`}>
			{/* Inner Glow effect on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
			<div className="relative z-10 p-6 h-full">{children}</div>
		</div>
	);
};

export default Card;
