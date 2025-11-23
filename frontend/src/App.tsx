import posthog from 'posthog-js';
import React, { useEffect } from 'react'; // Added useEffect
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'; // Added useLocation

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
import PublicRoute from './components/PublicRoute';

import './App.css';

// Helper Component to track page changes
function PostHogPageTracker() {
	const location = useLocation();
	useEffect(() => {
		if (process.env.REACT_APP_POSTHOG_KEY) {
			posthog.capture('$pageview');
		}
	}, [location]);
	return null;
}

function App() {
	const isAuthenticated = !!localStorage.getItem('token');

	return (
		<BrowserRouter>
			<PostHogPageTracker />
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

				{/* Protected Routes */}
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
				<Route
					path="/login"
					element={
						<PublicRoute>
							<LoginPage />
						</PublicRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<PublicRoute>
							<SignupPage />
						</PublicRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
