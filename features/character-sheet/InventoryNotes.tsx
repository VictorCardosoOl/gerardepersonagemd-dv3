import React, { useState } from 'react';
import { Character, Item, ItemType, Wealth } from '../../types';
import { CircleDot, Sword, Shield, FlaskConical, Wrench, Trash2, Plus, Coins, Backpack } from 'lucide-react';

interface Props {
    character: Character;
    isEditing: boolean;
    // Strict Type Safety
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

const getItemIcon = (type: ItemType) => {
    switch(type) {
        case 'weapon': return <Sword size={14} className="text-red-400" />;
        case 'armor': return <Shield size={14} className="text-blue-400" />;
        case 'consumable': return <FlaskConical size={14} className="text-green-400" />;
        case 'tool': return <Wrench size={14} className="text-orange-400" />;
        default: return <CircleDot size={10} className="text-slate-500" />;
    }
};

const CurrencyInput: React.FC<{ label: string, value: number, color: string, isEditing: boolean, onChange: (val: number) => void }> = ({ label, value, color, isEditing, onChange }) => (
    <div className="flex flex-col items-center gap-1 group bg-void-950/30 p-1.5 rounded-lg border border-transparent hover:border-white/5 transition-colors">
        <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity ${color}`}>{label}</span>
        {isEditing ? (
            <input 
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-center text-xs text-white outline-none font-mono focus:text-cyan-400"
            />
        ) : (
            <span className="font-mono text-sm text-white font-medium">{value}</span>
        )}
    </div>
);

export const InventoryNotes: React.FC<Props> = ({ character, isEditing, onChange }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    const [newItemType, setNewItemType] = useState<ItemType>('gear');
    
    const wealth = character.wealth || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

    const handleAddItem = () => {
        if (!newItemName.trim()) return;
        const newItem: Item = { id: crypto.randomUUID(), name: newItemName, quantity: newItemQty, type: newItemType };
        // Valid cast as Item[] matches Character['equipment']
        onChange('equipment', [...character.equipment, newItem]);
        setNewItemName(''); setNewItemQty(1);
    };

    const handleRemoveItem = (id: string) => {
        onChange('equipment', character.equipment.filter(i => i.id !== id));
    };

    const handleWealthChange = (key: keyof Wealth, value: number) => {
        const newWealth: Wealth = { ...wealth, [key]: value };
        // Valid cast as Wealth matches Character['wealth']
        onChange('wealth', newWealth);
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            {/* List Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2 mb-4 min-h-[200px]" data-lenis-prevent>
                {character.equipment.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Backpack size={24} className="text-white" />
                        </div>
                        <p className="text-xs uppercase tracking-widest text-mystic-400 font-bold">Mochila Vazia</p>
                    </div>
                ) : (
                    character.equipment.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="shrink-0 p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                    {getItemIcon(item.type)}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-body font-medium text-mystic-200 group-hover:text-white transition-colors truncate">{item.name}</span>
                                    {item.damage && <span className="text-[9px] text-red-400/60 font-mono">{item.damage}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pl-2">
                                <span className="text-[10px] font-mono text-mystic-500 bg-void-950/50 px-2 py-1 rounded-md border border-white/5">x{item.quantity}</span>
                                {isEditing && (
                                    <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-mystic-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"><Trash2 size={14} /></button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Wealth Display */}
            <div className="mt-auto mb-4 p-4 bg-void-900/40 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3 opacity-80 border-b border-white/5 pb-2">
                    <Coins size={14} className="text-gold-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-300">Algibeira</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                    <CurrencyInput label="PC" value={wealth.cp} color="text-[#b87333]" isEditing={isEditing} onChange={(v) => handleWealthChange('cp', v)} />
                    <CurrencyInput label="PP" value={wealth.sp} color="text-slate-400" isEditing={isEditing} onChange={(v) => handleWealthChange('sp', v)} />
                    <CurrencyInput label="PE" value={wealth.ep} color="text-cyan-600" isEditing={isEditing} onChange={(v) => handleWealthChange('ep', v)} />
                    <CurrencyInput label="PO" value={wealth.gp} color="text-gold-400" isEditing={isEditing} onChange={(v) => handleWealthChange('gp', v)} />
                    <CurrencyInput label="PL" value={wealth.pp} color="text-indigo-300" isEditing={isEditing} onChange={(v) => handleWealthChange('pp', v)} />
                </div>
            </div>

            {/* Add Item Input */}
            {isEditing && (
                <div className="pt-3 border-t border-white/5 animate-fade-in-up">
                    <div className="flex gap-2 items-center">
                        <div className="relative flex-grow">
                             <input type="text" placeholder="Adicionar item..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-void-900" />
                        </div>
                        <input type="number" min="1" value={newItemQty} onChange={(e) => setNewItemQty(parseInt(e.target.value))} className="w-12 bg-void-950/50 border border-white/10 rounded-xl px-1 py-3 text-xs text-white text-center focus:outline-none focus:border-cyan-500/50" />
                        <button onClick={handleAddItem} className="p-3 bg-cyan-500 hover:bg-cyan-400 text-void-950 rounded-xl transition-colors shadow-lg shadow-cyan-900/20 active:scale-95"><Plus size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};