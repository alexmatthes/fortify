import React from 'react';

interface FormFieldProps {
	label: string;
	error?: string;
	required?: boolean;
	children: React.ReactNode;
	className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, required = false, children, className = '' }) => {
	return (
		<div className={`mb-5 ${className}`}>
			<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">
				{label}
				{required && <span className="text-signal ml-1">*</span>}
			</label>
			{children}
			{error && (
				<p className="mt-2 text-sm text-red-400 flex items-center gap-1" role="alert">
					<span aria-hidden="true">⚠</span>
					{error}
				</p>
			)}
		</div>
	);
};

export default FormField;

