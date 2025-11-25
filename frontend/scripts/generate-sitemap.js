// scripts/generate-sitemap.js
const fs = require('fs');
const { createClient } = require('@sanity/client');

// 1. Configure the client (Copy settings from your sanityClient.ts)
const client = createClient({
	projectId: 'nu9cbkjh', // Found in your previous files
	dataset: 'production',
	useCdn: true,
	apiVersion: '2025-11-23',
});

async function generateSitemap() {
	console.log('🗺️  Generating Sitemap...');

	// 2. Fetch all slugs
	const query = `*[_type == "post"] { "slug": slug.current, _updatedAt }`;
	const posts = await client.fetch(query);

	// 3. Define your base URL
	const baseUrl = 'https://fortifydrums.com'; // CHANGE THIS if different

	// 4. Start XML structure
	let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/signup</loc>
    <priority>0.5</priority>
  </url>
`;

	// 5. Add Dynamic Blog Posts
	posts.forEach((post) => {
		if (post.slug) {
			xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post._updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
		}
	});

	xml += `</urlset>`;

	// 6. Write to the public folder
	fs.writeFileSync('./public/sitemap.xml', xml);
	console.log('✅ Sitemap generated at ./public/sitemap.xml');
}

generateSitemap().catch(console.error);
