import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Ensure this path matches your file structure

function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await api.post('/auth/login', { email, password });
			// Save the token and redirect
			localStorage.setItem('token', response.data.token);
			navigate('/');
		} catch (err) {
			setError('Invalid email or password.');
		}
	};

	return (
		// 1. Full Screen Dark Background with Flex Center
		<div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
			{/* 2. The Login Card */}
			<div className="bg-card-bg w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-800">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
					<p className="text-gray-400">Sign in to continue your progress</p>
				</div>

				{/* Error Message */}
				{error && <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

				{/* Form */}
				<form onSubmit={handleLogin} className="space-y-6">
					<div>
						<label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
						<input
							type="email"
							required
							className="w-full bg-dark-bg border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
						<input
							type="password"
							required
							className="w-full bg-dark-bg border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
						Sign In
					</button>
				</form>

				{/* Footer Link */}
				<div className="mt-6 text-center text-gray-400 text-sm">
					Don't have an account?{' '}
					<Link to="/signup" className="text-primary hover:text-primary-hover font-medium transition-colors">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
