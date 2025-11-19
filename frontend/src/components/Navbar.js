import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	// Close dropdown if clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [dropdownRef]);

	return (
		<nav className="flex justify-between items-center px-8 py-4 bg-card-bg border-b border-gray-800 relative z-50">
			<Link to="/dashboard" className="text-2xl font-bold tracking-wide text-white">
				Fortify
			</Link>

			<div className="flex items-center gap-6">
				{/* Main Nav Links */}
				<Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
					Dashboard
				</Link>
				<Link to="/rudiments" className="text-gray-400 hover:text-white transition-colors">
					Library
				</Link>

				{/* Profile Dropdown */}
				<div className="relative" ref={dropdownRef}>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white font-bold transition-colors focus:outline-none ring-2 ring-transparent focus:ring-primary"
					>
						{/* Placeholder Avatar (Initials) */}U
					</button>

					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-card-bg border border-gray-700 rounded-lg shadow-xl py-2 animate-fade-in">
							<Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>
								Settings
							</Link>
							<div className="border-t border-gray-700 my-1"></div>
							<button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300">
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
