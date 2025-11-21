export interface Rudiment {
	id: string;
	name: string;
	category: string;
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
