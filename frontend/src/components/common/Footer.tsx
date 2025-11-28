import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-[rgba(40,36,39,0.6)] backdrop-blur-[24px] border-t border-[rgba(238,235,217,0.1)] py-12 mt-20">
			<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<span className="text-xl font-heading font-semibold block mb-1 text-signal">Fortify</span>
					<p className="text-[rgba(238,235,217,0.6)] text-sm font-mono">&copy; {new Date().getFullYear()} Fortify Drums.</p>
				</div>

				<div className="flex gap-8 text-sm text-[rgba(238,235,217,0.6)]">
					<Link to="/blog" className="hover:text-signal transition-colors duration-200 cursor-pointer">
						Blog
					</Link>
					<Link to="/contact" className="hover:text-signal transition-colors duration-200 cursor-pointer">
						Contact
					</Link>
					<Link to="/privacy" className="hover:text-signal transition-colors duration-200 cursor-pointer">
						Privacy Policy
					</Link>
					<Link to="/terms" className="hover:text-signal transition-colors duration-200 cursor-pointer">
						Terms of Service
					</Link>
					<Link to="/about" className="hover:text-signal transition-colors duration-200 cursor-pointer">
						About
					</Link>
				</div>
			</div>
		</footer>
	);
};
