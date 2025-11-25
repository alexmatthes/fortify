import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/common/Footer';
import Navbar from '../layouts/Navbar';
import { client } from '../lib/sanityClient';
import { BlogPost } from '../types/types';

const BlogIndexPage: React.FC = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);

	useEffect(() => {
		// FIX: Add <BlogPost[]> generic
		client
			.fetch<BlogPost[]>(
				`*[_type == "post"] | order(publishedAt desc) {
                title,
                slug,
                publishedAt,
                mainImage{ asset->{url} },
                "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "..."
            }`
			)
			.then(setPosts);
	}, []);

	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans">
			<Navbar />
			<main className="max-w-5xl mx-auto px-6 py-12">
				<h1 className="text-4xl font-bold mb-8 text-center">
					Fortify <span className="text-primary">Insights</span>
				</h1>
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => {
						// SAFETY CHECK
						if (!post.slug || !post.slug.current) return null;

						return (
							<Link to={`/blog/${post.slug.current}`} key={post.slug.current} className="bg-card-bg rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-colors group">
								{post.mainImage && (
									<div className="h-48 overflow-hidden">
										<img src={post.mainImage.asset.url} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
									</div>
								)}
								<div className="p-6">
									<p className="text-xs text-primary mb-2">{new Date(post.publishedAt).toLocaleDateString()}</p>
									<h2 className="text-xl font-bold mb-3">{post.title}</h2>
									<p className="text-gray-400 text-sm">{post.excerpt}</p>
								</div>
							</Link>
						);
					})}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default BlogIndexPage;
