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
		<div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 text-white relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
			<div className="max-w-md w-full bg-card-bg/80 backdrop-blur-xl p-10 rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Login to Fortify</h2>
					<p className="text-gray-500 text-sm">Welcome back</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
						<input type="email" required className="w-full bg-surface/60 backdrop-blur-sm border border-card-border rounded-lg px-4 h-[50px] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface/80 outline-none transition-all duration-200" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
						<input type="password" required className="w-full bg-surface/60 backdrop-blur-sm border border-card-border rounded-lg px-4 h-[50px] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface/80 outline-none transition-all duration-200" value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
					<Button type="submit" isLoading={isLoading} className="w-full">
						Log In
					</Button>
				</form>
				<p className="mt-8 text-center text-gray-400">
					Don't have an account?{' '}
					<Link to="/signup" className="text-primary hover:text-cyan-300 font-semibold transition-colors duration-200">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
