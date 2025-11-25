import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';
import { client } from '../lib/sanityClient';
import { BlogPost } from '../types/types';

const LandingPage: React.FC = () => {
	const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

	// Fetch the 3 most recent posts
	useEffect(() => {
		const query = `*[_type == "post"] | order(publishedAt desc)[0..2] {
            title,
            slug,
            publishedAt,
            mainImage{ asset->{url} },
            "excerpt": array::join(string::split((pt::text(body)), "")[0..120], "") + "..."
        }`;

		// FIX: Add <BlogPost[]> generic to fetch
		client
			.fetch<BlogPost[]>(query)
			.then((data: BlogPost[]) => setLatestPosts(data)) // <--- Explicit type
			.catch(console.error);
	}, []);

	return (
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans relative overflow-hidden">
			{/* Subtle background pattern */}
			<div
				className="absolute inset-0 opacity-[0.02] pointer-events-none"
				style={{
					backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 229, 255, 0.03) 2px, rgba(0, 229, 255, 0.03) 4px),
				                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 229, 255, 0.03) 2px, rgba(0, 229, 255, 0.03) 4px)`,
				}}
			></div>
			{/* Header */}
			<header className="flex justify-between items-center px-8 py-6 border-b border-card-border backdrop-blur-sm bg-dark-bg/80 sticky top-0 z-40">
				<div className="text-2xl font-heading font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Fortify</div>
				<div className="flex gap-4">
					<Link to="/login" className="text-gray-400 hover:text-white font-medium transition-all duration-200 pt-2 hover:scale-105">
						Login
					</Link>
					<Link
						to="/signup"
						className="bg-primary hover:bg-primary-hover text-dark-bg font-bold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95"
					>
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-grow">
				<section className=" mx-auto px-6 py-32 text-center relative">
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.06) 0%, rgba(0, 229, 255, 0.04) 15%, rgba(0, 229, 255, 0.02) 30%, rgba(0, 229, 255, 0.01) 50%, rgba(0, 229, 255, 0.005) 70%, transparent 100%)',
						}}
					></div>
					<h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight relative z-10">
						<span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">Master your hands.</span>
						<br />
						<span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent animate-pulse-slow">Own your data.</span>
					</h1>
					<p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">The no-nonsense speed trainer for drummers. No AI gimmicks, no monthly subscriptions—just algorithmic progressive overload.</p>
					<Link to="/signup" className="inline-block bg-white text-dark-bg font-bold text-lg py-4 px-10 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 outer-glow relative z-10">
						Start Training Free
					</Link>
				</section>

				{/* Philosophy Grid */}
				<section className="bg-card-bg/50 backdrop-blur-sm border-y border-gray-800/50 py-24 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
					<div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
						<div className="glass border border-card-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 card-gradient">
							<h3 className="text-2xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Math, Not Magic.</h3>
							<p className="text-gray-400 leading-relaxed">We use linear regression and progressive overload principles to calculate your exact next step.</p>
						</div>
						<div className="glass border border-card-border rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 card-gradient">
							<h3 className="text-2xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-cyan-300 bg-clip-text text-transparent">Always Ready.</h3>
							<p className="text-gray-400 leading-relaxed">Internet down? Server offline? Fortify works offline as a PWA so your practice never stops.</p>
						</div>
					</div>
				</section>

				{/* NEW: Latest News Section */}
				{latestPosts.length > 0 && (
					<section className="py-24 px-6 max-w-6xl mx-auto">
						<div className="flex justify-between items-end mb-10">
							<h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Latest Updates</h2>
							<Link to="/blog" className="text-primary hover:text-cyan-300 font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-1">
								View all articles <span className="text-lg">→</span>
							</Link>
						</div>
						<div className="grid md:grid-cols-3 gap-6">
							{latestPosts.map((post) => {
								// SAFETY CHECK: If the post is missing a slug, skip it to prevent a crash
								if (!post.slug || !post.slug.current) return null;

								return (
									<Link
										key={post.slug.current}
										to={`/blog/${post.slug.current}`}
										className="group block bg-card-bg/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]"
									>
										{post.mainImage && (
											<div className="h-48 overflow-hidden relative">
												<div className="absolute inset-0 bg-gradient-to-t from-card-bg/80 to-transparent z-10"></div>
												<img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
											</div>
										)}
										<div className="p-6">
											<p className="text-xs text-gray-500 mb-3 font-mono">{new Date(post.publishedAt).toLocaleDateString()}</p>
											<h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-primary transition-colors duration-200">{post.title}</h3>
											<p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
										</div>
									</Link>
								);
							})}
						</div>
					</section>
				)}
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default LandingPage;
