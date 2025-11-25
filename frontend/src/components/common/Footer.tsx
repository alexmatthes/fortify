import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-card-bg border-t border-gray-800 py-12">
			<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<span className="text-xl font-bold block mb-1">Fortify</span>
					<p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Fortify Drums.</p>
				</div>

				<div className="flex gap-8 text-sm text-gray-400">
					<Link to="/blog" className="hover:text-white transition-colors">
						Blog
					</Link>
					<Link to="/contact" className="hover:text-white transition-colors">
						Contact
					</Link>
					<Link to="/privacy" className="hover:text-white transition-colors">
						Privacy Policy
					</Link>
					<Link to="/terms" className="hover:text-white transition-colors">
						Terms of Service
					</Link>
					<Link to="/about" className="hover:text-white transition-colors">
						About
					</Link>
				</div>
			</div>
		</footer>
	);
};
