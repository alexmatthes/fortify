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
	body: any;
	author?: { name: string };
}

// Used for the Drag-and-Drop Builder
export interface RoutineItem {
	id: string;
	rudimentId: string;
	rudimentName: string;
	duration: number;
	order: number;
}

export interface CreateRoutinePayload {
	name: string;
	description?: string;
	items: {
		rudimentId: string;
		duration: number;
		order: number;
	}[];
}

// --- ADD THIS NEW INTERFACE ---
// Used when fetching a full routine from the API
export interface Routine {
	id: string;
	name: string;
	description?: string;
	items: {
		id: string;
		order: number;
		duration: number;
		rudiment: Rudiment; // Nested full rudiment object
		targetTempo: number;
		tempoMode: 'MANUAL' | 'SMART';
		restDuration: number;
	}[];
}
