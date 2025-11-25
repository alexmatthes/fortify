import React from 'react';
import { Footer } from '../components/common/Footer';

const SettingsPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-extrabold mb-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Settings</h1>

				<section className="mb-8">
					<h2 className="text-xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Profile</h2>
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
							<input disabled type="text" value="user@example.com" className="w-full bg-surface/60 backdrop-blur-sm border border-card-border rounded-lg px-4 h-[50px] text-gray-500 cursor-not-allowed" />
						</div>
						<button className="text-primary hover:text-cyan-300 font-semibold text-sm transition-colors duration-200 hover:scale-105">Change Password</button>
					</div>
				</section>

				<section>
					<h2 className="text-xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Preferences</h2>
					<div className="flex items-center justify-between py-4 border-b border-card-border last:border-0">
						<span className="text-gray-300 font-medium">Metronome Sound</span>
						<select className="bg-surface/60 backdrop-blur-sm border border-card-border rounded-lg px-4 h-[50px] text-sm text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200">
							<option>Digital Click</option>
							<option>Woodblock</option>
						</select>
					</div>
				</section>
			</div>
			<Footer />
		</div>
	);
};

export default SettingsPage;
