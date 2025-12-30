import React, { useState, useEffect, useMemo } from 'react';
import { APIMonsterIndex, Monster } from '../types';
import { fetchMonsterList, fetchMonsterDetails } from '../services/dndApi';
import { MonsterCard } from './MonsterCard';
import { Search, Loader2, Skull } from 'lucide-react';

interface MonsterListItemProps {
    name: string;
    active: boolean;
    onClick: () => void;
}

const MonsterListItem: React.FC<MonsterListItemProps> = ({ name, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            w-full text-left px-5 py-4 rounded-xl transition-all text-sm font-bold truncate border flex items-center justify-between group
            ${active 
                ? 'bg-white text-void-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'text-mystic-400 border-white/5 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'}
        `}
    >
        {name}
        {active && <div className="w-2 h-2 rounded-full bg-void-950 animate-pulse" />}
    </button>
);

export const BestiarySection: React.FC = () => {
    const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]);
    const [search, setSearch] = useState('');
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    
    // Initial Fetch
    useEffect(() => {
        if (monsterList.length === 0) {
            fetchMonsterList().then(data => setMonsterList(data));
        }
    }, []);

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

    return (
        <div className="w-full h-[80vh] flex gap-6 animate-fade-in">
            
            {/* 1. Sidebar List (Left) */}
            <div className="w-1/3 max-w-sm flex flex-col gap-4">
                <div className="glass-panel rounded-[2rem] p-6">
                    <h2 className="font-display font-black text-white text-3xl mb-6 flex items-center gap-3">
                        <Skull className="text-accent-rose" /> Bestiário
                    </h2>
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Buscar criatura..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-void-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-white/20"
                        />
                        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    </div>
                </div>

                <div className="glass-panel rounded-[2rem] flex-grow overflow-hidden flex flex-col p-4 relative">
                     {/* Gradient Masks for Scroll */}
                     <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-void-900 to-transparent z-10 pointer-events-none opacity-50"></div>
                     <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-void-900 to-transparent z-10 pointer-events-none opacity-50"></div>
                     
                    <div className="overflow-y-auto custom-scrollbar space-y-2 h-full px-2 py-2" data-lenis-prevent>
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
                        {monsterList.length > 0 && filteredList.length === 0 && (
                            <div className="text-center text-slate-500 py-4 text-sm">Nenhuma criatura encontrada.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Detail View (Right) */}
            <div className="flex-grow glass-panel rounded-[2.5rem] overflow-hidden relative border-white/10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                
                <div className="h-full overflow-y-auto custom-scrollbar p-8 md:p-12" data-lenis-prevent>
                    {isLoadingDetails ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                            <Loader2 className="animate-spin text-cyan-500" size={48} />
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500/50 animate-pulse">Consultando Arcanos...</span>
                        </div>
                    ) : selectedMonster ? (
                        <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-6">
                                <Search size={48} className="text-white" />
                            </div>
                            <p className="font-display text-white text-2xl font-bold tracking-widest">Selecione uma Ameaça</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};