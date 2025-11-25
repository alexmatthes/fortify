import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

const PrivacyPage: React.FC = () => {
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

			<main className="max-w-4xl mx-auto px-6 py-12 flex-grow">
				<div className="mb-12">
					<h1 className="text-5xl font-bold mb-6 text-center">Privacy Policy</h1>
					<p className="text-gray-400 text-center text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
				</div>

				<div className="prose prose-invert prose-lg max-w-none space-y-8">
					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Introduction</h2>
						<p className="text-gray-300 leading-relaxed mb-4">At Fortify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
						<p className="text-gray-300 leading-relaxed">By using Fortify, you agree to the collection and use of information in accordance with this policy.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Information We Collect</h2>
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold mb-2">Account Information</h3>
								<p className="text-gray-300 leading-relaxed">When you create an account, we collect your email address and password (encrypted). This information is necessary for account authentication and management.</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Practice Data</h3>
								<p className="text-gray-300 leading-relaxed">
									All practice sessions, routines, BPM settings, and progress data are stored locally on your device. This data remains under your control and is not automatically transmitted to our servers unless you explicitly
									choose to sync or back up your data.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Usage Information</h3>
								<p className="text-gray-300 leading-relaxed">
									We may collect anonymized usage statistics to improve the application. This includes feature usage patterns, error logs, and performance metrics. No personally identifiable information is included in this data.
								</p>
							</div>
						</div>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">How We Use Your Information</h2>
						<ul className="space-y-3 text-gray-300 list-disc list-inside leading-relaxed">
							<li>To provide and maintain our service</li>
							<li>To authenticate your account and ensure security</li>
							<li>To improve and optimize the application</li>
							<li>To communicate with you about your account or our services</li>
							<li>To comply with legal obligations</li>
						</ul>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Data Storage and Security</h2>
						<div className="space-y-4">
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Local-First Approach:</strong> Your practice data is stored locally on your device by default. We follow a "local-first" architecture, meaning your data lives on your device first and
								foremost.
							</p>
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Encryption:</strong> All passwords are hashed using industry-standard encryption. Any data transmitted to our servers (when you choose to sync) is encrypted in transit using SSL/TLS.
							</p>
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Data Export:</strong> You can export your data at any time. Your practice sessions, routines, and progress can be downloaded in a standard format.
							</p>
						</div>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Data Sharing and Disclosure</h2>
						<p className="text-gray-300 leading-relaxed mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
						<ul className="space-y-3 text-gray-300 list-disc list-inside leading-relaxed">
							<li>
								<strong className="text-primary">Service Providers:</strong> We may employ third-party companies to facilitate our service (e.g., hosting, analytics). These providers have access to your information only to perform
								tasks on our behalf and are obligated not to disclose or use it for any other purpose.
							</li>
							<li>
								<strong className="text-primary">Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.
							</li>
							<li>
								<strong className="text-primary">With Your Consent:</strong> We may share your information with your explicit consent.
							</li>
						</ul>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Your Rights</h2>
						<p className="text-gray-300 leading-relaxed mb-4">You have the following rights regarding your personal information:</p>
						<ul className="space-y-3 text-gray-300 list-disc list-inside leading-relaxed">
							<li>
								<strong className="text-primary">Access:</strong> Request access to your personal data
							</li>
							<li>
								<strong className="text-primary">Correction:</strong> Request correction of inaccurate data
							</li>
							<li>
								<strong className="text-primary">Deletion:</strong> Request deletion of your account and associated data
							</li>
							<li>
								<strong className="text-primary">Export:</strong> Export your practice data at any time
							</li>
							<li>
								<strong className="text-primary">Opt-Out:</strong> Opt out of non-essential data collection
							</li>
						</ul>
						<p className="text-gray-300 leading-relaxed mt-4">To exercise these rights, please contact us through our contact page or email.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Cookies and Tracking</h2>
						<p className="text-gray-300 leading-relaxed">
							Fortify may use cookies and similar tracking technologies to track activity on our service. Most cookies are essential for the application to function properly. We may also use analytics cookies to understand how the
							application is used, but these are anonymized and do not contain personal information.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Children's Privacy</h2>
						<p className="text-gray-300 leading-relaxed">
							Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please
							contact us, and we will take steps to delete such information.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Changes to This Privacy Policy</h2>
						<p className="text-gray-300 leading-relaxed">
							We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy
							periodically for any changes.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Contact Us</h2>
						<p className="text-gray-300 leading-relaxed mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
						<ul className="space-y-2 text-gray-300 leading-relaxed">
							<li>Through our contact form on the Contact page</li>
							<li>Via email at the address provided in our contact information</li>
						</ul>
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default PrivacyPage;
