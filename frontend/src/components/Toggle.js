import React from 'react';

const Toggle = ({ label, checked, onChange }) => {
	return (
		<div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
			{/* The Switch Housing */}
			<div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out border border-gray-700 ${checked ? 'bg-primary/20 border-primary' : 'bg-dark-bg'}`}>
				{/* The Switch Knob */}
				<div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-out ${checked ? 'translate-x-6 bg-primary' : 'translate-x-0 bg-gray-500'}`} />
			</div>
			{label && <span className="text-sm font-mono text-gray-400 group-hover:text-white transition-colors select-none">{label}</span>}
		</div>
	);
};

export default Toggle;
