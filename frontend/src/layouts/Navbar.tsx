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
		<nav className="flex justify-between items-center px-8 py-4 bg-[rgba(40,36,39,0.8)] backdrop-blur-[24px] border-b border-[rgba(238,235,217,0.1)] sticky top-0 z-50 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" role="navigation" aria-label="Main navigation">
			<Link to="/dashboard" className="text-2xl font-heading font-semibold tracking-tight text-signal hover:opacity-80 transition-opacity duration-200" aria-label="Fortify home">
				Fortify
			</Link>

			<div className="flex items-center gap-6">
				{/* Main Nav Links */}
				<Link to="/dashboard" className="text-[rgba(238,235,217,0.6)] hover:text-signal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg px-3 py-1.5">
					Dashboard
				</Link>
				<Link to="/rudiments" className="text-[rgba(238,235,217,0.6)] hover:text-signal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg px-3 py-1.5">
					Library
				</Link>

				{/* Profile Dropdown */}
				<div className="relative" ref={dropdownRef}>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						aria-label="User menu"
						aria-expanded={isDropdownOpen}
						aria-haspopup="true"
						className="w-10 h-10 rounded-full bg-transparent border border-[rgba(238,235,217,0.2)] flex items-center justify-center text-signal font-mono font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-signal/50 hover:border-[rgba(238,235,217,0.4)] active:scale-95 active:animate-flash"
					>
						{/* Placeholder Avatar (Initials) */}
						<span aria-hidden="true">U</span>
					</button>

					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-48 bg-[rgba(40,36,39,0.95)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2 animate-fade-in" role="menu" aria-label="User menu">
							<Link to="/settings" className="block px-4 py-2.5 text-sm text-[rgba(238,235,217,0.8)] hover:bg-[rgba(238,235,217,0.05)] hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg mx-2 transition-all duration-200" onClick={() => setIsDropdownOpen(false)} role="menuitem">
								Settings
							</Link>
							<div className="border-t border-[rgba(238,235,217,0.1)] my-1" role="separator" aria-hidden="true"></div>
							<button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-[rgba(238,235,217,0.8)] hover:bg-[rgba(238,235,217,0.05)] hover:text-signal focus:outline-none focus:ring-2 focus:ring-signal/50 rounded-lg mx-2 transition-all duration-200" role="menuitem">
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
