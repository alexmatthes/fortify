import React, { ReactNode } from 'react';

interface CardProps {
	title: string;
	value: string | number;
	icon?: ReactNode;
	trend?: string;
	color?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, trend, color }) => {
	return (
		<div className="bg-card-bg p-6 rounded-xl border border-gray-800 shadow-lg transition-transform hover:scale-[1.02]">
			<div className="flex justify-between items-start mb-4">
				<div>
					<p className="text-gray-400 text-sm uppercase tracking-wider mb-1">{title}</p>
					<h3 className={`text-3xl font-bold ${color || 'text-white'}`}>{value}</h3>
				</div>
				{icon && <div className="text-gray-500">{icon}</div>}
			</div>
			{trend && <p className="text-sm text-green-400">{trend}</p>}
		</div>
	);
};

export default Card;
