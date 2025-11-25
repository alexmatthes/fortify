import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import api from '../../services/api';
import { Rudiment } from '../../types/types';

const routineNameSchema = z.string().min(1, 'Routine name is required').max(50, 'Name too long');

function RoutineBuilder() {
	const [rudiments, setRudiments] = useState<Rudiment[]>([]);
	const [routineRudiments, setRoutineRudiments] = useState<Rudiment[]>([]);
	const [routineName, setRoutineName] = useState('');
	const [nameError, setNameError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		const fetchRudiments = async () => {
			try {
				const response = await api.get<Rudiment[]>('/rudiments');
				setRudiments(response.data);
				setIsLoading(false);
			} catch (error) {
				toast.error('Failed to fetch rudiments.');
				setIsLoading(false);
			}
		};

		fetchRudiments();
	}, []);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setRoutineName(value);

		const result = routineNameSchema.safeParse(value);
		if (!result.success) {
			setNameError(result.error.errors[0].message);
		} else {
			setNameError(null);
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const draggedRudimentId = active.id as string;
		const draggedRudiment = rudiments.find((r) => r.id === draggedRudimentId);

		if (draggedRudiment && over.id === 'routine-drop-zone') {
			// Check if already in routine
			if (!routineRudiments.find((r) => r.id === draggedRudimentId)) {
				setRoutineRudiments([...routineRudiments, draggedRudiment]);
			}
		}
	};

	const handleRemoveRudiment = (id: string) => {
		setRoutineRudiments(routineRudiments.filter((r) => r.id !== id));
	};

	// Prepare routine data structure for future API integration
	const getRoutineData = () => {
		return {
			name: routineName,
			rudiments: routineRudiments,
		};
	};

	const availableRudiments = rudiments.filter((r) => !routineRudiments.find((rr) => rr.id === r.id));

	return (
		<div className="min-h-screen bg-dark-bg p-8 text-white font-sans">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight mb-2">Build Practice Routine</h1>
					<p className="text-gray-400">Drag and drop rudiments to create your custom practice routine.</p>
				</div>

				{/* Routine Name Input */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-400 mb-2">Routine Name</label>
					<input
						type="text"
						value={routineName}
						onChange={handleNameChange}
						className={`w-full max-w-md bg-dark-bg border-2 rounded-lg px-4 py-2 text-white focus:ring-0 transition-colors ${nameError ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-primary'}`}
						placeholder="Enter routine name..."
					/>
					{nameError && <p className="mt-1 text-sm text-red-400">{nameError}</p>}
				</div>

				<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Available Rudiments */}
						<div className="bg-card-bg rounded-xl border border-gray-800 shadow-lg p-6">
							<h2 className="text-xl font-bold mb-4 text-primary">Available Rudiments</h2>
							{isLoading ? (
								<div className="text-center py-8 text-gray-400">Loading rudiments...</div>
							) : availableRudiments.length === 0 ? (
								<div className="text-center py-8 text-gray-400">
									<p>All rudiments have been added to your routine.</p>
								</div>
							) : (
								<div className="space-y-2">
									{availableRudiments.map((rudiment) => (
										<DraggableRudiment key={rudiment.id} rudiment={rudiment} />
									))}
								</div>
							)}
						</div>

						{/* Routine List */}
						<div className="bg-card-bg rounded-xl border border-gray-800 shadow-lg p-6">
							<h2 className="text-xl font-bold mb-4 text-primary">Your Routine</h2>
							<RoutineDropZone>
								{routineRudiments.length === 0 ? (
									<div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
										<p className="mb-2">Drop rudiments here</p>
										<p className="text-sm">Drag rudiments from the left to build your routine</p>
									</div>
								) : (
									<div className="space-y-2">
										{routineRudiments.map((rudiment, index) => (
											<RoutineRudimentItem key={rudiment.id} rudiment={rudiment} index={index} onRemove={handleRemoveRudiment} />
										))}
									</div>
								)}
							</RoutineDropZone>
						</div>
					</div>

					<DragOverlay>{activeId ? <div className="bg-gray-800 border-2 border-primary rounded-lg p-4 shadow-xl opacity-90">{rudiments.find((r) => r.id === activeId)?.name}</div> : null}</DragOverlay>
				</DndContext>

				{/* Debug: Show prepared data structure (can be removed later) */}
				{process.env.NODE_ENV === 'development' && routineName && routineRudiments.length > 0 && (
					<div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
						<p className="text-xs text-gray-400 mb-2">Prepared Routine Data (for future API):</p>
						<pre className="text-xs text-gray-300 font-mono overflow-auto">{JSON.stringify(getRoutineData(), null, 2)}</pre>
					</div>
				)}
			</div>
		</div>
	);
}

function DraggableRudiment({ rudiment }: { rudiment: Rudiment }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: rudiment.id,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={`bg-gray-800 border-2 border-gray-700 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-colors hover:border-primary hover:bg-gray-750 ${isDragging ? 'opacity-50' : ''}`}
		>
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-white">{rudiment.name}</h3>
					{rudiment.category && <span className="text-xs text-gray-400 mt-1 inline-block">{rudiment.category}</span>}
				</div>
				<div className="text-primary">⋮⋮</div>
			</div>
		</div>
	);
}

function RoutineDropZone({ children }: { children: React.ReactNode }) {
	const { setNodeRef, isOver } = useDroppable({
		id: 'routine-drop-zone',
	});

	return (
		<div ref={setNodeRef} className={`min-h-[200px] transition-colors ${isOver ? 'bg-primary/10 border-2 border-primary border-dashed rounded-lg' : ''}`}>
			{children}
		</div>
	);
}

function RoutineRudimentItem({ rudiment, index, onRemove }: { rudiment: Rudiment; index: number; onRemove: (id: string) => void }) {
	return (
		<div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 flex items-center justify-between group hover:border-primary transition-colors">
			<div className="flex items-center gap-4 flex-1">
				<span className="text-primary font-mono font-bold w-8 text-center">{index + 1}</span>
				<div>
					<h3 className="font-semibold text-white">{rudiment.name}</h3>
					{rudiment.category && <span className="text-xs text-gray-400">{rudiment.category}</span>}
				</div>
			</div>
			<button onClick={() => onRemove(rudiment.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-all" title="Remove from routine">
				✕
			</button>
		</div>
	);
}

// Export the main component function
export { RoutineBuilder };
