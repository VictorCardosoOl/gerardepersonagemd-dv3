import React, { useState, useEffect, useMemo } from 'react';
import { APIMonsterIndex, Monster } from '../types';
import { fetchMonsterList, fetchMonsterDetails } from '../services/dndApi';
import { MonsterCard } from './MonsterCard';
import { Search, X, Loader2 } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface MonsterListItemProps {
    name: string;
    active: boolean;
    onClick: () => void;
}

// Minimal List Item Component for the sidebar of the overlay
const MonsterListItem: React.FC<MonsterListItemProps> = ({ name, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-bold truncate border
            ${active 
                ? 'bg-accent-rose/10 text-accent-rose border-accent-rose/20' 
                : 'text-mystic-400 border-transparent hover:bg-white/5 hover:text-white'}
        `}
    >
        {name}
    </button>
);

export const BestiaryOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
    const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]);
    const [search, setSearch] = useState('');
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    
    // Initial Fetch
    useEffect(() => {
        if (isOpen && monsterList.length === 0) {
            fetchMonsterList().then(data => setMonsterList(data));
        }
    }, [isOpen]);

    const handleSelect = async (index: string) => {
        setIsLoadingDetails(true);
        const details = await fetchMonsterDetails(index);
        setSelectedMonster(details);
        setIsLoadingDetails(false);
    };

    const filteredList = useMemo(() => {
        const term = search.toLowerCase();
        if (!term) return monsterList.slice(0, 50);
        return monsterList.filter(m => m.name.toLowerCase().includes(term)).slice(0, 50);
    }, [search, monsterList]);

    // Keyboard Esc listener
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-void-950/60 backdrop-blur-sm animate-fade-in" 
                onClick={onClose}
            ></div>

            {/* Slide-over Panel */}
            <div className="relative w-full max-w-5xl h-full bg-[#0b1221] border-l border-white/10 shadow-2xl flex animate-slide-in-right overflow-hidden">
                
                {/* 1. Sidebar List (Left) */}
                <div className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-void-950/50">
                    <div className="p-5 border-b border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-display font-bold text-white text-lg tracking-widest uppercase">Bestiário</h2>
                            <button onClick={onClose} className="p-1 text-slate-500 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-void-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-accent-rose focus:outline-none"
                            />
                            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {monsterList.length === 0 ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-500" /></div>
                        ) : (
                            filteredList.map(m => (
                                <MonsterListItem 
                                    key={m.index} 
                                    name={m.name} 
                                    active={selectedMonster?.index === m.index} 
                                    onClick={() => handleSelect(m.index)} 
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Detail View (Right) */}
                <div className="flex-grow overflow-y-auto custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] p-8">
                    {isLoadingDetails ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                            <Loader2 className="animate-spin" size={40} />
                            <span className="text-xs font-bold uppercase tracking-widest">Invocando criatura...</span>
                        </div>
                    ) : selectedMonster ? (
                        <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
                                <Search size={32} className="text-white" />
                            </div>
                            <p className="font-display text-white text-lg tracking-widest">Selecione uma ameaça</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};