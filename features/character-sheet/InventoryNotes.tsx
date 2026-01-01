
import React, { useState } from 'react';
import { Character, Item, ItemType, Wealth } from '../../types';
import { CircleDot, Sword, Shield, FlaskConical, Wrench, Trash2, Plus, Coins } from 'lucide-react';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
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

const CurrencyInput: React.FC<{ label: string, value: number, color: string, isEditing: boolean, onChange: (val: number) => void }> = ({ label, value, color, isEditing, onChange }) => (
    <div className="flex flex-col items-center gap-1 group">
        <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity ${color}`}>{label}</span>
        {isEditing ? (
            <input 
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="ghost-input w-12 border-b border-white/10 text-center text-xs text-white focus:border-cyan-500/50"
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
        onChange('equipment', [...character.equipment, newItem]);
        setNewItemName(''); setNewItemQty(1);
    };

    const handleRemoveItem = (id: string) => {
        onChange('equipment', character.equipment.filter(i => i.id !== id));
    };

    const handleWealthChange = (key: keyof Wealth, value: number) => {
        onChange('wealth', { ...wealth, [key]: value });
    };

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2 mb-4" data-lenis-prevent>
                {character.equipment.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300 group">
                        <div className="flex items-center gap-3">
                            <div className="opacity-70 group-hover:opacity-100 transition-opacity">{getItemIcon(item.type)}</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-body font-medium text-mystic-200 group-hover:text-white transition-colors">{item.name}</span>
                                {item.damage && <span className="text-[9px] text-red-400/60 font-mono">{item.damage}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-mystic-500 bg-void-950/50 px-1.5 py-0.5 rounded border border-white/5">x{item.quantity}</span>
                            {isEditing && (
                                <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-mystic-600 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={12} /></button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-auto mb-4 p-3 bg-void-950/30 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-3 opacity-60">
                    <Coins size={12} className="text-gold-400" /><span className="text-[10px] font-bold uppercase tracking-widest text-mystic-300">Algibeira</span>
                </div>
                <div className="flex justify-between items-center px-1">
                    <CurrencyInput label="PC" value={wealth.cp} color="text-[#b87333]" isEditing={isEditing} onChange={(v) => handleWealthChange('cp', v)} />
                    <div className="w-px h-6 bg-white/5"></div>
                    <CurrencyInput label="PP" value={wealth.sp} color="text-slate-400" isEditing={isEditing} onChange={(v) => handleWealthChange('sp', v)} />
                    <div className="w-px h-6 bg-white/5"></div>
                    <CurrencyInput label="PE" value={wealth.ep} color="text-cyan-600" isEditing={isEditing} onChange={(v) => handleWealthChange('ep', v)} />
                    <div className="w-px h-6 bg-white/5"></div>
                    <CurrencyInput label="PO" value={wealth.gp} color="text-gold-400" isEditing={isEditing} onChange={(v) => handleWealthChange('gp', v)} />
                    <div className="w-px h-6 bg-white/5"></div>
                    <CurrencyInput label="PL" value={wealth.pp} color="text-indigo-300" isEditing={isEditing} onChange={(v) => handleWealthChange('pp', v)} />
                </div>
            </div>
            {isEditing && (
                <div className="pt-3 border-t border-white/5 animate-fade-in-up">
                    <div className="flex gap-2 items-center">
                        <input type="text" placeholder="Item..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="ghost-input flex-grow bg-void-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:border-cyan-500/50" />
                        <input type="number" min="1" value={newItemQty} onChange={(e) => setNewItemQty(parseInt(e.target.value))} className="ghost-input w-10 bg-void-950/50 border border-white/10 rounded-lg px-1 py-2 text-xs text-white text-center focus:border-cyan-500/50" />
                        <button onClick={handleAddItem} className="p-2 bg-cyan-900/50 hover:bg-cyan-500 text-cyan-200 hover:text-void-950 rounded-lg transition-colors border border-cyan-500/20"><Plus size={14} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};
