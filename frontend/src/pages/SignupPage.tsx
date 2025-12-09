import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';
import api from '../services/api';
import { getErrorMessage, getFieldErrors } from '../utils/errorHandler';

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const validatePassword = () => {
		if (password !== confirmPassword) {
			return "Passwords don't match.";
		}
		if (password.length < 8) {
			return 'Password must be at least 8 characters.';
		}
		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
			return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const passwordError = validatePassword();
		if (passwordError) {
			setErrors({ password: passwordError });
			toast.error(passwordError);
			return;
		}
		setErrors({});
		setIsLoading(true);
		try {
			await api.post('/auth/signup', { email, password });
			toast.success('Account created! Please log in.');
			navigate('/login');
		} catch (error) {
			const fieldErrors = getFieldErrors(error);
			if (Object.keys(fieldErrors).length > 0) {
				setErrors(fieldErrors);
			} else {
				toast.error(getErrorMessage(error));
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 text-signal relative overflow-hidden">
			<div className="max-w-md w-full bg-[rgba(40,36,39,0.95)] backdrop-blur-[24px] p-10 rounded-2xl border border-[rgba(238,235,217,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-heading font-semibold mb-2 text-signal">Join Fortify</h2>
					<p className="text-[rgba(238,235,217,0.6)] text-sm">Start your journey today</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-5">
					<FormField label="Email" error={errors.email} required>
						<input
							type="email"
							required
							className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
								errors.email ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
							}`}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (errors.email) setErrors({ ...errors, email: undefined });
							}}
							aria-invalid={!!errors.email}
							aria-describedby={errors.email ? 'email-error' : undefined}
						/>
					</FormField>
					<FormField label="Password" error={errors.password} required>
						<input
							type="password"
							required
							className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
								errors.password ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
							}`}
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								if (errors.password) setErrors({ ...errors, password: undefined });
							}}
							aria-invalid={!!errors.password}
							aria-describedby={errors.password ? 'password-error' : undefined}
						/>
					</FormField>
					<FormField label="Confirm Password" error={errors.confirmPassword} required>
						<input
							type="password"
							required
							className={`w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border rounded-lg px-4 h-[50px] text-signal focus:outline-none transition-all duration-200 ${
								errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-[rgba(238,235,217,0.1)] focus:border-[rgba(238,235,217,0.5)]'
							}`}
							value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value);
								if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
							}}
							aria-invalid={!!errors.confirmPassword}
							aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
						/>
					</FormField>
					<Button type="submit" isLoading={isLoading} className="w-full">
						Create Account
					</Button>
				</form>
				<p className="mt-8 text-center text-[rgba(238,235,217,0.6)]">
					Already have an account?{' '}
					<Link to="/login" className="text-signal hover:opacity-80 font-semibold transition-opacity duration-200">
						Log In
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignupPage;
