import React from 'react';

function SettingsPage() {
	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Settings</h1>

				{/* Profile Section */}
				<section className="bg-card-bg p-6 rounded-xl border border-gray-800 mb-6">
					<h2 className="text-xl font-semibold mb-4">Profile</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm text-gray-400 mb-1">Email</label>
							<input disabled type="text" value="user@example.com" className="w-full bg-dark-bg border border-gray-700 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
						</div>
						<button className="text-primary text-sm hover:underline">Change Password</button>
					</div>
				</section>

				{/* Preferences Section */}
				<section className="bg-card-bg p-6 rounded-xl border border-gray-800">
					<h2 className="text-xl font-semibold mb-4">Preferences</h2>
					<div className="flex items-center justify-between py-2">
						<span className="text-gray-300">Metronome Sound</span>
						<select className="bg-dark-bg border border-gray-700 rounded px-3 py-1 text-sm">
							<option>Digital Click</option>
							<option>Woodblock</option>
						</select>
					</div>
				</section>
			</div>

			<footer className="text-center py-8 text-gray-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Fortify. Built by a drummer, for drummers.</p>
			</footer>
		</div>
	);
}

export default SettingsPage;
