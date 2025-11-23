export interface Rudiment {
	id: string;
	name: string;
	category: string;
	description?: string;
	tempoIncrement: number;
	isStandard: boolean;
	difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Session {
	id: string;
	date: string;
	duration: number;
	tempo: number;
	quality: number;
	rudimentId: string;
}

export interface DashboardStats {
	totalTime: number;
	fastestTempo: number;
	mostPracticed: string;
}

export interface SessionFormData {
	rudimentId: string;
	duration: string;
	tempo: string;
	quality: string;
}

export interface SessionHistory {
	date: string;
	count: number;
}

export interface BlogPost {
	title: string;
	slug: { current: string };
	mainImage: {
		asset: {
			url: string;
		};
	};
	publishedAt: string;
	excerpt: string;
	body: any; // The raw Portable Text content
	author?: { name: string }; // Optional author
}
