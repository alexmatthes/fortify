import posthog from 'posthog-js';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

// Pages
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RoutineBuilderPage from './pages/RoutineBuilderPage';
import SessionPage from './pages/SessionPage'; // <--- ADD THIS IMPORT
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
				{/* Wrap Public Routes */}
				<Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />

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
					path="/routines/new"
					element={
						<ProtectedRoute>
							<RoutineBuilderPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/session/:routineId"
					element={
						<ProtectedRoute>
							<SessionPage />
						</ProtectedRoute>
					}
				/>

				<Route path="/blog" element={<BlogIndexPage />} />
				<Route path="/blog/:slug" element={<BlogPostPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
