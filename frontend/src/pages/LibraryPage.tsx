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
		<div className="min-h-screen bg-dark-bg p-8 text-white font-sans">
			{/* Header */}
			<div className="flex justify-between items-center mb-10">
				<div>
					<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Rudiment Library</h1>
					<p className="text-gray-400 mt-2">Manage your collection of drum rudiments.</p>
				</div>
				<button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-hover text-dark-bg font-bold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95">
					<span className="text-lg">+</span> Add New Rudiment
				</button>
			</div>

			{/* Filters */}
			<div className="flex gap-3 mb-6 flex-wrap">
				{['All', 'Roll', 'Diddle', 'Flam', 'Drag'].map((filter) => (
					<button key={filter} className="px-5 py-2 rounded-full bg-card-bg/60 backdrop-blur-sm border border-gray-700/50 text-sm font-semibold text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600 transition-all duration-200 hover:scale-105 active:scale-95">
						{filter}
					</button>
				))}
			</div>

			<div className="relative w-full sm:max-w-xs mb-8">
				{/* Search Icon */}
				<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
					</svg>
				</span>

				{/* The Search Input */}
				<input
					type="text"
					className="w-full rounded-xl border border-gray-700/50 bg-dark-bg/60 backdrop-blur-sm text-white focus:border-primary focus:ring-2 focus:ring-primary/20 pl-11 pr-4 py-3 outline-none transition-all duration-200"
					placeholder="Search rudiments..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className="bg-surface/80 backdrop-blur-sm rounded-2xl border border-card-border overflow-hidden shadow-2xl shadow-black/30">
				{isLoading ? (
					<LoadingSpinner message="Loading your rudiments..." className="p-8" />
				) : (
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-900/20 border-b border-card-border">
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
									<tr key={rudiment.id} className="hover:bg-surface/50 transition-all duration-200 group border-b border-card-border">
										<td className="p-5">
											<div className="font-heading font-bold text-white text-lg">{rudiment.name}</div>
											<div className="text-gray-500 text-sm mt-1 leading-relaxed">{rudiment.description}</div>
										</td>
										<td className="p-5"></td>
										<td className="p-5">
											<span
												className={`px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-sm ${
													rudiment.category === 'Roll'
														? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
														: rudiment.category === 'Diddles'
														? 'bg-green-500/20 text-green-300 border-green-500/30'
														: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
												}`}
											>
												{rudiment.category}
											</span>
										</td>
										<td className="p-5 text-right">
											<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<button className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" title="Play Audio">
													<Play size={16} />
												</button>

												{/* Logic: If isStandard is TRUE, show Lock. If FALSE, show Delete. */}
												{!rudiment.isStandard ? (
													<button onClick={() => handleDelete(rudiment.id)} className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95" title="Delete Rudiment">
														<X size={16} />
													</button>
												) : (
													<span className="p-2.5 text-gray-600 cursor-not-allowed flex items-center" title="Standard rudiment (cannot be deleted)">
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
				<div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in">
					<div className="bg-card-bg/95 backdrop-blur-xl w-full max-w-md rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden">
						<div className="px-6 py-5 border-b border-gray-700/50 flex justify-between items-center bg-gray-900/20">
							<h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Add Custom Rudiment</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-800/50 rounded-lg p-2">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleAddRudiment} className="p-6 space-y-5">
							<div>
								<label className="block text-sm font-semibold text-gray-300 mb-2">Name</label>
								<input
									type="text"
									required
									className="w-full bg-dark-bg/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
									placeholder="e.g., Swiss Army Triplet"
									value={newRudiment.name}
									onChange={(e) => setNewRudiment({ ...newRudiment, name: e.target.value })}
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
								<select
									className="w-full bg-dark-bg/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all duration-200"
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
								<label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
								<textarea
									rows={3}
									className="w-full bg-dark-bg/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all duration-200"
									placeholder="Briefly describe the pattern..."
									value={newRudiment.description}
									onChange={(e) => setNewRudiment({ ...newRudiment, description: e.target.value })}
								></textarea>
							</div>

							<div className="pt-2">
								<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-dark-bg font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]">
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
