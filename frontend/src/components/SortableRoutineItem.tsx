import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
	id: string;
	rudimentName: string;
	duration: number;
	onRemove: (id: string) => void;
	onDurationChange: (id: string, newDuration: number) => void;
}

export function SortableRoutineItem({ id, rudimentName, duration, onRemove, onDurationChange }: Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : 'auto',
		position: 'relative' as 'relative',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`
                group flex items-center gap-4 p-4 mb-3 rounded-xl border transition-all select-none
                ${isDragging ? 'bg-card-bg border-primary shadow-[0_0_30px_rgba(0,229,255,0.2)] scale-[1.02]' : 'bg-[#111827] border-gray-800 hover:border-gray-700'}
            `}
		>
			{/* Drag Handle */}
			<div {...attributes} {...listeners} className="cursor-grab text-gray-600 hover:text-white touch-none">
				<GripVertical size={20} />
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<h4 className="font-bold text-white text-lg truncate">{rudimentName}</h4>
			</div>

			{/* Duration Input */}
			<div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-gray-700">
				<Clock size={14} className="text-gray-500" />
				<input type="number" min="1" max="60" value={duration} onChange={(e) => onDurationChange(id, parseInt(e.target.value) || 1)} className="w-8 bg-transparent text-white font-mono text-center focus:outline-none appearance-none" />
				<span className="text-[10px] text-gray-500 font-bold tracking-wider">MIN</span>
			</div>

			{/* Remove Button */}
			<button onClick={() => onRemove(id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100" title="Remove">
				<Trash2 size={18} />
			</button>
		</div>
	);
}
