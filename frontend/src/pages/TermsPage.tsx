import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

const TermsPage: React.FC = () => {
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

			<main className="max-w-[700px] mx-auto px-6 py-16 flex-grow">
				<div className="mb-12">
					<h1 className="text-5xl font-heading font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Terms of Service</h1>
					<p className="text-gray-400 text-center text-sm font-mono">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
				</div>

				<div className="prose prose-invert prose-lg max-w-none space-y-8">
					<style>{`
						.prose p { font-size: 18px; line-height: 1.6; }
						.prose ul li, .prose ol li { font-size: 18px; line-height: 1.6; }
					`}</style>
					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Agreement to Terms</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							By accessing or using Fortify ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
						</p>
						<p className="text-gray-300 leading-relaxed">These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Use License</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							Permission is granted to temporarily use Fortify for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
						</p>
						<ul className="space-y-2 text-gray-300 list-disc list-inside leading-relaxed">
							<li>Modify or copy the materials</li>
							<li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
							<li>Attempt to decompile or reverse engineer any software contained in Fortify</li>
							<li>Remove any copyright or other proprietary notations from the materials</li>
							<li>Transfer the materials to another person or "mirror" the materials on any other server</li>
						</ul>
						<p className="text-gray-300 leading-relaxed mt-4">This license shall automatically terminate if you violate any of these restrictions and may be terminated by Fortify at any time.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">User Accounts</h2>
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold mb-2">Account Creation</h3>
								<p className="text-gray-300 leading-relaxed">
									To access certain features of the Service, you must register for an account. When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your account
									credentials.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Account Security</h3>
								<p className="text-gray-300 leading-relaxed">
									You are responsible for maintaining the security of your account and password. Fortify cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
								</p>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Account Termination</h3>
								<p className="text-gray-300 leading-relaxed">
									You may delete your account at any time. Upon termination, your right to use the Service will immediately cease. You may request deletion of your account data, subject to our Privacy Policy.
								</p>
							</div>
						</div>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">User Conduct</h2>
						<p className="text-gray-300 leading-relaxed mb-4">You agree not to:</p>
						<ul className="space-y-2 text-gray-300 list-disc list-inside leading-relaxed">
							<li>Use the Service for any unlawful purpose or to solicit others to perform unlawful acts</li>
							<li>Violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
							<li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
							<li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
							<li>Submit false or misleading information</li>
							<li>Upload or transmit viruses or any other type of malicious code</li>
							<li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
							<li>Attempt to gain unauthorized access to the Service, other accounts, computer systems, or networks</li>
						</ul>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Data Ownership</h2>
						<div className="space-y-4">
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Your Data:</strong> You retain ownership of all practice data, routines, sessions, and other content you create or upload to the Service ("User Content"). By using the Service, you
								grant Fortify a limited, non-exclusive, royalty-free license to use, store, and process your User Content solely for the purpose of providing and improving the Service.
							</p>
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Data Export:</strong> You can export your data at any time. We provide tools to download your practice sessions, routines, and progress in standard formats.
							</p>
							<p className="text-gray-300 leading-relaxed">
								<strong className="text-primary">Data Deletion:</strong> You may request deletion of your account and associated data. We will delete your data within 30 days of such request, except as required by law.
							</p>
						</div>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Intellectual Property</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							The Service and its original content, features, and functionality are owned by Fortify and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
						</p>
						<p className="text-gray-300 leading-relaxed">Fortify's trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Fortify.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Service Availability</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							We strive to provide a reliable service, but we do not guarantee that the Service will be available at all times or free from errors. The Service may be temporarily unavailable due to:
						</p>
						<ul className="space-y-2 text-gray-300 list-disc list-inside leading-relaxed">
							<li>Maintenance and updates</li>
							<li>Technical issues or failures</li>
							<li>Circumstances beyond our reasonable control</li>
						</ul>
						<p className="text-gray-300 leading-relaxed mt-4">
							<strong className="text-primary">Offline Functionality:</strong> Fortify is designed to work offline as a Progressive Web App. Many features remain available even when not connected to the internet.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Disclaimer of Warranties</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Fortify and its suppliers and licensors hereby disclaim all warranties of any kind, whether express or implied, statutory, or otherwise, including but not
							limited to any warranties of merchantability, non-infringement, and fitness for a particular purpose.
						</p>
						<p className="text-gray-300 leading-relaxed">Fortify does not warrant that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Limitation of Liability</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							In no event shall Fortify, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of
							profits, data, use, goodwill, or other intangible losses, resulting from:
						</p>
						<ul className="space-y-2 text-gray-300 list-disc list-inside leading-relaxed mb-4">
							<li>Your use or inability to use the Service</li>
							<li>Any conduct or content of third parties on the Service</li>
							<li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
							<li>Any interruption or cessation of transmission to or from the Service</li>
							<li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service</li>
						</ul>
						<p className="text-gray-300 leading-relaxed">The foregoing limitation of liability shall apply to the fullest extent permitted by law in the applicable jurisdiction.</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Indemnification</h2>
						<p className="text-gray-300 leading-relaxed">
							You agree to defend, indemnify, and hold harmless Fortify and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses,
							liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service, or a breach of these Terms.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Governing Law</h2>
						<p className="text-gray-300 leading-relaxed">
							These Terms shall be interpreted and governed by the laws of the jurisdiction in which Fortify operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will
							not be considered a waiver of those rights.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Changes to Terms</h2>
						<p className="text-gray-300 leading-relaxed mb-4">
							We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
						</p>
						<p className="text-gray-300 leading-relaxed">
							What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
						</p>
					</section>

					<section className="bg-card-bg border border-gray-800 rounded-xl p-8">
						<h2 className="text-2xl font-bold mb-4 text-primary">Contact Information</h2>
						<p className="text-gray-300 leading-relaxed mb-4">If you have any questions about these Terms of Service, please contact us:</p>
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

export default TermsPage;
