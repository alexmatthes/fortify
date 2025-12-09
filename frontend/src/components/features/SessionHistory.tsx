import { Download, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Rudiment, Session } from '../../types/types';
import { getErrorMessage } from '../../utils/errorHandler';
import Button from '../common/Button';
import FormField from '../common/FormField';

interface SessionHistoryProps {
	rudiments: Rudiment[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ rudiments }) => {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		rudimentId: '',
		quality: '',
		startDate: '',
		endDate: '',
		search: '',
	});
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		fetchSessions();
	}, [page, filters]);

	const fetchSessions = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: '20',
			});
			if (filters.rudimentId) params.append('rudimentId', filters.rudimentId);
			if (filters.quality) params.append('quality', filters.quality);
			if (filters.startDate) params.append('startDate', filters.startDate);
			if (filters.endDate) params.append('endDate', filters.endDate);
			if (filters.search) params.append('search', filters.search);

			const response = await api.get<{ sessions: Session[]; pagination: { totalPages: number } }>(`/sessions?${params}`);
			setSessions(response.data.sessions);
			setTotalPages(response.data.pagination.totalPages);
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async (format: 'csv' | 'json') => {
		try {
			const params = new URLSearchParams({ format });
			if (filters.rudimentId) params.append('rudimentId', filters.rudimentId);
			if (filters.quality) params.append('quality', filters.quality);
			if (filters.startDate) params.append('startDate', filters.startDate);
			if (filters.endDate) params.append('endDate', filters.endDate);
			if (filters.search) params.append('search', filters.search);

			const response = await api.get(`/sessions/export?${params}`, { responseType: 'blob' });
			const blob = new Blob([response.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `sessions.${format}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			toast.success(`Exported ${format.toUpperCase()} successfully`);
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const clearFilters = () => {
		setFilters({ rudimentId: '', quality: '', startDate: '', endDate: '', search: '' });
		setPage(1);
	};

	return (
		<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-xl font-heading font-semibold text-signal">Session History</h3>
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => handleExport('csv')} className="text-xs px-3 py-1.5">
						<Download size={14} className="mr-1" />
						CSV
					</Button>
					<Button variant="secondary" onClick={() => handleExport('json')} className="text-xs px-3 py-1.5">
						<Download size={14} className="mr-1" />
						JSON
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
				<FormField label="Search" className="md:col-span-2">
					<div className="relative">
						<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(238,235,217,0.4)]" />
						<input
							type="text"
							placeholder="Search rudiments..."
							className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 pl-10 h-[40px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						/>
					</div>
				</FormField>
				<FormField label="Rudiment">
					<select
						className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[40px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
						value={filters.rudimentId}
						onChange={(e) => setFilters({ ...filters, rudimentId: e.target.value })}
					>
						<option value="">All</option>
						{rudiments.map((r) => (
							<option key={r.id} value={r.id}>
								{r.name}
							</option>
						))}
					</select>
				</FormField>
				<FormField label="Quality">
					<select
						className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[40px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
						value={filters.quality}
						onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
					>
						<option value="">All</option>
						<option value="4">Great</option>
						<option value="3">Good</option>
						<option value="2">Fair</option>
						<option value="1">Poor</option>
					</select>
				</FormField>
				<div className="flex items-end gap-2">
					<Button variant="secondary" onClick={clearFilters} className="text-xs px-3 py-1.5 h-[40px]">
						<X size={14} />
					</Button>
				</div>
			</div>

			{/* Date Range */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<FormField label="Start Date">
					<input
						type="date"
						className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[40px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
						value={filters.startDate}
						onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
					/>
				</FormField>
				<FormField label="End Date">
					<input
						type="date"
						className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 h-[40px] text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
						value={filters.endDate}
						onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
					/>
				</FormField>
			</div>

			{/* Session List */}
			{loading ? (
				<div className="text-center py-8 text-[rgba(238,235,217,0.6)]">Loading...</div>
			) : sessions.length === 0 ? (
				<div className="text-center py-8 text-[rgba(238,235,217,0.6)]">No sessions found</div>
			) : (
				<>
					<div className="space-y-2 max-h-96 overflow-y-auto">
						{sessions.map((session) => {
							const rudiment = rudiments.find((r) => r.id === session.rudimentId);
							return (
								<div key={session.id} className="bg-[rgba(40,36,39,0.5)] border border-[rgba(238,235,217,0.1)] rounded-lg p-4 flex justify-between items-center">
									<div>
										<div className="font-semibold text-signal">{rudiment?.name || 'Unknown'}</div>
										<div className="text-sm text-[rgba(238,235,217,0.6)]">
											{new Date(session.date).toLocaleDateString()} • {session.duration}m • {session.tempo} BPM • Quality: {session.quality}
										</div>
									</div>
								</div>
							);
						})}
					</div>
					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center gap-2 mt-4">
							<Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
								Previous
							</Button>
							<span className="flex items-center px-4 text-[rgba(238,235,217,0.6)]">
								Page {page} of {totalPages}
							</span>
							<Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
								Next
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SessionHistory;

