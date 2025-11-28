import React from 'react';
import { Footer } from '../components/common/Footer';

const SettingsPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg p-8 text-signal">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-signal">Settings</h1>

				<section className="mb-8">
					<h2 className="text-xl font-heading font-semibold mb-6 text-signal">Profile</h2>
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Email</label>
							<input disabled type="text" value="user@example.com" className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-[rgba(238,235,217,0.4)] cursor-not-allowed" />
						</div>
						<button className="text-signal hover:opacity-80 font-semibold text-sm transition-opacity duration-200">Change Password</button>
					</div>
				</section>

				<section>
					<h2 className="text-xl font-heading font-semibold mb-6 text-signal">Preferences</h2>
					<div className="flex items-center justify-between py-4 border-b border-[rgba(238,235,217,0.1)] last:border-0">
						<span className="text-[rgba(238,235,217,0.8)] font-medium">Metronome Sound</span>
						<select className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[50px] text-sm text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200">
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
