import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans">
			{/* Header */}
			<header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
				<div className="text-2xl font-bold tracking-wide">Fortify</div>
				<div className="flex gap-4">
					<Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors pt-2">
						Login
					</Link>
					<Link to="/signup" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-grow">
				<section className="max-w-4xl mx-auto px-6 py-24 text-center">
					<h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
						Master your hands.
						<br />
						<span className="text-primary">Own your data.</span>
					</h1>
					<p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">The no-nonsense speed trainer for drummers. No AI gimmicks, no monthly subscriptions—just algorithmic progressive overload.</p>
					<Link to="/signup" className="inline-block bg-white text-dark-bg font-bold text-lg py-4 px-10 rounded-full hover:bg-gray-200 transition-transform transform hover:-translate-y-1 shadow-xl">
						Start Training Free
					</Link>
				</section>

				{/* Philosophy Grid */}
				<section className="bg-card-bg border-y border-gray-800 py-20">
					<div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
						<div>
							<h3 className="text-2xl font-bold mb-4 text-primary">Math, Not Magic.</h3>
							<p className="text-gray-400 leading-relaxed">We use linear regression and progressive overload principles to calculate your exact next step.</p>
						</div>
						<div>
							<h3 className="text-2xl font-bold mb-4 text-primary">Always Ready.</h3>
							<p className="text-gray-400 leading-relaxed">Internet down? Server offline? Fortify will eventually work offline so your practice never stops.</p>
						</div>
					</div>
				</section>
			</main>

			<footer className="text-center py-8 text-gray-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Fortify. Built by a drummer, for drummers.</p>
			</footer>
		</div>
	);
};

export default LandingPage;
