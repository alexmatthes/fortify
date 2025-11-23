import { PortableText } from '@portabletext/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { client } from '../sanityClient';
import { BlogPost } from '../types';

const BlogPostPage: React.FC = () => {
	const { slug } = useParams();
	const [post, setPost] = useState<BlogPost | null>(null);

	useEffect(() => {
		// FIX: Add <BlogPost> generic (singular, not array)
		client
			.fetch<BlogPost>(
				`*[slug.current == $slug][0]{
                title,
                body,
                mainImage{ asset->{url} },
                publishedAt,
                author->{name}
            }`,
				{ slug } // Pass params as second argument
			)
			.then(setPost);
	}, [slug]);

	if (!post) return <div className="min-h-screen bg-dark-bg text-white p-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans">
			<Navbar />
			<article className="max-w-3xl mx-auto px-6 py-12">
				<p className="text-primary text-sm mb-4 text-center">{new Date(post.publishedAt).toLocaleDateString()}</p>
				<h1 className="text-4xl md:text-5xl font-bold mb-8 text-center leading-tight">{post.title}</h1>

				{post.mainImage && <img src={post.mainImage.asset.url} alt={post.title} className="w-full h-auto rounded-xl mb-10 border border-gray-800" />}

				{/* Rich Text Content */}
				<div className="prose prose-invert prose-lg max-w-none">
					<PortableText value={post.body} />
				</div>
			</article>
		</div>
	);
};

export default BlogPostPage;
