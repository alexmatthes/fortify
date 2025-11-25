import React, { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string; // Allow custom classes for the bento grid spans
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
	return (
		<div className={`bg-surface/80 backdrop-blur-sm p-6 rounded-2xl border border-card-border shadow-xl shadow-black/20 transition-all duration-300 hover:scale-[1.01] hover:border-card-border hover:shadow-2xl hover:shadow-black/30 card-gradient relative overflow-hidden ${className}`}>
			{children}
		</div>
	);
};

export default Card;
