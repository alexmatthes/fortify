import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token'); // Destroy the "VIP Pass"
		navigate('/login');
	};

	return (
		// 1. Container: Flexbox, dark background, spacing, and a subtle bottom border
		<nav className="flex justify-between items-center px-8 py-4 bg-card-bg border-b border-gray-800">
			{/* 2. Brand: Large, bold text */}
			<div className="text-2xl font-bold tracking-wide">Fortify</div>

			{/* 3. Links Container: Flex with a gap */}
			<div className="flex items-center gap-6">
				{/* 4. Links: Light gray text that turns white on hover */}
				<Link to="/" className="text-gray-400 hover:text-white text-lg transition-colors duration-200">
					Dashboard
				</Link>

				<Link to="/rudiments" className="text-gray-400 hover:text-white text-lg transition-colors duration-200">
					Library
				</Link>

				{/* 5. Logout Button: Red background with hover effect */}
				<button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium">
					Logout
				</button>
			</div>
		</nav>
	);
}

export default Navbar;
