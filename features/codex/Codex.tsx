
import React, { useState } from 'react';
import { RulesRepository } from '../../services/RulesRepository';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { DndRace } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Dna, 
    Wind, 
    Eye, 
    Sparkles, 
    ArrowRight, 
    Hexagon, 
    MessageSquare,
    ChevronRight,
    Play,
    Info,
    Scroll
} from 'lucide-react';

const StatHex: React.FC<{ label: string, value: number, delay: number }> = ({ label, value, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
        className="relative flex flex-col items-center justify-center w-20 h-24 group cursor-default will-change-transform"
    >
        <div className="absolute inset-0 text-white/[0.03] group-hover:text-cyan-500/10 transition-colors duration-500">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-lg">
                <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" />
            </svg>
        </div>
        <div className="absolute inset-0 text-white/10 group-hover:text-cyan-400/40 transition-colors duration-500">
             <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" />
            </svg>
        </div>
        <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider text-mystic-500 group-hover:text-cyan-300 transition-colors">{label.substring(0, 3)}</span>
        <span className="relative z-10 text-2xl font-display font-bold text-white group-hover:scale-110 transition-transform shadow-black drop-shadow-md">+{value}</span>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
);

const RaceListItem: React.FC<{ race: DndRace, isActive: boolean, onClick: () => void }> = ({ race, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`
                w-full text-left px-5 py-4 flex items-center justify-between group transition-all duration-300 relative overflow-hidden rounded-xl mb-1
                ${isActive 
                    ? 'bg-white/[0.03] border border-cyan-500/30' 
                    : 'border border-transparent hover:bg-white/[0.02] hover:border-white/5'}
            `}
        >
            {isActive && (
                <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                />
            )}
            <div className="flex items-center gap-4 relative z-10 pl-2">
                <span className={`
                    text-sm font-display font-bold tracking-widest uppercase transition-colors
                    ${isActive ? 'text-white' : 'text-mystic-500 group-hover:text-mystic-300'}
                `}>
                    {race.name}
                </span>
            </div>
            {isActive && <ChevronRight size={14} className="text-cyan-400 animate-pulse relative z-10" />}
        </button>
    );
};

export const Codex: React.FC = () => {
    const races = RulesRepository.getRaces();
    const { createCharacter } = useCharacter();
    const [selectedRace, setSelectedRace] = useState<DndRace>(races[0]);

    const bgImage = RACE_IMAGES[selectedRace.name] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="w-full max-w-[1800px] mx-auto min-h-[85vh] h-[85vh] flex flex-col lg:flex-row gap-6 px-4 lg:px-12 py-8 animate-fade-in overflow-hidden">
            <div className="w-full lg:w-80 shrink-0 flex flex-col h-full gap-4 z-20">
                <div className="glass-panel p-6 rounded-[1.5rem] bg-void-950/80 border-white/10 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-950/30 rounded-lg border border-cyan-500/20 text-cyan-400 shadow-glow-cyan">
                            <Dna size={20} />
                        </div>
                        <h2 className="text-xl font-display font-bold text-white tracking-widest">CÓDICE</h2>
                    </div>
                    <p className="text-[11px] text-mystic-400 font-body leading-relaxed border-t border-white/5 pt-3">
                        Arquivo biológico das espécies conhecidas.
                    </p>
                </div>
                <div 
                    className="flex-grow overflow-y-auto custom-scrollbar glass-panel p-2 rounded-[1.5rem] bg-void-950/60 border-white/5"
                    data-lenis-prevent
                >
                    {races.map((race) => (
                        <RaceListItem 
                            key={race.name} 
                            race={race} 
                            isActive={selectedRace.name === race.name} 
                            onClick={() => setSelectedRace(race)} 
                        />
                    ))}
                </div>
            </div>

            <div className="flex-grow relative h-full rounded-[2.5rem] overflow-hidden bg-void-950 border border-white/10 shadow-2xl group ring-1 ring-white/5">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedRace.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 h-full w-full"
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] ease-linear scale-100 group-hover:scale-110 will-change-transform opacity-60"
                            style={{ backgroundImage: `url(${bgImage})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-void-950 via-void-950/90 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>

                        <div 
                            className="absolute inset-0 overflow-y-auto custom-scrollbar" 
                            data-lenis-prevent
                        >
                            <div className="min-h-full p-8 lg:p-16 flex flex-col justify-center">
                                <div className="max-w-3xl relative z-10 pt-10">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="mb-8"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md">
                                                Raça Jogável
                                            </span>
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-mystic-100 to-mystic-400">
                                            {selectedRace.name}
                                        </h1>
                                        <div className="relative pl-6 border-l-2 border-cyan-500/30 mb-10">
                                            <p className="text-xl md:text-2xl text-mystic-100 font-light leading-relaxed font-body">
                                                {selectedRace.description}
                                            </p>
                                        </div>
                                    </motion.div>

                                    <div className="flex flex-wrap gap-4 mb-12 pl-2">
                                        {Object.entries(selectedRace.bonuses).map(([attr, val], idx) => {
                                            if (!val) return null;
                                            return <StatHex key={attr} label={attr} value={val} delay={0.3 + (idx * 0.1)} />;
                                        })}
                                    </div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
                                    >
                                        <div className="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 text-mystic-400 mb-1">
                                                <Wind size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Deslocamento</span>
                                            </div>
                                            <span className="text-lg font-display font-bold text-white">{selectedRace.speed}m</span>
                                        </div>
                                        <div className="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 text-mystic-400 mb-1">
                                                <Eye size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Sentidos</span>
                                            </div>
                                            <span className="text-sm font-body text-white truncate" title={selectedRace.senses?.join(', ')}>
                                                {selectedRace.senses?.length ? selectedRace.senses[0] : "Normal"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 text-mystic-400 mb-1">
                                                <MessageSquare size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Idiomas</span>
                                            </div>
                                            <span className="text-sm font-body text-white truncate" title={selectedRace.languages.join(', ')}>
                                                {selectedRace.languages[0]}{selectedRace.languages.length > 1 ? ` +${selectedRace.languages.length - 1}` : ''}
                                            </span>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="mb-12"
                                    >
                                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400 mb-4 opacity-80">
                                            <Sparkles size={14} /> Traços Raciais
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedRace.traits?.map(trait => (
                                                <div key={trait} className="group/trait relative">
                                                    <span className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-mystic-200 font-medium tracking-wide hover:bg-white/[0.1] hover:text-white transition-colors cursor-help flex items-center gap-2 hover:border-cyan-500/30">
                                                        <Scroll size={12} className="opacity-50" /> {trait}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => createCharacter(false, selectedRace.name)}
                                        className="px-8 py-4 bg-white text-void-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] mb-8"
                                    >
                                        <Hexagon size={16} />
                                        <span>Criar {selectedRace.name}</span>
                                        <ArrowRight size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
