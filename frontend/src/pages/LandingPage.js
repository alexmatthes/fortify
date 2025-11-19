import React from 'react';
import { Link } from 'react-router-dom';

// ... imports
function LandingPage() {
	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans overflow-hidden relative">
			{/* Background Glow Effect */}
			<div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

			<header className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
				<div className="text-xl font-bold tracking-tighter font-mono">FORTIFY_</div>
				<div className="flex gap-4 text-sm font-medium">
					<Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
						Login
					</Link>
					<Link to="/signup" className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all">
						Get Started
					</Link>
				</div>
			</header>

			<main className="relative z-10 pt-32 pb-20 px-6 text-center">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-xs text-gray-400 mb-8 font-mono">
					<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
					ALGORITHMIC SPEED TRAINING
				</div>

				<h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
					Master your hands.
					<br />
					<span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-900">Own your data.</span>
				</h1>

				<p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
					No AI gimmicks. No monthly subscriptions. Just <span className="text-white font-semibold">linear regression</span> and <span className="text-white font-semibold">progressive overload</span> to break your drumming plateaus.
				</p>

				<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
					<Link to="/signup" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] w-full md:w-auto">
						Start Training Free
					</Link>
				</div>
			</main>

			{/* Feature Grid - Clean borders */}
			<section className="max-w-7xl mx-auto px-6 pb-32">
				<div className="grid md:grid-cols-3 border-t border-gray-800">
					{[
						{ title: 'Math, Not Magic', desc: 'We use linear regression to calculate your exact next step.' },
						{ title: 'Owned Progress', desc: 'Your tools, not your landlord. Basic tools are always free.' },
						{ title: 'Offline First', desc: 'Respect the practice room. No ads. No distractions.' },
					].map((item, i) => (
						<div key={i} className={`p-8 border-gray-800 ${i !== 2 ? 'md:border-r' : ''}`}>
							<h3 className="text-lg font-bold text-white mb-2 font-mono">{item.title}</h3>
							<p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
						</div>
					))}
				</div>
			</section>

			<footer className="text-center py-8 text-gray-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Fortify. Built by a drummer, for drummers.</p>
			</footer>
		</div>
	);
}

export default LandingPage;
