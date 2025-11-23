import { createClient, type SanityClient } from '@sanity/client';

export const client: SanityClient = createClient({
	projectId: 'nu9cbkjh', // <--- RE-PASTE YOUR ID HERE
	dataset: 'production',
	useCdn: true,
	apiVersion: '2023-05-03',
});
