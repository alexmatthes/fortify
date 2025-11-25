import posthog from 'posthog-js';
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

// Pages
import AboutPage from './pages/AboutPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import RoutineBuilderPage from './pages/RoutineBuilderPage';
import SessionPage from './pages/SessionPage'; // <--- ADD THIS IMPORT
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Navbar from './layouts/Navbar';

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
		<HelmetProvider>
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
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/privacy" element={<PrivacyPage />} />
					<Route path="/terms" element={<TermsPage />} />
					<Route path="/about" element={<AboutPage />} />
				</Routes>
			</BrowserRouter>
		</HelmetProvider>
	);
}

export default App;
