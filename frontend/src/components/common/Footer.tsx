import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-surface/60 backdrop-blur-sm border-t border-card-border py-12 mt-20">
			<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<span className="text-xl font-heading font-bold block mb-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Fortify</span>
					<p className="text-gray-500 text-sm font-mono">&copy; {new Date().getFullYear()} Fortify Drums.</p>
				</div>

				<div className="flex gap-8 text-sm text-gray-400">
					<Link to="/blog" className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer">
						Blog
					</Link>
					<Link to="/contact" className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer">
						Contact
					</Link>
					<Link to="/privacy" className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer">
						Privacy Policy
					</Link>
					<Link to="/terms" className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer">
						Terms of Service
					</Link>
					<Link to="/about" className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer">
						About
					</Link>
				</div>
			</div>
		</footer>
	);
};
