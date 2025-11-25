import React from 'react';
import { Footer } from '../components/common/Footer';
import Navbar from '../layouts/Navbar';

const PrivacyPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans">
			<Navbar />
			<main className="max-w-5xl mx-auto px-6 py-12">
				<h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
			</main>
			<Footer />
		</div>
	);
};

export default PrivacyPage;
