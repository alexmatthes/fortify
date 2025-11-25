import { PortableText } from '@portabletext/react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'; // <--- ADD THIS
import { useParams } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import { client } from '../lib/sanityClient';
import { BlogPost } from '../types/types';

interface BlogPostWithSEO extends Omit<BlogPost, 'mainImage'> {
	seoTitle?: string;
	metaDescription?: string;
	mainImage?: {
		asset: { url: string };
		alt?: string;
	};
}

const BlogPostPage: React.FC = () => {
	const { slug } = useParams();
	const [post, setPost] = useState<BlogPostWithSEO | null>(null);

	useEffect(() => {
		client
			.fetch<BlogPostWithSEO>(
				`*[slug.current == $slug][0]{
                title,
                body,
                publishedAt,
                author->{name},
                // Fetch the new SEO fields
                seoTitle,
                metaDescription,
                mainImage{ 
                    asset->{url},
                    alt 
                }
            }`,
				{ slug }
			)
			.then(setPost);
	}, [slug]);

	if (!post) return <div className="min-h-screen bg-dark-bg text-white p-8">Loading...</div>;

	// Fallbacks if you forget to fill out the SEO fields in Sanity
	const pageTitle = post.seoTitle || post.title;
	const pageDescription = post.metaDescription || 'Master your hands with Fortify Drums.';
	const pageImage = post.mainImage?.asset.url;

	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans">
			{/* --- SEO INJECTION START --- */}
			<Helmet>
				{/* Standard Metadata */}
				<title>{pageTitle} | Fortify</title>
				<meta name="description" content={pageDescription} />

				{/* Open Graph / Facebook / LinkedIn */}
				<meta property="og:type" content="article" />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={pageDescription} />
				{pageImage && <meta property="og:image" content={pageImage} />}

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:description" content={pageDescription} />
				{pageImage && <meta name="twitter:image" content={pageImage} />}
			</Helmet>
			{/* --- SEO INJECTION END --- */}

			<Navbar />
			<article className="max-w-3xl mx-auto px-6 py-12">
				<p className="text-primary text-sm mb-4 text-center">{new Date(post.publishedAt).toLocaleDateString()}</p>
				<h1 className="text-4xl md:text-5xl font-bold mb-8 text-center leading-tight">{post.title}</h1>

				{post.mainImage && (
					<img
						src={post.mainImage.asset.url}
						alt={post.mainImage.alt || post.title} // <--- Use the new Alt text
						className="w-full h-auto rounded-xl mb-10 border border-gray-800"
					/>
				)}

				<div className="prose prose-invert prose-lg max-w-none">
					<PortableText value={post.body} />
				</div>
			</article>
		</div>
	);
};

export default BlogPostPage;
