import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Pages
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignupPage';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
	// Helper to determine if user is logged in (for redirecting away from Landing Page)
	const isAuthenticated = !!localStorage.getItem('token');

	return (
		<BrowserRouter>
			<Toaster
				position="top-center"
				toastOptions={{
					style: { background: '#1C2834', color: '#fff' },
				}}
			/>

			<Routes>
				{/* Public Routes */}
				<Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />

				{/* Protected Routes (All include Navbar) */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Navbar />
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/rudiments"
					element={
						<ProtectedRoute>
							<Navbar />
							<LibraryPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<Navbar />
							<SettingsPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
