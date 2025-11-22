export interface Rudiment {
	id: string;
	name: string;
	category?: string; // Optional field to match database schema
	description?: string; // Optional field
	tempoIncrement: number;
	isStandard: boolean;
}

export interface Session {
	id: string;
	date: string; // Dates often come from JSON as strings
	duration: number;
	tempo: number;
	rudimentId: string;
}

export interface DashboardStats {
	totalTime: number;
	fastestTempo: number;
	mostPracticed: string;
}

export interface SessionHistory {
	date: string;
	count: number;
}

export interface SessionFormData {
	rudimentId: string;
	duration: string;
	tempo: string;
}
