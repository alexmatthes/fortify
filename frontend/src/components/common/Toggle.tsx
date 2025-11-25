import React from 'react';

interface ToggleProps {
	label: string;
	enabled: boolean;
	onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, enabled, onChange }) => {
	return (
		<div className="flex items-center justify-between">
			<span className="text-gray-300 text-sm font-medium">{label}</span>
			<button
				onClick={() => onChange(!enabled)}
				className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-bg
                    ${enabled ? 'bg-primary' : 'bg-gray-700'}
                `}
			>
				<span
					className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${enabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
				/>
			</button>
		</div>
	);
};

export default Toggle;
