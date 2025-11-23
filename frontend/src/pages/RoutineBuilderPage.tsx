import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, Plus, Save, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { SortableRoutineItem } from '../components/SortableRoutineItem';
import { Rudiment } from '../types';

// Local interface for the builder state
interface BuilderItem {
	id: string; // Temporary UI ID (random string)
	rudimentId: string;
	rudimentName: string;
	duration: number;
}

const RoutineBuilderPage = () => {
	const navigate = useNavigate();
	const [rudiments, setRudiments] = useState<Rudiment[]>([]);
	const [routineName, setRoutineName] = useState('');
	const [items, setItems] = useState<BuilderItem[]>([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	// Fetch Rudiments
	useEffect(() => {
		api.get<Rudiment[]>('/rudiments')
			.then((res) => setRudiments(res.data))
			.catch((err) => console.error(err));
	}, []);

	// Drag Sensors
	const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((i) => i.id === active.id);
				const newIndex = items.findIndex((i) => i.id === over?.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	// Actions
	const addItem = (rudiment: Rudiment) => {
		const newItem: BuilderItem = {
			id: Math.random().toString(36).substring(2, 9),
			rudimentId: rudiment.id,
			rudimentName: rudiment.name,
			duration: 5,
		};
		setItems([...items, newItem]);
		setIsAddModalOpen(false);
		setSearchTerm('');
		toast.success('Added!');
	};

	const removeItem = (id: string) => {
		setItems(items.filter((i) => i.id !== id));
	};

	const updateDuration = (id: string, newDuration: number) => {
		setItems(items.map((i) => (i.id === id ? { ...i, duration: newDuration } : i)));
	};

	const handleSave = async () => {
		if (!routineName.trim()) return toast.error('Please name your routine');
		if (items.length === 0) return toast.error('Add at least one exercise');

		try {
			await api.post('/routines', {
				name: routineName,
				items: items.map((item, index) => ({
					rudimentId: item.rudimentId,
					duration: item.duration,
					order: index,
				})),
			});
			toast.success('Routine Created!');
			navigate('/dashboard');
		} catch (error) {
			toast.error('Failed to save routine');
		}
	};

	const totalTime = items.reduce((acc, curr) => acc + curr.duration, 0);
	const filteredRudiments = rudiments.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="min-h-screen bg-dark-bg text-white font-sans pb-32">
			{/* Header */}
			<header className="sticky top-0 bg-dark-bg/80 backdrop-blur-md border-b border-gray-800 z-40 px-6 py-4 flex items-center gap-4">
				<button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-2 -ml-2 rounded-full hover:bg-gray-800 transition-colors">
					<ArrowLeft size={24} />
				</button>
				<span className="font-bold text-sm tracking-widest text-gray-500 uppercase">New Routine</span>
			</header>

			<main className="max-w-2xl mx-auto px-6 py-8">
				{/* Name Input */}
				<div className="mb-10 group">
					<label className="block text-[10px] font-black text-primary tracking-widest mb-2 uppercase opacity-70 group-focus-within:opacity-100 transition-opacity">Routine Name</label>
					<input
						type="text"
						placeholder="Morning Warmup..."
						className="w-full bg-transparent text-4xl md:text-5xl font-black text-white placeholder-gray-800 border-none focus:ring-0 p-0 caret-primary"
						value={routineName}
						onChange={(e) => setRoutineName(e.target.value)}
						autoFocus
					/>
				</div>

				{/* Draggable List */}
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={items} strategy={verticalListSortingStrategy}>
						{items.map((item) => (
							<SortableRoutineItem key={item.id} id={item.id} rudimentName={item.rudimentName} duration={item.duration} onRemove={removeItem} onDurationChange={updateDuration} />
						))}
					</SortableContext>
				</DndContext>

				{/* Empty State / Add Button */}
				<button
					onClick={() => setIsAddModalOpen(true)}
					className="w-full border-2 border-dashed border-gray-800 rounded-xl h-24 flex flex-col items-center justify-center text-gray-600 gap-2 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all mt-4 group"
				>
					<div className="bg-gray-800 text-gray-400 rounded-full p-2 group-hover:bg-primary group-hover:text-black transition-colors">
						<Plus size={24} />
					</div>
					<span className="font-bold text-sm">Add Exercise</span>
				</button>
			</main>

			{/* Sticky Footer */}
			<div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-gray-800 p-4 z-30">
				<div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
					<div className="hidden sm:block">
						<p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Duration</p>
						<p className="text-2xl font-mono font-bold text-white">
							{totalTime} <span className="text-sm text-gray-500">min</span>
						</p>
					</div>
					<button
						onClick={handleSave}
						className="flex-1 bg-primary hover:bg-cyan-300 text-black font-black text-lg py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
					>
						<Save size={20} />
						Save Routine
					</button>
				</div>
			</div>

			{/* Add Modal */}
			{isAddModalOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-end sm:items-center sm:p-4 animate-fade-in">
					<div className="bg-[#111827] w-full max-w-md sm:rounded-2xl border-t sm:border border-gray-800 h-[80vh] flex flex-col shadow-2xl ring-1 ring-white/10">
						<div className="p-4 border-b border-gray-800 flex items-center gap-3">
							<Search size={20} className="text-gray-500" />
							<input
								type="text"
								placeholder="Search rudiments..."
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
									className="w-full text-left p-4 hover:bg-gray-800 rounded-xl flex justify-between items-center group transition-colors border border-transparent hover:border-gray-700 mb-1"
								>
									<div>
										<span className="font-bold text-gray-200 block">{r.name}</span>
										<span className="text-xs text-gray-500 uppercase tracking-wider">{r.category}</span>
									</div>
									<div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all">
										<Plus size={16} />
									</div>
								</button>
							))}
							{filteredRudiments.length === 0 && <div className="text-center text-gray-500 mt-10">No rudiments found.</div>}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default RoutineBuilderPage;
