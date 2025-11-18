// src/App.js

// 1. Import the tools from react-router-dom
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// 2. Import your new page components
import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';

import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Navbar></Navbar>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/rudiments"
					element={
						<ProtectedRoute>
							<Navbar></Navbar>
							<LibraryPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
