import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Define the expected response type locally or in types.ts
			const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
			localStorage.setItem('token', data.token);
			toast.success('Welcome back!');
			navigate('/dashboard');
		} catch (error: any) {
			console.error(error);
			toast.error(error.response?.data?.message || 'Login failed.');
		}
	};

	return (
		<div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 text-white">
			<div className="max-w-md w-full bg-card-bg p-8 rounded-xl border border-gray-800 shadow-2xl">
				<h2 className="text-3xl font-bold mb-6 text-center">Login to Fortify</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-400 mb-1">Email</label>
						<input type="email" required className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-2 focus:border-primary outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1">Password</label>
						<input type="password" required className="w-full bg-dark-bg border border-gray-600 rounded px-4 py-2 focus:border-primary outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
					</div>
					<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors">
						Log In
					</button>
				</form>
				<p className="mt-6 text-center text-gray-400">
					Don't have an account?{' '}
					<Link to="/signup" className="text-primary hover:underline">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
