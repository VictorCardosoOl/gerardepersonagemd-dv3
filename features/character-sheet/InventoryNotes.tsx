
import React, { useState } from 'react';
import { Character, Item, ItemType, Wealth } from '../../types';
import { CircleDot, Sword, Shield, FlaskConical, Wrench, Trash2, Plus, Coins, Backpack } from 'lucide-react';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

const getItemIcon = (type: ItemType) => {
    switch(type) {
        case 'weapon': return <Sword size={14} className="text-rose-400" />;
        case 'armor': return <Shield size={14} className="text-cyan-400" />;
        case 'consumable': return <FlaskConical size={14} className="text-emerald-400" />;
        case 'tool': return <Wrench size={14} className="text-gold-400" />;
        default: return <CircleDot size={10} className="text-mystic-600" />;
    }
};

const CurrencyInput: React.FC<{ label: string, value: number, color: string, isEditing: boolean, onChange: (val: number) => void }> = ({ label, value, color, isEditing, onChange }) => (
    <div className="flex flex-col items-center gap-1 group relative p-2 rounded-xl bg-void-950/40 border border-white/5 hover:border-white/10 transition-all">
        <span className={`text-[9px] font-bold uppercase tracking-wider opacity-70 ${color}`}>{label}</span>
        {isEditing ? (
            <input 
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-center text-xs text-white outline-none font-mono focus:text-cyan-400"
            />
        ) : (
            <span className="font-mono text-sm text-white font-medium shadow-black drop-shadow-sm">{value}</span>
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
        onChange('equipment', [...character.equipment, newItem]);
        setNewItemName(''); setNewItemQty(1);
    };

    const handleRemoveItem = (id: string) => {
        onChange('equipment', character.equipment.filter(i => i.id !== id));
    };

    const handleWealthChange = (key: keyof Wealth, value: number) => {
        const newWealth: Wealth = { ...wealth, [key]: value };
        onChange('wealth', newWealth);
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            {/* List Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-3 space-y-2 mb-6 min-h-[200px]" data-lenis-prevent>
                {character.equipment.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Backpack size={32} className="text-white" strokeWidth={1} />
                        </div>
                        <p className="text-xs uppercase tracking-widest text-mystic-400 font-bold">Mochila Vazia</p>
                    </div>
                ) : (
                    character.equipment.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className="shrink-0 p-2 bg-void-950/60 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors shadow-inner">
                                    {getItemIcon(item.type)}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-body font-medium text-mystic-200 group-hover:text-white transition-colors truncate">{item.name}</span>
                                    {item.damage && <span className="text-[10px] text-rose-400/80 font-mono tracking-wide">{item.damage}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pl-2">
                                <span className="text-[10px] font-mono text-mystic-500 bg-void-950/40 px-2 py-1 rounded-md border border-white/5">x{item.quantity}</span>
                                {isEditing && (
                                    <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-mystic-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors"><Trash2 size={14} /></button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Wealth Display */}
            <div className="mt-auto mb-4 p-5 bg-gradient-to-br from-void-950/60 to-void-900/60 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4 opacity-90 border-b border-white/5 pb-3">
                    <div className="p-1.5 bg-gold-500/10 rounded text-gold-400"><Coins size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-300">Tesouro</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                    <CurrencyInput label="PC" value={wealth.cp} color="text-[#b87333]" isEditing={isEditing} onChange={(v) => handleWealthChange('cp', v)} />
                    <CurrencyInput label="PP" value={wealth.sp} color="text-slate-400" isEditing={isEditing} onChange={(v) => handleWealthChange('sp', v)} />
                    <CurrencyInput label="PE" value={wealth.ep} color="text-cyan-600" isEditing={isEditing} onChange={(v) => handleWealthChange('ep', v)} />
                    <CurrencyInput label="PO" value={wealth.gp} color="text-gold-400" isEditing={isEditing} onChange={(v) => handleWealthChange('gp', v)} />
                    <CurrencyInput label="PL" value={wealth.pp} color="text-indigo-300" isEditing={isEditing} onChange={(v) => handleWealthChange('pp', v)} />
                </div>
            </div>

            {/* Add Item Input */}
            {isEditing && (
                <div className="pt-4 border-t border-white/5 animate-fade-in-up">
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-grow">
                             <input type="text" placeholder="Adicionar item..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full bg-void-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-void-950 transition-all" />
                        </div>
                        <input type="number" min="1" value={newItemQty} onChange={(e) => setNewItemQty(parseInt(e.target.value))} className="w-14 bg-void-950/60 border border-white/10 rounded-xl px-2 py-3 text-xs text-white text-center focus:outline-none focus:border-cyan-500/50 transition-all" />
                        <button onClick={handleAddItem} className="p-3 bg-cyan-500 hover:bg-cyan-400 text-void-950 rounded-xl transition-colors shadow-lg shadow-cyan-500/20 active:scale-95"><Plus size={16} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};
