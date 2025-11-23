import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { Rudiment } from '../types';

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
				toast.error('Failed to fetch rudiments.');
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
			toast.error('Failed to add rudiment.');
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this rudiment?')) return;

		try {
			await api.delete(`/rudiments/${id}`);
			setRudiments(rudiments.filter((r) => r.id !== id));
			toast.success('Rudiment deleted.');
		} catch (error) {
			toast.error('Could not delete rudiment. You might not own it.');
		}
	};

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white font-sans">
			{/* Header */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Rudiment Library</h1>
					<p className="text-gray-400 mt-1">Manage your collection of drum rudiments.</p>
				</div>
				<button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
					<span>+</span> Add New Rudiment
				</button>
			</div>

			{/* Filters */}
			<div className="flex gap-2 mb-6">
				{['All', 'Roll', 'Diddle', 'Flam', 'Drag'].map((filter) => (
					<button key={filter} className="px-4 py-1.5 rounded-full bg-card-bg border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
						{filter}
					</button>
				))}
			</div>

			<div className="relative w-full sm:max-w-xs">
				{/* Search Icon */}
				<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
					</svg>
				</span>

				{/* The Search Input */}
				<input
					type="text"
					className="w-full rounded-lg border border-gray-700 bg-dark-bg text-white focus:border-primary focus:ring-1 focus:ring-primary pl-10 pr-4 py-2 outline-none transition-colors"
					placeholder="Search rudiments..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className="bg-card-bg rounded-xl border border-gray-800 overflow-hidden shadow-xl">
				{isLoading ? (
					<div className="p-8 text-center text-gray-400">Loading your rudiments...</div>
				) : (
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-900/50 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
								<th className="p-4 font-medium">Name</th>
								<th className="p-4 font-medium w-1/2">Description</th>
								<th className="p-4 font-medium">Category</th>
								<th className="p-4 font-medium text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{rudiments
								.filter((rudiment) => rudiment.name.toLowerCase().includes(searchTerm.toLowerCase()))
								.map((rudiment) => (
									<tr key={rudiment.id} className="hover:bg-gray-800/50 transition-colors group">
										<td className="p-4 font-semibold text-white">{rudiment.name}</td>
										<td className="p-4 text-gray-400 text-sm">{rudiment.description}</td>
										<td className="p-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium border ${
													rudiment.category === 'Roll'
														? 'bg-blue-900/30 text-blue-200 border-blue-800'
														: rudiment.category === 'Diddles'
														? 'bg-green-900/30 text-green-200 border-green-800'
														: 'bg-gray-800 text-gray-300 border-gray-700'
												}`}
											>
												{rudiment.category}
											</span>
										</td>
										<td className="p-4 text-right">
											<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Play Audio">
													▶
												</button>

												{/* Logic: If isStandard is TRUE, show Lock. If FALSE, show Delete. */}
												{!rudiment.isStandard ? (
													<button onClick={() => handleDelete(rudiment.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Rudiment">
														✕
													</button>
												) : (
													<span className="p-2 text-gray-600 cursor-not-allowed" title="Standard rudiment (cannot be deleted)">
														🔒
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
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
					<div className="bg-card-bg w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
						<div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
							<h3 className="text-xl font-bold text-white">Add Custom Rudiment</h3>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
								✕
							</button>
						</div>

						<form onSubmit={handleAddRudiment} className="p-6 space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
								<input
									type="text"
									required
									className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
									placeholder="e.g., Swiss Army Triplet"
									value={newRudiment.name}
									onChange={(e) => setNewRudiment({ ...newRudiment, name: e.target.value })}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
								<select
									className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
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
								<label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
								<textarea
									rows={3}
									className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
									placeholder="Briefly describe the pattern..."
									value={newRudiment.description}
									onChange={(e) => setNewRudiment({ ...newRudiment, description: e.target.value })}
								></textarea>
							</div>

							<div className="pt-2">
								<button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-lg transition-colors">
									Save to Library
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<footer className="text-center py-8 text-gray-600 text-sm">
				<p>&copy; {new Date().getFullYear()} Fortify. Built by a drummer, for drummers.</p>
			</footer>
		</div>
	);
}

export default LibraryPage;
