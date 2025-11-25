import { createClient } from '@sanity/client';

// Define a "fixed" interface that forces the correct signature for fetch
interface FixedSanityClient {
	fetch<T = any>(query: string, params?: Record<string, any>): Promise<T>;
}

// Cast the created client to our fixed interface to resolve the TS2554 error
export const client = createClient({
	projectId: 'nu9cbkjh',
	dataset: 'production',
	useCdn: true,
	apiVersion: '2025-11-23',
}) as unknown as FixedSanityClient;
