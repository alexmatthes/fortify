import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';
import api from '../services/api';

const ContactPage: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');
		setErrorMessage('');

		try {
			await api.post('/contact/submit', formData);
			setSubmitStatus('success');
			setFormData({ name: '', email: '', subject: '', message: '' });
		} catch (error: any) {
			console.error('Contact form submission error:', error);
			setSubmitStatus('error');
			// Extract error message from response
			if (error.response?.data) {
				const data = error.response.data;
				// Handle Zod validation errors (array of error objects)
				if (Array.isArray(data)) {
					const messages = data.map((err: any) => err.message || `${err.path?.join('.')}: ${err.message}`).join(', ');
					setErrorMessage(messages);
				} else if (data.message) {
					setErrorMessage(data.message);
				} else if (data.error) {
					setErrorMessage(data.error);
				} else {
					setErrorMessage('Please check your input and try again.');
				}
			} else if (error.userMessage) {
				setErrorMessage(error.userMessage);
			} else {
				setErrorMessage('Something went wrong. Please try again later.');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

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
					<h1 className="text-5xl font-bold mb-6 text-center">Contact Us</h1>
					<p className="text-xl text-gray-400 text-center max-w-2xl mx-auto leading-relaxed">Have a question, suggestion, or found a bug? We'd love to hear from you.</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12">
					{/* Contact Information */}
					<div>
						<h2 className="text-2xl font-bold mb-6 text-primary">Get in Touch</h2>
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
								<p className="text-gray-400">For general questions, feature requests, or feedback, please use the contact form.</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Bug Reports</h3>
								<p className="text-gray-400">Found a bug? Please include as much detail as possible in your message, including steps to reproduce.</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Feature Requests</h3>
								<p className="text-gray-400">Have an idea for a feature? We're always looking for ways to improve Fortify while staying true to our "no BS" philosophy.</p>
							</div>
						</div>

						<div className="mt-8 bg-card-bg border border-gray-800 rounded-xl p-6">
							<h3 className="text-lg font-semibold mb-4">Response Time</h3>
							<p className="text-gray-400 text-sm">We typically respond to all inquiries within 2-3 business days. For urgent issues, please mark your message as "Urgent" in the subject line.</p>
						</div>
					</div>

					{/* Contact Form */}
					<div>
						<form onSubmit={handleSubmit} className="bg-card-bg border border-gray-800 rounded-xl p-8 space-y-6">
							<div>
								<label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
									Name <span className="text-red-400">*</span>
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
									placeholder="Your name"
								/>
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
									Email <span className="text-red-400">*</span>
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
									placeholder="your.email@example.com"
								/>
							</div>

							<div>
								<label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
									Subject <span className="text-red-400">*</span>
								</label>
								<select
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									required
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none"
								>
									<option value="">Select a subject</option>
									<option value="general">General Inquiry</option>
									<option value="bug">Bug Report</option>
									<option value="feature">Feature Request</option>
									<option value="support">Technical Support</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
									Message <span className="text-red-400">*</span>
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows={6}
									className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors outline-none resize-none"
									placeholder="Your message here..."
								/>
							</div>

							{submitStatus === 'success' && <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-green-400 text-sm">Thank you! Your message has been sent. We'll get back to you soon.</div>}

							{submitStatus === 'error' && <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400 text-sm">{errorMessage || 'Something went wrong. Please try again later or email us directly.'}</div>}

							<button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-hover text-dark-bg font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
								{isSubmitting ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default ContactPage;
