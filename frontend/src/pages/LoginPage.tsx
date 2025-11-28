import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
			localStorage.setItem('token', data.token);
			toast.success('Welcome back!');
			navigate('/dashboard');
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
					<h2 className="text-3xl font-heading font-semibold mb-2 text-signal">Login to Fortify</h2>
					<p className="text-[rgba(238,235,217,0.6)] text-sm">Welcome back</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Email</label>
						<input type="email" required className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Password</label>
						<input type="password" required className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200" value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
					<Button type="submit" isLoading={isLoading} className="w-full">
						Log In
					</Button>
				</form>
				<p className="mt-8 text-center text-[rgba(238,235,217,0.6)]">
					Don't have an account?{' '}
					<Link to="/signup" className="text-signal hover:opacity-80 font-semibold transition-opacity duration-200">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
