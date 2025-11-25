import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
	const navigate = useNavigate();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	// Close dropdown if clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [dropdownRef]);

	return (
		<nav className="flex justify-between items-center px-8 py-4 bg-card-bg/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 shadow-lg shadow-black/20" role="navigation" aria-label="Main navigation">
			<Link to="/dashboard" className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:from-primary hover:to-cyan-300 transition-all duration-300" aria-label="Fortify home">
				Fortify
			</Link>

			<div className="flex items-center gap-6">
				{/* Main Nav Links */}
				<Link to="/dashboard" className="text-gray-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card-bg rounded-lg px-3 py-1.5 hover:bg-gray-800/30">
					Dashboard
				</Link>
				<Link to="/rudiments" className="text-gray-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card-bg rounded-lg px-3 py-1.5 hover:bg-gray-800/30">
					Library
				</Link>

				{/* Profile Dropdown */}
				<div className="relative" ref={dropdownRef}>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						aria-label="User menu"
						aria-expanded={isDropdownOpen}
						aria-haspopup="true"
						className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-sm transition-all duration-200 focus:outline-none ring-2 ring-transparent focus:ring-primary hover:scale-110 active:scale-95 backdrop-blur-sm"
					>
						{/* Placeholder Avatar (Initials) */}
						<span aria-hidden="true">U</span>
					</button>

					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-card-bg/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 py-2 animate-fade-in" role="menu" aria-label="User menu">
							<Link to="/settings" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-lg mx-2 transition-all duration-200" onClick={() => setIsDropdownOpen(false)} role="menuitem">
								Settings
							</Link>
							<div className="border-t border-gray-700/50 my-1" role="separator" aria-hidden="true"></div>
							<button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg mx-2 transition-all duration-200" role="menuitem">
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
