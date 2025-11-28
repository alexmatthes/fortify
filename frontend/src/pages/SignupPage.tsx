import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
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
			setError(passwordError);
			toast.error(passwordError);
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			await api.post('/auth/signup', { email, password });
			toast.success('Account created! Please log in.');
			navigate('/login');
		} catch (error) {
			toast.error(getErrorMessage(error));
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
					<div>
						<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Email</label>
						<input
							type="email"
							required
							className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Password</label>
						<input
							type="password"
							required
							className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Confirm Password</label>
						<input
							type="password"
							required
							className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					{error && <p className="text-[rgba(238,235,217,0.8)] text-sm bg-[rgba(238,235,217,0.05)] border border-[rgba(238,235,217,0.2)] rounded-lg p-3">{error}</p>}
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
