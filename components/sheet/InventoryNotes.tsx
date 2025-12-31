import React from 'react';
import { Character, DndClass, Item } from '../../types';
import { Backpack, Feather, Sword, Shield, Box, CircleDot, Wrench, FlaskConical, Scroll } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

const getItemIcon = (type: Item['type']) => {
    switch(type) {
        case 'weapon': return <Sword size={14} className="text-red-400" />;
        case 'armor': return <Shield size={14} className="text-blue-400" />;
        case 'consumable': return <FlaskConical size={14} className="text-green-400" />;
        case 'tool': return <Wrench size={14} className="text-orange-400" />;
        default: return <CircleDot size={10} className="text-slate-500" />;
    }
};

export const InventoryNotes: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar pr-2" data-lenis-prevent>
            <div className="space-y-2">
                {character.equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-void-950 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                                {getItemIcon(item.type)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-mystic-100 tracking-wide group-hover:text-white transition-colors">{item.name}</span>
                                {item.damage && <span className="text-[10px] text-mystic-500 font-mono">{item.damage}</span>}
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-mystic-400 bg-void-950 px-2 py-1 rounded border border-white/5 group-hover:text-white transition-colors">x{item.quantity}</span>
                    </div>
                ))}
                {character.equipment.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-mystic-700 gap-2 border-2 border-dashed border-white/5 rounded-xl">
                        <Backpack size={24} className="opacity-20" />
                        <span className="text-xs uppercase tracking-widest">Mochila vazia</span>
                    </div>
                )}
            </div>
        </div>
    );
};