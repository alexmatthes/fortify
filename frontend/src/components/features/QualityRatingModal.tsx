import React from 'react';
import { X } from 'lucide-react';

interface QualityRatingModalProps {
	isOpen: boolean;
	rudimentName: string;
	onRate: (rating: number) => void;
	onSkip: () => void;
}

const QualityRatingModal: React.FC<QualityRatingModalProps> = ({ isOpen, rudimentName, onRate, onSkip }) => {
	if (!isOpen) return null;

	const ratings = [
		{ value: 1, label: 'Poor', description: 'Struggled significantly' },
		{ value: 2, label: 'Fair', description: 'Some difficulty' },
		{ value: 3, label: 'Good', description: 'Performed well' },
		{ value: 4, label: 'Great', description: 'Excellent execution' },
	];

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
			<div className="bg-card-bg/95 backdrop-blur-xl w-full max-w-md rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-heading font-bold text-signal">Rate Your Performance</h2>
					<button
						onClick={onSkip}
						className="text-gray-400 hover:text-signal transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800/50 active:scale-95"
						aria-label="Skip rating"
					>
						<X size={20} />
					</button>
				</div>

				<p className="text-gray-300 mb-6 text-center">
					How did you perform on <span className="text-signal font-semibold">{rudimentName}</span>?
				</p>

				<div className="grid grid-cols-2 gap-3 mb-6">
					{ratings.map((rating) => (
						<button
							key={rating.value}
							onClick={() => onRate(rating.value)}
							className="bg-[rgba(40,36,39,0.7)] backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 text-left hover:border-signal/50 hover:bg-signal/5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-signal/50 group"
							aria-label={`Rate ${rating.value}: ${rating.label}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<span className="text-2xl font-black text-signal">{rating.value}</span>
								<span className="text-sm font-semibold text-gray-200 group-hover:text-signal transition-colors">{rating.label}</span>
							</div>
							<p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{rating.description}</p>
						</button>
					))}
				</div>

				<button
					onClick={onSkip}
					className="w-full text-center text-sm text-gray-400 hover:text-signal transition-colors duration-200 py-2"
					aria-label="Skip and use default rating"
				>
					Skip (defaults to Great)
				</button>
			</div>
		</div>
	);
};

export default QualityRatingModal;

