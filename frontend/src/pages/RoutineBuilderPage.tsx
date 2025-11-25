import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, Plus, Save, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Footer } from '../components/common/Footer';
import { IntensitySparkline } from '../components/common/IntensitySparkline';
import { SortableRoutineItem } from '../components/features/SortableRoutineItem';
import api from '../services/api';
import { Rudiment } from '../types/types';
import { getErrorMessage } from '../utils/errorHandler';

// Local interface for the builder state
export interface BuilderItem {
	id: string; // Temporary UI ID
	rudimentId: string;
	rudimentName: string;
	category: string;
	duration: number;
	targetTempo: number;
	tempoMode: 'MANUAL' | 'SMART';
	restDuration: number;
}

const RoutineBuilderPage = () => {
	const navigate = useNavigate();
	const [library, setLibrary] = useState<Rudiment[]>([]);
	const [routineName, setRoutineName] = useState('');
	const [items, setItems] = useState<BuilderItem[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	// Fetch Library
	useEffect(() => {
		api.get<Rudiment[]>('/rudiments')
			.then((res) => setLibrary(res.data))
			.catch((error) => toast.error(getErrorMessage(error)));
	}, []);

	// Drag Sensors
	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

	// --- Actions ---

	const addItem = async (rudiment: Rudiment) => {
		let calculatedTempo = 60; // Default fallback

		// "Smart Mode" Logic: Fetch suggested tempo from API
		try {
			const res = await api.get<{ suggested_tempo: number }>(`/rudiments/${rudiment.id}/suggested-tempo`);
			calculatedTempo = res.data.suggested_tempo;
		} catch (e) {
			console.warn('Could not fetch smart tempo, defaulting to 60');
		}

		const newItem: BuilderItem = {
			id: Math.random().toString(36).substring(2, 9),
			rudimentId: rudiment.id,
			rudimentName: rudiment.name,
			category: rudiment.category,
			duration: 5,
			targetTempo: calculatedTempo,
			tempoMode: 'SMART',
			restDuration: 15,
		};

		setItems([...items, newItem]);
		setIsAddModalOpen(false);
		setSearchTerm('');
		toast.success('Added!');
	};

	const updateItem = (id: string, field: keyof BuilderItem, value: string | number) => {
		setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
	};

	const removeItem = (id: string) => {
		setItems((prev) => prev.filter((i) => i.id !== id));
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (active.id !== over?.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((i) => i.id === active.id);
				const newIndex = items.findIndex((i) => i.id === over?.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const handleSave = async () => {
		if (!routineName.trim()) return toast.error('Please name your routine');
		if (items.length === 0) return toast.error('Add at least one exercise');

		setIsSaving(true);
		try {
			await api.post('/routines', {
				name: routineName,
				items: items, // Backend now handles the extra fields
			});
			toast.success('Routine Created!');
			navigate('/dashboard');
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setIsSaving(false);
		}
	};

	const totalTimeMinutes = items.reduce((acc, curr) => acc + curr.duration, 0);
	const totalRestSeconds = items.reduce((acc, curr) => acc + curr.restDuration, 0);
	const totalDurationDisplay = `${totalTimeMinutes + Math.ceil(totalRestSeconds / 60)} min`;

	const filteredRudiments = library.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
	const activeItemData = items.find((i) => i.id === activeId);

	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans flex flex-col h-screen overflow-hidden">
			{/* Header */}
			<header className="bg-card-bg/80 backdrop-blur-xl border-b border-gray-800/50 z-40 px-6 py-5 shadow-xl shadow-black/20 shrink-0">
				<div className="flex justify-between items-start mb-6">
					<div className="flex-1 mr-8">
						<div className="flex items-center gap-3 mb-3">
							<button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 p-2 rounded-lg hover:bg-gray-800/30">
								<ArrowLeft size={20} />
							</button>
							<input
								type="text"
								placeholder="Routine Name..."
								className="bg-transparent text-2xl font-black text-white placeholder-gray-600 border-none focus:ring-0 p-0 w-full focus:outline-none"
								value={routineName}
								onChange={(e) => setRoutineName(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-4 text-sm text-gray-500 font-mono pl-11">
							<span>
								EST. TIME: <span className="text-white font-bold">{totalDurationDisplay}</span>
							</span>
							<span>•</span>
							<span>
								EXERCISES: <span className="text-white font-bold">{items.length}</span>
							</span>
						</div>
					</div>
					<div className="flex gap-3">
						<Button onClick={handleSave} isLoading={isSaving} variant="primary" className="text-black font-black text-sm px-6 py-3 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 flex items-center gap-2">
							<Save size={18} />
							SAVE ROUTINE
						</Button>
					</div>
				</div>

				{/* Sparkline */}
				<IntensitySparkline items={items} />
			</header>

			{/* Main Content Area */}
			<main className="flex-1 flex overflow-hidden">
				{/* Left Panel: Builder Canvas */}
				<div className="flex-1 overflow-y-auto p-6 relative">
					<div className="max-w-3xl mx-auto pb-32">
						<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
							<SortableContext items={items} strategy={verticalListSortingStrategy}>
								{items.map((item) => (
									<SortableRoutineItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
								))}
							</SortableContext>

							<DragOverlay>{activeItemData ? <div className="bg-card-bg border border-primary p-4 rounded-xl shadow-2xl opacity-90 text-white font-bold">{activeItemData.rudimentName}</div> : null}</DragOverlay>
						</DndContext>

						{/* Add Button (Canvas) */}
						<button
							onClick={() => setIsAddModalOpen(true)}
							className="w-full border-2 border-dashed border-gray-800/50 rounded-2xl h-28 flex flex-col items-center justify-center text-gray-500 gap-3 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-300 mt-6 group backdrop-blur-sm"
						>
							<div className="bg-gray-800/50 text-gray-400 rounded-full p-3 group-hover:bg-primary group-hover:text-black transition-all duration-300 group-hover:scale-110">
								<Plus size={24} />
							</div>
							<span className="font-bold text-sm">Add Exercise</span>
						</button>
					</div>
				</div>
			</main>

			{/* Add Modal */}
			{isAddModalOpen && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center sm:p-4 animate-fade-in">
					<div className="bg-card-bg/95 backdrop-blur-xl w-full max-w-md sm:rounded-2xl border-t sm:border border-gray-800/50 h-[85vh] flex flex-col shadow-2xl shadow-black/50">
						<div className="p-5 border-b border-gray-800/50 flex items-center gap-3 bg-gray-900/20">
							<Search size={20} className="text-gray-400" />
							<input
								type="text"
								placeholder="Search library..."
								className="bg-transparent border-none focus:ring-0 text-white w-full p-0 text-lg placeholder-gray-500 focus:outline-none"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
							<button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95">
								<X size={20} />
							</button>
						</div>
						<div className="overflow-y-auto flex-1 p-3">
							{filteredRudiments.map((r) => (
								<button
									key={r.id}
									onClick={() => addItem(r)}
									className="w-full text-left p-4 hover:bg-gray-800/50 rounded-xl flex justify-between items-center group transition-all duration-200 border border-transparent hover:border-gray-700/50 mb-2 backdrop-blur-sm"
								>
									<div>
										<span className="font-bold text-gray-200 block">{r.name}</span>
										<span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{r.category}</span>
									</div>
									<div className="w-9 h-9 rounded-full border border-gray-700/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-200 group-hover:scale-110">
										<Plus size={18} />
									</div>
								</button>
							))}
							{filteredRudiments.length === 0 && <div className="text-center text-gray-500 mt-10">No results found.</div>}
						</div>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default RoutineBuilderPage;
