import React, { useState } from 'react';
import { Character, DndClass, Item, ItemType } from '../../types';
import { CircleDot, Sword, Shield, FlaskConical, Wrench, Trash2, Plus } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

const getItemIcon = (type: ItemType) => {
    switch(type) {
        case 'weapon': return <Sword size={12} className="text-red-400/80" />;
        case 'armor': return <Shield size={12} className="text-blue-400/80" />;
        case 'consumable': return <FlaskConical size={12} className="text-green-400/80" />;
        case 'tool': return <Wrench size={12} className="text-orange-400/80" />;
        default: return <CircleDot size={8} className="text-slate-600" />;
    }
};

export const InventoryNotes: React.FC<Props> = ({ character, isEditing, onChange }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    const [newItemType, setNewItemType] = useState<ItemType>('gear');

    const handleAddItem = () => {
        if (!newItemName.trim()) return;
        const newItem: Item = {
            id: crypto.randomUUID(),
            name: newItemName,
            quantity: newItemQty,
            type: newItemType
        };
        const updatedEquipment = [...character.equipment, newItem];
        onChange('equipment', updatedEquipment);
        setNewItemName('');
        setNewItemQty(1);
    };

    const handleRemoveItem = (id: string) => {
        const updatedEquipment = character.equipment.filter(i => i.id !== id);
        onChange('equipment', updatedEquipment);
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2" data-lenis-prevent>
                {character.equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group">
                        <div className="flex items-center gap-3">
                            <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                                {getItemIcon(item.type)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-body font-medium text-mystic-200 group-hover:text-white transition-colors">{item.name}</span>
                                {item.damage && <span className="text-[9px] text-red-400/60 font-mono">{item.damage}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-mystic-500 bg-void-950/50 px-1.5 py-0.5 rounded border border-white/5">x{item.quantity}</span>
                            {isEditing && (
                                <button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1.5 text-mystic-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="mt-4 pt-3 border-t border-white/5 animate-fade-in-up">
                    <div className="flex gap-2 items-center">
                        <input 
                            type="text" 
                            placeholder="Item..." 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="flex-grow bg-void-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50"
                        />
                         <input 
                            type="number" 
                            min="1"
                            value={newItemQty}
                            onChange={(e) => setNewItemQty(parseInt(e.target.value))}
                            className="w-10 bg-void-950/50 border border-white/10 rounded-lg px-1 py-2 text-xs text-white text-center focus:outline-none focus:border-cyan-500/50"
                        />
                        <button 
                            onClick={handleAddItem}
                            className="p-2 bg-cyan-900/50 hover:bg-cyan-500 text-cyan-200 hover:text-void-950 rounded-lg transition-colors border border-cyan-500/20"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};