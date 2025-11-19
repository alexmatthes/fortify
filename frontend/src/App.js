import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';

import { Toaster } from 'react-hot-toast';

import './App.css';

function App() {
	return (
		<BrowserRouter>
			<Toaster position="top-center" />
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
