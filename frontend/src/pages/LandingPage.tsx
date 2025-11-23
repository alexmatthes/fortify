import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import { BlogPost } from '../types';

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
		<div className="min-h-screen bg-dark-bg text-white flex flex-col font-sans">
			{/* Header */}
			<header className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
				<div className="text-2xl font-bold tracking-wide">Fortify</div>
				<div className="flex gap-4">
					<Link to="/blog" className="text-gray-400 hover:text-white font-medium transition-colors pt-2 hidden md:block">
						Blog
					</Link>
					<Link to="/login" className="text-gray-400 hover:text-white font-medium transition-colors pt-2">
						Login
					</Link>
					<Link to="/signup" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
						Get Started
					</Link>
				</div>
			</header>

			{/* Hero */}
			<main className="flex-grow">
				<section className="max-w-4xl mx-auto px-6 py-24 text-center">
					<h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
						Master your hands.
						<br />
						<span className="text-primary">Own your data.</span>
					</h1>
					<p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">The no-nonsense speed trainer for drummers. No AI gimmicks, no monthly subscriptions—just algorithmic progressive overload.</p>
					<Link to="/signup" className="inline-block bg-white text-dark-bg font-bold text-lg py-4 px-10 rounded-full hover:bg-gray-200 transition-transform transform hover:-translate-y-1 shadow-xl">
						Start Training Free
					</Link>
				</section>

				{/* Philosophy Grid */}
				<section className="bg-card-bg border-y border-gray-800 py-20">
					<div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
						<div>
							<h3 className="text-2xl font-bold mb-4 text-primary">Math, Not Magic.</h3>
							<p className="text-gray-400 leading-relaxed">We use linear regression and progressive overload principles to calculate your exact next step.</p>
						</div>
						<div>
							<h3 className="text-2xl font-bold mb-4 text-primary">Always Ready.</h3>
							<p className="text-gray-400 leading-relaxed">Internet down? Server offline? Fortify works offline as a PWA so your practice never stops.</p>
						</div>
					</div>
				</section>

				{/* NEW: Latest News Section */}
				{latestPosts.length > 0 && (
					<section className="py-20 px-6 max-w-6xl mx-auto">
						<div className="flex justify-between items-end mb-8">
							<h2 className="text-3xl font-bold">Latest Updates</h2>
							<Link to="/blog" className="text-primary hover:underline">
								View all articles →
							</Link>
						</div>
						<div className="grid md:grid-cols-3 gap-6">
							{latestPosts.map((post) => {
								// SAFETY CHECK: If the post is missing a slug, skip it to prevent a crash
								if (!post.slug || !post.slug.current) return null;

								return (
									<Link key={post.slug.current} to={`/blog/${post.slug.current}`} className="group block bg-card-bg border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
										{post.mainImage && (
											<div className="h-40 overflow-hidden">
												<img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
											</div>
										)}
										<div className="p-5">
											<p className="text-xs text-gray-500 mb-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
											<h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
											<p className="text-sm text-gray-400 line-clamp-3">{post.excerpt}</p>
										</div>
									</Link>
								);
							})}
						</div>
					</section>
				)}
			</main>

			{/* Footer */}
			<footer className="bg-card-bg border-t border-gray-800 py-12">
				<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="text-center md:text-left">
						<span className="text-xl font-bold block mb-1">Fortify</span>
						<p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Fortify Drums.</p>
					</div>

					<div className="flex gap-8 text-sm text-gray-400">
						<Link to="/blog" className="hover:text-white transition-colors">
							Blog
						</Link>
						<Link to="/login" className="hover:text-white transition-colors">
							Login
						</Link>
						<Link to="/signup" className="hover:text-white transition-colors">
							Sign Up
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
