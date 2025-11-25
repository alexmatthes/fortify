import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, Plus, Save, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { IntensitySparkline } from '../components/common/IntensitySparkline';
import { SortableRoutineItem } from '../components/features/SortableRoutineItem';
import api from '../services/api';
import { Rudiment } from '../types/types';

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

	// Fetch Library
	useEffect(() => {
		api.get<Rudiment[]>('/rudiments')
			.then((res) => setLibrary(res.data))
			.catch(() => toast.error('Failed to load library'));
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

	const updateItem = (id: string, field: keyof BuilderItem, value: any) => {
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

		try {
			await api.post('/routines', {
				name: routineName,
				items: items, // Backend now handles the extra fields
			});
			toast.success('Routine Created!');
			navigate('/dashboard');
		} catch (error) {
			toast.error('Failed to save routine');
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
			<header className="bg-card-bg border-b border-gray-800 z-40 px-6 py-4 shadow-xl shrink-0">
				<div className="flex justify-between items-start mb-6">
					<div className="flex-1 mr-8">
						<div className="flex items-center gap-3 mb-2">
							<button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition-colors">
								<ArrowLeft size={20} />
							</button>
							<input
								type="text"
								placeholder="Routine Name..."
								className="bg-transparent text-2xl font-black text-white placeholder-gray-700 border-none focus:ring-0 p-0 w-full"
								value={routineName}
								onChange={(e) => setRoutineName(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-4 text-sm text-gray-500 font-mono pl-8">
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
						<button onClick={handleSave} className="bg-primary hover:bg-cyan-300 text-black font-black text-sm px-5 py-2.5 rounded-lg shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2">
							<Save size={18} />
							SAVE ROUTINE
						</button>
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
							className="w-full border-2 border-dashed border-gray-800 rounded-xl h-24 flex flex-col items-center justify-center text-gray-600 gap-2 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all mt-4 group"
						>
							<div className="bg-gray-800 text-gray-400 rounded-full p-2 group-hover:bg-primary group-hover:text-black transition-colors">
								<Plus size={24} />
							</div>
							<span className="font-bold text-sm">Add Exercise</span>
						</button>
					</div>
				</div>
			</main>

			{/* Add Modal */}
			{isAddModalOpen && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-end sm:items-center sm:p-4 animate-fade-in">
					<div className="bg-[#111827] w-full max-w-md sm:rounded-2xl border-t sm:border border-gray-800 h-[85vh] flex flex-col shadow-2xl ring-1 ring-white/10">
						<div className="p-4 border-b border-gray-800 flex items-center gap-3">
							<Search size={20} className="text-gray-500" />
							<input
								type="text"
								placeholder="Search library..."
								className="bg-transparent border-none focus:ring-0 text-white w-full p-0 text-lg placeholder-gray-600"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
							<button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white p-2 bg-gray-800 rounded-full">
								✕
							</button>
						</div>
						<div className="overflow-y-auto flex-1 p-2">
							{filteredRudiments.map((r) => (
								<button
									key={r.id}
									onClick={() => addItem(r)}
									className="w-full text-left p-4 hover:bg-gray-800 rounded-xl flex justify-between items-center groupQD transition-colors border border-transparent hover:border-gray-700 mb-1"
								>
									<div>
										<span className="font-bold text-gray-200 block">{r.name}</span>
										<span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{r.category}</span>
									</div>
									<div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
										<Plus size={16} />
									</div>
								</button>
							))}
							{filteredRudiments.length === 0 && <div className="text-center text-gray-500 mt-10">No results found.</div>}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RoutineBuilderPage;
