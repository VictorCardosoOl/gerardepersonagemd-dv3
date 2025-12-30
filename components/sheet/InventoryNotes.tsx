import React from 'react';
import { Character, DndClass, Item } from '../../types';
import { Backpack, Feather, Sword, Shield, Box, CircleDot } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

const getItemIcon = (type: Item['type']) => {
    switch(type) {
        case 'weapon': return <Sword size={14} />;
        case 'armor': return <Shield size={14} />;
        default: return <CircleDot size={10} />;
    }
};

export const InventoryNotes: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar pr-2" data-lenis-prevent>
            <div className="space-y-2">
                {character.equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="text-mystic-500 group-hover:text-cyan-400 transition-colors p-2 bg-void-950 rounded-lg border border-white/5">
                                {getItemIcon(item.type)}
                            </div>
                            <span className="text-sm font-medium text-white tracking-wide">{item.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-mystic-600 bg-void-950 px-2 py-1 rounded border border-white/5">x{item.quantity}</span>
                    </div>
                ))}
                {character.equipment.length === 0 && <div className="text-center text-xs text-mystic-700 mt-10">Mochila vazia</div>}
            </div>
        </div>
    );
};