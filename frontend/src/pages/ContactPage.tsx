import React from 'react';
import { Footer } from '../components/common/Footer';
import Navbar from '../layouts/Navbar';

const ContactPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans">
			<Navbar />
			<main className="max-w-5xl mx-auto px-6 py-12">
				<h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
			</main>
			<Footer />
		</div>
	);
};

export default ContactPage;
