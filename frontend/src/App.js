// src/App.js

// 1. Import the tools from react-router-dom
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// 2. Import your new page components
import DashboardPage from './pages/DashboardPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		// 3. BrowserRouter is the "wrapper" for your whole app
		<BrowserRouter>
			{/* 4. 'Routes' is the "switch" that shows one page at a time */}
			<Routes>
				{/* 5. These are your 'Route' definitions */}
				<Route path="/login" element={<LoginPage />} />

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/rudiments"
					element={
						<ProtectedRoute>
							<LibraryPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
