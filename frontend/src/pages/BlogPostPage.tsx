import { PortableText, PortableTextComponents } from '@portabletext/react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'; // <--- ADD THIS
import { Link, useParams } from 'react-router-dom';
import { Footer } from '../components/common/Footer';
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

const portableTextComponents: PortableTextComponents = {
	block: {
		h1: ({ children }) => <h1 className="text-4xl font-heading font-semibold mt-12 mb-6 text-signal">{children}</h1>,
		h2: ({ children }) => <h2 className="text-3xl font-heading font-semibold mt-10 mb-4 text-signal">{children}</h2>,
		h3: ({ children }) => <h3 className="text-2xl font-heading font-semibold mt-8 mb-3 text-signal">{children}</h3>,
		normal: ({ children }) => <p className="text-[rgba(238,235,217,0.8)] leading-[1.6] mb-6 text-lg">{children}</p>,
		blockquote: ({ children }) => <blockquote className="border-l-4 border-[rgba(238,235,217,0.3)] pl-6 italic text-[rgba(238,235,217,0.6)] my-8 text-lg leading-[1.6]">{children}</blockquote>,
	},
	list: {
		bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-[rgba(238,235,217,0.8)] mb-6 text-lg leading-[1.6]">{children}</ul>,
		number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-[rgba(238,235,217,0.8)] mb-6 text-lg leading-[1.6]">{children}</ol>,
	},
	marks: {
		link: ({ children, value }) => (
			<a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-signal underline hover:opacity-80 transition-opacity duration-200">
				{children}
			</a>
		),
		strong: ({ children }) => <strong className="text-signal font-semibold">{children}</strong>,
		em: ({ children }) => <em className="text-[rgba(238,235,217,0.8)] italic">{children}</em>,
	},
};

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

			<article className="max-w-[700px] mx-auto px-6 py-16">
				<p className="text-primary text-sm mb-4 text-center font-mono">{new Date(post.publishedAt).toLocaleDateString()}</p>
				<h1 className="text-4xl md:text-5xl font-heading font-bold mb-10 text-center leading-tight">{post.title}</h1>

				{post.mainImage && (
					<img
						src={post.mainImage.asset.url}
						alt={post.mainImage.alt || post.title}
						className="w-full h-auto rounded-xl mb-12 border border-card-border shadow-xl"
					/>
				)}

				<div className="max-w-none space-y-6">
					<PortableText value={post.body} components={portableTextComponents} />
				</div>
			</article>
			<Footer />
		</div>
	);
};

export default BlogPostPage;
