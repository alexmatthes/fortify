import React, { useState } from 'react';

// 1. Standard Rudiments (Immutable "Built-ins")
const STANDARD_RUDIMENTS = [
	{
		id: 'std-1',
		name: 'Single Stroke Roll',
		description: 'Alternating strokes between the hands (RLRL...). The foundation of many other rudiments.',
		category: 'Rolls',
		isStandard: true,
	},
	{
		id: 'std-2',
		name: 'Double Stroke Roll',
		description: 'Two strokes per hand (RRLL...). Essential for building speed and control.',
		category: 'Rolls',
		isStandard: true,
	},
	{
		id: 'std-3',
		name: 'Single Paradiddle',
		description: 'A four-note pattern combining single and double strokes (RLRR LRLL).',
		category: 'Diddles',
		isStandard: true,
	},
	{
		id: 'std-4',
		name: 'Flam',
		description: 'Two strokes played at almost the same time, with one grace note preceding the primary note.',
		category: 'Flams',
		isStandard: true,
	},
];

function LibraryPage() {
	// Initialize state with the Standard Rudiments
	const [rudiments, setRudiments] = useState(STANDARD_RUDIMENTS);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Form State for new rudiment
	const [newRudiment, setNewRudiment] = useState({ name: '', category: '', description: '' });

	// Handle adding a new custom rudiment
	const handleAddRudiment = (e) => {
		e.preventDefault();
		if (!newRudiment.name) return;

		const customRudiment = {
			id: Date.now(), // Simple unique ID for now
			...newRudiment,
			isStandard: false, // Mark as custom so it can be deleted later
		};

		setRudiments([...rudiments, customRudiment]);
		setNewRudiment({ name: '', category: '', description: '' }); // Reset form
		setIsModalOpen(false); // Close modal
	};

	// Handle deleting a rudiment (Only for custom ones)
	const handleDelete = (id) => {
		setRudiments(rudiments.filter((r) => r.id !== id));
	};

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white font-sans">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Rudiment Library</h1>
					<p className="text-gray-400 mt-1">Manage your collection of drum rudiments.</p>
				</div>
				<button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
					<span>+</span> Add New Rudiment
				</button>
			</div>

			{/* Category Filter Pills (Visual only for now) */}
			<div className="flex gap-2 mb-6">
				{['All', 'Rolls', 'Diddles', 'Flams', 'Drags'].map((filter) => (
					<button key={filter} className="px-4 py-1.5 rounded-full bg-card-bg border border-gray-700 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
						{filter}
					</button>
				))}
			</div>

			{/* Table Layout (Matches rudiment_library.html) */}
			<div className="bg-card-bg rounded-xl border border-gray-800 overflow-hidden shadow-xl">
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
						{rudiments.map((rudiment) => (
							<tr key={rudiment.id} className="hover:bg-gray-800/50 transition-colors group">
								<td className="p-4 font-semibold text-white">{rudiment.name}</td>
								<td className="p-4 text-gray-400 text-sm">{rudiment.description}</td>
								<td className="p-4">
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium border ${
											rudiment.category === 'Rolls'
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
										{/* Play Button (Visual placeholder) */}
										<button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Play Audio">
											▶
										</button>

										{/* Delete Button (Only show if NOT standard) */}
										{!rudiment.isStandard && (
											<button onClick={() => handleDelete(rudiment.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Rudiment">
												✕
											</button>
										)}

										{/* Lock Icon for Standard Rudiments */}
										{rudiment.isStandard && (
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
			</div>

			{/* Add Rudiment Modal */}
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
									<option value="Rolls">Rolls</option>
									<option value="Diddles">Diddles</option>
									<option value="Flams">Flams</option>
									<option value="Drags">Drags</option>
									<option value="Hybrids">Hybrids</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
								<textarea
									rows="3"
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
		</div>
	);
}

export default LibraryPage;
