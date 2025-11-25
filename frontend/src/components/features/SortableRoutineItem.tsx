import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, Clock, GripVertical, Trash2, TrendingUp } from 'lucide-react';
import React from 'react';
import { BuilderItem } from '../../pages/RoutineBuilderPage';

interface Props {
	item: BuilderItem;
	onUpdate: (id: string, field: keyof BuilderItem, value: string | number) => void;
	onRemove: (id: string) => void;
}

export function SortableRoutineItem({ item, onUpdate, onRemove }: Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : 'auto',
		position: 'relative' as 'relative',
	};

	const isSmart = item.tempoMode === 'SMART';

	return (
		<div className="relative mb-4">
			<div
				ref={setNodeRef}
				style={style}
				className={`
                    group relative border rounded-2xl overflow-hidden transition-all duration-300 select-none backdrop-blur-sm
                    ${isDragging ? 'bg-card-bg/90 border-primary shadow-2xl shadow-primary/30 scale-[1.02] z-50' : 'bg-card-bg/60 border-gray-800/50 hover:border-gray-700/50 hover:shadow-xl hover:shadow-black/20'}
                    ${isSmart ? 'border-l-4 border-l-primary' : ''}
                `}
			>
				<div className="flex items-center gap-4 p-4">
					{/* Drag Handle */}
					<div {...attributes} {...listeners} className="cursor-grab text-gray-600 hover:text-white touch-none">
						<GripVertical size={20} />
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<h4 className="font-bold text-white text-lg truncate">{item.rudimentName}</h4>
						<div className="flex items-center gap-3 mt-1">
							<span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded uppercase tracking-wide font-bold border border-gray-700">{item.category}</span>
							{isSmart && (
								<span className="text-[10px] text-primary flex items-center gap-1 font-bold animate-pulse">
									<TrendingUp size={12} />
									Smart Mode Active
								</span>
							)}
						</div>
					</div>

					{/* Controls */}
					<div className="flex items-center gap-3">
						{/* Tempo Control */}
						<div className="flex flex-col items-end">
							<label className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${isSmart ? 'text-primary' : 'text-gray-500'}`}>{isSmart ? 'Adaptive BPM' : 'Target BPM'}</label>
							<div className={`flex items-center h-9 bg-black/40 rounded-lg overflow-hidden border transition-colors ${isSmart ? 'border-primary/50' : 'border-gray-700 group-hover:border-gray-600'}`}>
								<button
									onClick={() => onUpdate(item.id, 'tempoMode', isSmart ? 'MANUAL' : 'SMART')}
									className={`h-full px-2 border-r transition-colors flex items-center justify-center ${isSmart ? 'bg-primary text-black border-primary/50' : 'border-gray-700 text-gray-500 hover:text-white hover:bg-white/5'}`}
									title={isSmart ? 'Disable Smart Mode' : 'Enable Smart Mode'}
								>
									<Bot size={16} />
								</button>
								<input
									type="number"
									min="30"
									max="300"
									value={item.targetTempo}
									onChange={(e) => onUpdate(item.id, 'targetTempo', parseInt(e.target.value) || 60)}
									className="w-12 bg-transparent border-none text-right text-white font-mono text-sm focus:ring-0 p-0 pr-1 h-full"
								/>
								<span className="pr-2 text-[10px] text-gray-500 font-bold pt-0.5">BPM</span>
							</div>
						</div>

						{/* Duration Control */}
						<div className="flex flex-col items-end w-20">
							<label className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Duration</label>
							<div className="flex items-center h-9 w-full bg-black/40 rounded-lg border border-gray-700 group-hover:border-gray-600 transition-colors px-2">
								<Clock size={14} className="text-gray-600 mr-1" />
								<input
									type="number"
									min="1"
									max="60"
									value={item.duration}
									onChange={(e) => onUpdate(item.id, 'duration', parseInt(e.target.value) || 1)}
									className="w-full bg-transparent border-none text-center text-white font-mono text-sm focus:ring-0 p-0 h-full"
								/>
								<span className="text-[10px] text-gray-500 font-bold">m</span>
							</div>
						</div>
					</div>

					{/* Remove Button */}
					<button onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100" title="Remove">
						<Trash2 size={18} />
					</button>
				</div>
			</div>

			{/* Rest Connector */}
			<div className="absolute -bottom-[22px] left-0 right-0 flex justify-center z-0 pointer-events-none">
				<div className="h-6 w-px bg-gray-800 group-last:hidden"></div>
			</div>
			<div className="absolute -bottom-[12px] left-0 right-0 flex justify-center z-10 group-last:hidden">
				<div className="bg-dark-bg border border-gray-800 rounded-full px-2 py-0.5 flex items-center gap-1 hover:border-gray-600 transition-colors pointer-events-auto">
					<input
						type="number"
						min="0"
						max="300"
						value={item.restDuration}
						onChange={(e) => onUpdate(item.id, 'restDuration', parseInt(e.target.value) || 0)}
						className="w-6 bg-transparent border-none text-center p-0 text-[10px] font-mono text-gray-500 focus:ring-0 focus:text-white"
					/>
					<span className="text-[9px] text-gray-600 font-bold uppercase">s Rest</span>
				</div>
			</div>
		</div>
	);
}
