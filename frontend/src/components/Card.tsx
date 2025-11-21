import React, { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string; // Allow custom classes for the bento grid spans
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
	return <div className={`bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg transition-transform hover:scale-[1.02] ${className}`}>{children}</div>;
};

export default Card;
