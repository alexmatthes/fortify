import { createClient } from '@sanity/client';

export const client = createClient({
	projectId: 'nu9cbkjh', // <--- MAKE SURE THIS IS YOUR REAL ID
	dataset: 'production',
	useCdn: true,
	apiVersion: '2025-11-23',
});
