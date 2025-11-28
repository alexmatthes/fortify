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
		<div className="min-h-screen bg-dark-bg text-signal flex flex-col font-sans relative overflow-hidden">
			{/* Header */}
			<header className="flex justify-between items-center px-8 py-6 border-b border-[rgba(238,235,217,0.1)] backdrop-blur-[24px] bg-[rgba(40,36,39,0.8)] sticky top-0 z-40">
				<div className="text-2xl font-heading font-semibold tracking-wide text-signal">Fortify</div>
				<div className="flex gap-4">
					<Link to="/login" className="text-[rgba(238,235,217,0.6)] hover:text-signal font-medium transition-colors duration-200 pt-2">
						Login
					</Link>
					<Link
						to="/signup"
						className="bg-signal text-dark-bg font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 hover:bg-signal/95 active:scale-95"
					>
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-grow">
				<section className=" mx-auto px-6 py-32 text-center relative">
					<h1 className="text-5xl md:text-7xl font-heading font-semibold mb-6 tracking-tight relative z-10 text-signal">
						<span>Master your hands.</span>
						<br />
						<span>Own your data.</span>
					</h1>
					<p className="text-xl text-[rgba(238,235,217,0.6)] mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">The no-nonsense speed trainer for drummers. No AI gimmicks, no monthly subscriptions—just algorithmic progressive overload.</p>
					<Link to="/signup" className="inline-block bg-signal text-dark-bg font-semibold text-lg py-4 px-10 rounded-lg hover:bg-signal/95 transition-all duration-200 relative z-10">
						Start Training Free
					</Link>
				</section>

				{/* Philosophy Grid */}
				<section className="bg-[rgba(40,36,39,0.3)] backdrop-blur-[24px] border-y border-[rgba(238,235,217,0.1)] py-24 relative overflow-hidden">
					<div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
						<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-10 transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
							<h3 className="text-2xl font-heading font-semibold mb-5 text-signal">Math, Not Magic.</h3>
							<p className="text-[rgba(238,235,217,0.6)] leading-relaxed">We use linear regression and progressive overload principles to calculate your exact next step.</p>
						</div>
						<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-10 transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
							<h3 className="text-2xl font-heading font-semibold mb-5 text-signal">Always Ready.</h3>
							<p className="text-[rgba(238,235,217,0.6)] leading-relaxed">Internet down? Server offline? Fortify works offline as a PWA so your practice never stops.</p>
						</div>
					</div>
				</section>

				{/* NEW: Latest News Section */}
				{latestPosts.length > 0 && (
					<section className="py-24 px-6 max-w-6xl mx-auto">
						<div className="flex justify-between items-center mb-10">
							<h2 className="text-3xl md:text-4xl font-heading font-semibold text-signal">Latest Updates</h2>
							<Link to="/blog" className="text-signal hover:opacity-80 font-semibold transition-opacity duration-200 flex items-center gap-1">
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
										className="group block bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl overflow-hidden hover:border-[rgba(238,235,217,0.3)] transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
									>
										{post.mainImage && (
											<div className="h-48 overflow-hidden relative">
												<img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
											</div>
										)}
										<div className="p-6">
											<p className="text-xs text-[rgba(238,235,217,0.6)] mb-3 font-mono">{new Date(post.publishedAt).toLocaleDateString()}</p>
											<h3 className="text-lg font-heading font-semibold mb-3 leading-tight text-signal group-hover:opacity-80 transition-opacity duration-200">{post.title}</h3>
											<p className="text-sm text-[rgba(238,235,217,0.6)] line-clamp-3 leading-relaxed">{post.excerpt}</p>
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
