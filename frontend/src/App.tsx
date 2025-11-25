import posthog from 'posthog-js';
import React, { Suspense, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import Navbar from './layouts/Navbar';

import './App.css';

// Lazy load pages for code splitting
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const BlogIndexPage = React.lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LibraryPage = React.lazy(() => import('./pages/LibraryPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const RoutineBuilderPage = React.lazy(() => import('./pages/RoutineBuilderPage'));
const SessionPage = React.lazy(() => import('./pages/SessionPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));

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
				{/* Skip to main content link for screen readers */}
				<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-lg focus:font-bold">
					Skip to main content
				</a>
				<PostHogPageTracker />
				<Toaster
					position="top-center"
					toastOptions={{
						style: { 
							background: 'rgba(10, 10, 10, 0.95)',
							color: '#fff',
							border: '1px solid rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(12px)',
							borderRadius: '12px',
							boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
						},
						success: {
							iconTheme: {
								primary: '#00E5FF',
								secondary: '#0f172a',
							},
						},
						error: {
							iconTheme: {
								primary: '#ef4444',
								secondary: '#0f172a',
							},
						},
					}}
				/>

				<Suspense fallback={<LoadingSpinner fullPage message="Loading..." />}>
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
				</Suspense>
			</BrowserRouter>
		</HelmetProvider>
	);
}

export default App;
