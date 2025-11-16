// src/components/ProtectedRoute.js
import React from 'react';
// 1. Import 'Navigate' (not 'Maps')
import { Navigate } from 'react-router-dom';

// 2. Get 'children' by destructuring the props object
function ProtectedRoute({ children }) {
	const token = localStorage.getItem('token');

	// 3. Check if token *doesn't* exist
	if (!token) {
		// 4. Return the 'Navigate' component to redirect
		return <Navigate to="/login" />;
	}

	// 5. If token exists, render the 'children' (the page)
	return children;
}

export default ProtectedRoute;
