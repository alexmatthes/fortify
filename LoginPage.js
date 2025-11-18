import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// 'useState' is a "Hook" that lets you add a 'state variable' to a component.
// It's how you store data that can change, like what a user is typing.

function LoginPage() {
	// 1. Create state variables
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	// This function will run when the user clicks "Login"
	const handleLogin = async (event) => {
		// Make the function 'async'
		event.preventDefault(); // Stop the page from refreshing

		try {
			// 1. Send the email and password to your backend API
			const response = await api.post(
				'/auth/login', // Your backend's login URL
				{
					email: email, // The 'email' state variable
					password: password, // The 'password' state variable
				}
			);

			// 2. If login is successful, the API sends back a token
			const { token } = response.data;

			// 3. Save the token!
			// 'localStorage' is a simple storage built into your browser.
			// It's like a tiny, insecure notepad.
			localStorage.setItem('token', token);

			// 4. Log the token and redirect (for testing)
			console.log('Login successful, token saved:', token);

			// We will redirect to the dashboard here
			navigate('/');
		} catch (error) {
			// If the API sends back a 400 or 500 error, 'axios' will 'catch' it
			console.error('Login failed:', error.response.data.message);
			// You could set an error message in state here to show the user
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{/* This is a 'controlled form'. 
        The 'value' is tied to our state.
        The 'onChange' event updates our state.
      */}
			<form onSubmit={handleLogin}>
				<div>
					<label>Email:</label>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div>
					<label>Password:</label>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<button type="submit">Login</button>
			</form>
			<p>
				Need an account? <Link to="/signup">Sign up</Link>
			</p>
		</div>
	);
}

export default LoginPage;
