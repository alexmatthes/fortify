import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function SignupPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			// This matches the route in backend/index.js
			await api.post('/auth/signup', { email, password });
			alert('Signup successful! Please log in.');
			navigate('/login');
		} catch (error) {
			console.error('Signup failed:', error.response?.data?.message);
			alert('Signup failed: ' + (error.response?.data?.message || 'Unknown error'));
		}
	};

	return (
		<div className="auth-container">
			<h2>Create an Account</h2>
			<form onSubmit={handleSignup}>
				<div>
					<label>Email:</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div>
					<label>Password:</label>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				<button type="submit">Sign Up</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Log in here</Link>
			</p>
		</div>
	);
}

export default SignupPage;
