import { Lock, Play, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Footer } from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { Rudiment } from '../types/types';
import { getErrorMessage } from '../utils/errorHandler';

function LibraryPage() {
	// 1. Strictly typed state
	const [rudiments, setRudiments] = useState<Rudiment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	// For the form, we can infer types (strings), so no special generic needed here
	const [newRudiment, setNewRudiment] = useState({ name: '', category: '', description: '' });

	useEffect(() => {
		const fetchRudiments = async () => {
			try {
				const response = await api.get<Rudiment[]>('/rudiments'); // <--- API knows it returns Rudiments
				setRudiments(response.data);
				setIsLoading(false);
			} catch (error) {
				toast.error(getErrorMessage(error));
				setIsLoading(false);
			}
		};

		fetchRudiments();
	}, []);

	// 2. Typed Event Handler
	const handleAddRudiment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newRudiment.name) return;

		try {
			const response = await api.post<Rudiment>('/rudiments', newRudiment);
			setRudiments([...rudiments, response.data]);
			setNewRudiment({ name: '', category: '', description: '' });
			setIsModalOpen(false);
			toast.success('Rudiment added!');
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this rudiment?')) return;

		try {
			await api.delete(`/rudiments/${id}`);
			setRudiments(rudiments.filter((r) => r.id !== id));
			toast.success('Rudiment deleted.');
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	};

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-signal font-sans">
			{/* Header */}
			<div className="flex justify-between items-center mb-10">
				<div>
					<h1 className="text-3xl md:text-4xl font-heading font-semibold tracking-tight text-signal">Rudiment Library</h1>
					<p className="text-[rgba(238,235,217,0.6)] mt-2">Manage your collection of drum rudiments.</p>
				</div>
				<button onClick={() => setIsModalOpen(true)} className="bg-signal text-dark-bg font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 hover:bg-signal/95 active:scale-95">
					<span className="text-lg">+</span> Add New Rudiment
				</button>
			</div>

			{/* Filters */}
			<div className="flex gap-3 mb-6 flex-wrap">
				{['All', 'Roll', 'Diddle', 'Flam', 'Drag'].map((filter) => (
					<button key={filter} className="px-5 py-2 rounded-lg bg-transparent border border-[rgba(238,235,217,0.2)] text-sm font-semibold text-[rgba(238,235,217,0.8)] hover:bg-[rgba(238,235,217,0.05)] hover:border-[rgba(238,235,217,0.4)] hover:text-signal transition-all duration-200 active:scale-95 active:animate-flash">
						{filter}
					</button>
				))}
			</div>

			<div className="relative w-full sm:max-w-xs mb-8">
				{/* Search Icon */}
				<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(238,235,217,0.6)]">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
					</svg>
				</span>

				{/* The Search Input */}
				<input
					type="text"
					className="w-full rounded-lg border border-[rgba(238,235,217,0.1)] bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] text-signal focus:border-[rgba(238,235,217,0.5)] pl-11 pr-4 py-3 outline-none transition-all duration-200"
					placeholder="Search rudiments..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className="bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] rounded-2xl border border-[rgba(238,235,217,0.1)] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
				{isLoading ? (
					<LoadingSpinner message="Loading your rudiments..." className="p-8" />
				) : (
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-[rgba(238,235,217,0.1)]">
								<th className="p-5 premium-label">Name</th>
								<th className="p-5 premium-label w-1/2">Description</th>
								<th className="p-5 premium-label">Category</th>
								<th className="p-5 premium-label text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							{rudiments
								.filter((rudiment) => rudiment.name.toLowerCase().includes(searchTerm.toLowerCase()))
								.map((rudiment) => (
									<tr key={rudiment.id} className="hover:bg-[rgba(238,235,217,0.02)] transition-all duration-200 group border-b border-[rgba(238,235,217,0.1)]">
										<td className="p-5">
											<div className="font-heading font-semibold text-signal text-lg">{rudiment.name}</div>
											<div className="text-[rgba(238,235,217,0.6)] text-sm mt-1 leading-relaxed">{rudiment.description}</div>
										</td>
										<td className="p-5"></td>
										<td className="p-5">
											<span className="px-4 py-2 rounded-lg text-xs font-semibold border border-[rgba(238,235,217,0.2)] bg-transparent text-[rgba(238,235,217,0.8)]">
												{rudiment.category}
											</span>
										</td>
										<td className="p-5 text-right">
											<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<button className="p-2.5 text-[rgba(238,235,217,0.6)] hover:text-signal hover:bg-[rgba(238,235,217,0.05)] rounded-lg transition-all duration-200 active:scale-95" title="Play Audio">
													<Play size={16} />
												</button>

												{/* Logic: If isStandard is TRUE, show Lock. If FALSE, show Delete. */}
												{!rudiment.isStandard ? (
													<button onClick={() => handleDelete(rudiment.id)} className="p-2.5 text-[rgba(238,235,217,0.6)] hover:text-signal hover:bg-[rgba(238,235,217,0.05)] rounded-lg transition-all duration-200 active:scale-95" title="Delete Rudiment">
														<X size={16} />
													</button>
												) : (
													<span className="p-2.5 text-[rgba(238,235,217,0.3)] cursor-not-allowed flex items-center" title="Standard rudiment (cannot be deleted)">
														<Lock size={16} />
													</span>
												)}
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				)}
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in">
					<div className="bg-[rgba(40,36,39,0.95)] backdrop-blur-[24px] w-full max-w-md rounded-2xl border border-[rgba(238,235,217,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
						<div className="px-6 py-5 border-b border-[rgba(238,235,217,0.1)] flex justify-between items-center">
							<h3 className="text-xl font-heading font-semibold text-signal">Add Custom Rudiment</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-[rgba(238,235,217,0.6)] hover:text-signal transition-colors duration-200 rounded-lg p-2">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleAddRudiment} className="p-6 space-y-5">
							<div>
								<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Name</label>
								<input
									type="text"
									required
									className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 py-3 text-signal focus:border-[rgba(238,235,217,0.5)] outline-none transition-all duration-200"
									placeholder="e.g., Swiss Army Triplet"
									value={newRudiment.name}
									onChange={(e) => setNewRudiment({ ...newRudiment, name: e.target.value })}
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Category</label>
								<select
									className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 py-3 text-signal focus:border-[rgba(238,235,217,0.5)] outline-none appearance-none transition-all duration-200"
									value={newRudiment.category}
									onChange={(e) => setNewRudiment({ ...newRudiment, category: e.target.value })}
								>
									<option value="">Select a category...</option>
									<option value="Roll">Roll</option>
									<option value="Diddle">Diddle</option>
									<option value="Flam">Flam</option>
									<option value="Drag">Drag</option>
									<option value="Hybrid">Hybrid</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[rgba(238,235,217,0.8)] mb-2">Description</label>
								<textarea
									rows={3}
									className="w-full bg-[rgba(40,36,39,0.7)] backdrop-blur-[24px] border border-[rgba(238,235,217,0.1)] rounded-lg px-4 py-3 text-signal focus:border-[rgba(238,235,217,0.5)] outline-none resize-none transition-all duration-200"
									placeholder="Briefly describe the pattern..."
									value={newRudiment.description}
									onChange={(e) => setNewRudiment({ ...newRudiment, description: e.target.value })}
								></textarea>
							</div>

							<div className="pt-2">
								<button type="submit" className="w-full bg-signal text-dark-bg font-semibold py-3 rounded-lg transition-all duration-200 hover:bg-signal/95 active:scale-95">
									Save to Library
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<Footer />
		</div>
	);
}

export default LibraryPage;
