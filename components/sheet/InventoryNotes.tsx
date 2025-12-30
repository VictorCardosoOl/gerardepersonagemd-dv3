import React from 'react';
import { Character, DndClass, Item } from '../../types';
import { Backpack, Feather, Sword, Shield, Box } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

const getItemIcon = (type: Item['type']) => {
    switch(type) {
        case 'weapon': return <Sword size={12} />;
        case 'armor': return <Shield size={12} />;
        default: return <Box size={12} />;
    }
};

export const InventoryNotes: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Inventory Panel */}
            <div className="glass-panel rounded-3xl p-6 min-h-[300px]">
                <h3 className="font-display text-white/50 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Backpack size={14} /> Inventário
                </h3>
                
                <div className="space-y-2">
                    {character.equipment.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="text-mystic-400 opacity-50">{getItemIcon(item.type)}</div>
                                <span className="text-sm text-mystic-200">{item.name}</span>
                            </div>
                            <span className="text-xs font-mono text-mystic-500">x{item.quantity}</span>
                        </div>
                    ))}
                    {character.equipment.length === 0 && <div className="text-center text-xs text-mystic-700 mt-10">Mochila vazia</div>}
                </div>
            </div>

            {/* Lore Panel */}
            <div className="glass-panel rounded-3xl p-6 min-h-[300px] flex flex-col">
                <h3 className="font-display text-white/50 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Feather size={14} /> História
                </h3>
                
                <div className="flex-grow">
                    {isEditing ? (
                        <textarea 
                            value={character.backstory || ''} 
                            onChange={(e) => onChange('backstory', e.target.value)}
                            className="w-full h-full bg-void-900/50 rounded-lg p-4 text-mystic-300 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/30 border border-white/5 resize-none font-body"
                            placeholder="Escreva a lenda..."
                        />
                    ) : (
                        <p className="text-mystic-300 text-sm leading-7 font-body opacity-80">
                            {character.backstory || "Sem história definida."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};