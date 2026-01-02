
import React from 'react';
import { APIMonsterIndex } from './types';
import { MonsterCard } from './MonsterCard';
import { Search, Loader2, Skull, ScrollText, ChevronRight } from 'lucide-react';
import { useBestiary } from './useBestiary';
import { MONSTERS_BR } from '../../data/monsters_br';

interface Props {
    preLoadedList?: APIMonsterIndex[];
}

interface MonsterListItemProps {
    name: string;
    active: boolean;
    cr: number | string; 
    onClick: () => void;
}

const MonsterListItem: React.FC<MonsterListItemProps> = ({ name, active, cr, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium border flex items-center justify-between group relative overflow-hidden
            ${active 
                ? 'bg-white/[0.06] text-white border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] translate-x-1' 
                : 'text-mystic-400 border-transparent hover:bg-white/[0.02] hover:text-mystic-200 hover:pl-5'}
        `}
    >
        <span className="relative z-10 truncate font-display tracking-wide group-hover:text-cyan-200 transition-colors">{name}</span>
        
        <div className="flex items-center gap-3 relative z-10">
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${active ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-white/5 text-mystic-600 border-white/5 group-hover:border-white/10'}`}>
                ND {cr}
            </span>
            {active ? (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_currentColor] animate-pulse" />
            ) : (
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-50 transition-opacity -ml-1" />
            )}
        </div>
        
        {/* Active Background Effect */}
        {active && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />}
    </button>
);

export const BestiarySection: React.FC<Props> = ({ preLoadedList = [] }) => {
    const { 
        monsterList, 
        filteredList, 
        search, 
        setSearch, 
        selectedMonster, 
        handleSelect, 
        clearSelection, 
        isLoadingDetails 
    } = useBestiary(preLoadedList);

    // Helper para pegar o CR da lista estática para exibir no menu lateral
    const getMonsterCR = (index: string) => {
        const found = MONSTERS_BR.find(m => m.index === index);
        return found ? found.challenge_rating : '?';
    };

    return (
        <div className="w-full max-w-[1800px] mx-auto h-[85vh] flex gap-8 animate-fade-in px-4 md:px-12 py-6">
            
            {/* 1. Sidebar List (Left) */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4 shrink-0 animate-slide-in-right" style={{ animationDuration: '0.6s' }}>
                <div className="glass-panel rounded-[2rem] p-6 bg-void-950/80 border-white/10 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Skull size={120} strokeWidth={0.5} />
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="font-display font-black text-white text-2xl mb-1 flex items-center gap-3">
                            <div className="p-2 bg-accent-rose/10 rounded-xl border border-accent-rose/20 text-accent-rose shadow-glow-gold">
                                <Skull size={20} />
                            </div>
                            Bestiário
                        </h2>
                        <p className="text-[10px] text-mystic-500 uppercase tracking-widest font-mono mb-6 pl-1">Índice de Ameaças</p>
                        
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur"></div>
                            <input 
                                type="text" 
                                placeholder="Filtrar criaturas..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="relative w-full bg-void-900 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-white/20 shadow-inner font-body"
                            />
                            <Search size={16} className="absolute left-3.5 top-3.5 text-mystic-500 group-focus-within:text-cyan-400 transition-colors z-10" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[2rem] flex-grow overflow-hidden flex flex-col bg-void-950/60 border-white/5 relative">
                    {/* Header Columns */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center text-[9px] uppercase tracking-[0.2em] text-mystic-600 font-bold px-6 bg-void-950/50 backdrop-blur-md z-10">
                        <span>Nome da Criatura</span>
                        <span>Desafio</span>
                    </div>
                    
                    {/* List */}
                    <div className="overflow-y-auto custom-scrollbar space-y-1 h-full p-3 scroll-smooth" data-lenis-prevent>
                        {monsterList.length === 0 ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-500" /></div>
                        ) : (
                            filteredList.map(m => (
                                <MonsterListItem 
                                    key={m.index} 
                                    name={m.name} 
                                    cr={getMonsterCR(m.index)}
                                    active={selectedMonster?.index === m.index} 
                                    onClick={() => handleSelect(m.index)} 
                                />
                            ))
                        )}
                        {monsterList.length > 0 && filteredList.length === 0 && (
                            <div className="text-center text-mystic-500 py-12 flex flex-col items-center gap-4 opacity-50">
                                <Search size={32} strokeWidth={1} />
                                <span className="text-xs uppercase tracking-widest">Nenhuma ameaça encontrada</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom Gradient Mask */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-void-950/80 to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* 2. Detail View (Right) */}
            <div className="hidden md:block flex-grow glass-panel rounded-[2.5rem] overflow-hidden relative border-white/10 bg-void-950/30 shadow-2xl transition-all duration-700">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
                
                <div 
                    className="h-full overflow-y-auto custom-scrollbar p-8 md:p-12 relative z-10" 
                    data-lenis-prevent
                >
                    {isLoadingDetails ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-8 animate-pulse-slow">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
                                <Loader2 className="animate-spin text-cyan-400 relative z-10" size={64} strokeWidth={1} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-500/50">Consultando Grimório...</span>
                        </div>
                    ) : selectedMonster ? (
                        <MonsterCard monster={selectedMonster} onClose={clearSelection} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
                            <div className="w-64 h-64 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-10 bg-void-900/30 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
                                <ScrollText size={80} className="text-mystic-700" strokeWidth={0.5} />
                            </div>
                            <h3 className="font-display text-white text-5xl font-bold tracking-widest mb-4 opacity-50">Bestiário</h3>
                            <p className="text-mystic-500 font-light text-lg tracking-wide">Selecione uma criatura para revelar seus segredos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
