import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function SignupPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			// 1. Create the account
			await api.post('/auth/signup', { email, password });

			// 2. Auto-login immediately after signup (Better UX!)
			const loginResponse = await api.post('/auth/login', { email, password });
			localStorage.setItem('token', loginResponse.data.token);

			// 3. Redirect to Dashboard
			navigate('/');
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to create account.');
		}
	};

	return (
		<div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
			<div className="bg-card-bg w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-800">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
					<p className="text-gray-400">Start tracking your drumming journey today</p>
				</div>

				{error && <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

				<form onSubmit={handleSignup} className="space-y-6">
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
						<p className="text-xs text-gray-500 mt-2">Must be at least 6 characters long.</p>
					</div>

					<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
						Create Account
					</button>
				</form>

				<div className="mt-6 text-center text-gray-400 text-sm">
					Already have an account?{' '}
					<Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
}

export default SignupPage;
