import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

const AboutPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans">
			{/* Header */}
			<header className="flex justify-between items-center px-8 py-6 border-b border-gray-800/50 backdrop-blur-sm bg-dark-bg/80 sticky top-0 z-40">
				<div className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Fortify</div>
				<div className="flex gap-4">
					<Link to="/login" className="text-gray-400 hover:text-white font-medium transition-all duration-200 pt-2 hover:scale-105">
						Login
					</Link>
					<Link to="/signup" className="bg-primary hover:bg-primary-hover text-dark-bg font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95">
						Get Started
					</Link>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-6 py-16 flex-grow">
				<div className="mb-14">
					<h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">About Fortify</h1>
					<p className="text-xl text-gray-400 text-center max-w-2xl mx-auto leading-relaxed">The no-nonsense speed trainer for drummers. No AI gimmicks, no monthly subscriptions—just algorithmic progressive overload.</p>
				</div>

				<section className="mb-12">
					<h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Our Mission</h2>
					<div className="bg-card-bg/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 space-y-5 shadow-xl shadow-black/20">
						<p className="text-gray-300 leading-relaxed">
							Fortify was born from a simple frustration: why do drumming apps require constant internet connections, push unnecessary AI features, and lock essential tools behind subscription paywalls?
						</p>
						<p className="text-gray-300 leading-relaxed">
							We believe practice tools should be <span className="text-primary font-semibold">focused, reliable, and yours</span>. No fluff. No lock-in. Just the data and algorithms you need to build speed systematically.
						</p>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">How It Works</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-card-bg/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl shadow-lg">
							<h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Math, Not Magic</h3>
							<p className="text-gray-400 leading-relaxed">We use linear regression to analyze your practice sessions and calculate your exact next BPM target. No guessing. No generic programs.</p>
						</div>
						<div className="bg-card-bg/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl shadow-lg">
							<h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Progressive Overload</h3>
							<p className="text-gray-400 leading-relaxed">Based on sports science principles, Fortify systematically increases difficulty only when you're ready. Build speed safely and sustainably.</p>
						</div>
						<div className="bg-card-bg/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl shadow-lg">
							<h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Always Ready</h3>
							<p className="text-gray-400 leading-relaxed">Works offline as a Progressive Web App. Internet down? Server offline? Your practice never stops. Your data stays on your device.</p>
						</div>
						<div className="bg-card-bg/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-xl shadow-lg">
							<h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Own Your Data</h3>
							<p className="text-gray-400 leading-relaxed">All your practice sessions, progress, and routines are stored locally. Export anytime. No vendor lock-in. You control your data.</p>
						</div>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Our Philosophy</h2>
					<div className="bg-card-bg/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 space-y-6 shadow-xl shadow-black/20">
						<div>
							<h3 className="text-xl font-semibold mb-3">No BS Design</h3>
							<p className="text-gray-400 leading-relaxed">Every feature serves a purpose. We don't add features because they're trendy—we add them because they help you practice better.</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-3">Transparency First</h3>
							<p className="text-gray-400 leading-relaxed">Our algorithms are documented and open. You can see exactly how we calculate your progression. No black boxes. No mystery.</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-3">Built for Drummers</h3>
							<p className="text-gray-400 leading-relaxed">Created by drummers, for drummers. We understand the frustration of plateauing, the importance of consistency, and the need for tools that actually work.</p>
						</div>
					</div>
				</section>

				<section className="mb-12">
					<h2 className="text-3xl font-bold mb-6 text-primary">What You Get</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-4">
							<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
								<span className="text-dark-bg font-bold text-sm">✓</span>
							</div>
							<div>
								<h3 className="font-semibold mb-1">Comprehensive Rudiment Library</h3>
								<p className="text-gray-400 text-sm">40+ standard rudiments with proper notation and technique guidance.</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
								<span className="text-dark-bg font-bold text-sm">✓</span>
							</div>
							<div>
								<h3 className="font-semibold mb-1">Custom Routine Builder</h3>
								<p className="text-gray-400 text-sm">Build personalized practice routines with your own BPM settings and rep counts.</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
								<span className="text-dark-bg font-bold text-sm">✓</span>
							</div>
							<div>
								<h3 className="font-semibold mb-1">Session Tracking</h3>
								<p className="text-gray-400 text-sm">Log practice sessions with detailed metrics. See your progress over time with visual heatmaps.</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
								<span className="text-dark-bg font-bold text-sm">✓</span>
							</div>
							<div>
								<h3 className="font-semibold mb-1">Algorithmic Progression</h3>
								<p className="text-gray-400 text-sm">Get personalized BPM recommendations based on your actual performance data.</p>
							</div>
						</div>
						<div className="flex items-start gap-4">
							<div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
								<span className="text-dark-bg font-bold text-sm">✓</span>
							</div>
							<div>
								<h3 className="font-semibold mb-1">Offline-First PWA</h3>
								<p className="text-gray-400 text-sm">Install on any device. Works completely offline. Your data never leaves your device unless you choose to sync.</p>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-card-bg/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-10 text-center shadow-xl shadow-black/20">
					<h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Ready to Start?</h2>
					<p className="text-gray-400 mb-8 text-lg">Join drummers who are building speed the systematic way.</p>
					<Link to="/signup" className="inline-block bg-primary hover:bg-primary-hover text-dark-bg font-bold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95">
						Get Started Free
					</Link>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default AboutPage;
