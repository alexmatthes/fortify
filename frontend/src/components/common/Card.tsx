import React, { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string; // Allow custom classes for the bento grid spans
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
	return (
		<div className={`bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] -webkit-backdrop-blur-[24px] p-6 rounded-2xl border border-[rgba(238,235,217,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 relative overflow-hidden ${className}`}>
			{children}
		</div>
	);
};

export default Card;
