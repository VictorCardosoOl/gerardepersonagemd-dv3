
import React, { useState, useEffect } from 'react';
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
    Scroll,
    Layout
} from 'lucide-react';

// Componente para os Hexágonos de Atributos
const StatHex: React.FC<{ label: string, value: number, delay: number }> = ({ label, value, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
        className="relative flex flex-col items-center justify-center w-20 h-24 group cursor-default will-change-transform shrink-0"
    >
        {/* Background Hexagon SVG */}
        <div className="absolute inset-0 text-void-900/80 group-hover:text-cyan-950/80 transition-colors duration-500 drop-shadow-lg">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" />
            </svg>
        </div>
        
        {/* Border Hexagon SVG */}
        <div className="absolute inset-0 text-white/10 group-hover:text-cyan-400/50 transition-colors duration-500">
             <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <polygon points="50 1, 95 25, 95 75, 50 99, 5 75, 5 25" />
            </svg>
        </div>

        <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider text-mystic-400 group-hover:text-cyan-300 transition-colors">{label.substring(0, 3)}</span>
        <span className="relative z-10 text-2xl font-display font-bold text-white group-hover:scale-110 transition-transform shadow-black drop-shadow-md">+{value}</span>
        
        {/* Glow Effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
);

// Item da Lista de Navegação
const RaceListItem: React.FC<{ race: DndRace, isActive: boolean, onClick: () => void }> = ({ race, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`
                w-full text-left px-5 py-4 flex items-center justify-between group transition-all duration-500 relative overflow-hidden rounded-xl mb-2 border
                ${isActive 
                    ? 'bg-gradient-to-r from-cyan-950/40 to-transparent border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5'}
            `}
        >
            <div className="flex items-center gap-4 relative z-10 pl-2">
                {/* Active Indicator Dot */}
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-white/10 group-hover:bg-white/30'}`} />
                
                <span className={`
                    text-sm font-display font-bold tracking-widest uppercase transition-colors duration-300
                    ${isActive ? 'text-white scale-105 origin-left' : 'text-mystic-500 group-hover:text-mystic-200'}
                `}>
                    {race.name}
                </span>
            </div>
            
            {isActive && <ChevronRight size={14} className="text-cyan-400 animate-pulse relative z-10" />}
            
            {/* Background Hover Shine */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isActive ? 'hidden' : 'block'}`} />
        </button>
    );
};

export const Codex: React.FC = () => {
    const races = RulesRepository.getRaces();
    const { createCharacter } = useCharacter();
    const [selectedRace, setSelectedRace] = useState<DndRace>(races[0]);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const bgImage = RACE_IMAGES[selectedRace.name] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop';

    // Reset scroll when race changes
    useEffect(() => {
        const contentContainer = document.getElementById('codex-content-scroll');
        if (contentContainer) contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedRace]);

    return (
        <div className="w-full max-w-[1800px] mx-auto h-auto lg:h-[85vh] flex flex-col lg:flex-row gap-6 px-4 lg:px-12 py-6 animate-fade-in overflow-hidden">
            
            {/* --- LEFT COLUMN: NAVIGATION --- */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 z-20">
                <div className="glass-panel p-6 rounded-[2rem] bg-void-950/80 border-white/10 backdrop-blur-xl shrink-0 relative overflow-hidden">
                    {/* Decorative Header BG */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Dna size={80} /></div>
                    
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="p-2.5 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-cyan-400 shadow-glow-cyan">
                            <Layout size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-widest leading-none">CÓDICE</h2>
                            <span className="text-[10px] text-mystic-500 uppercase tracking-widest font-mono">Origens</span>
                        </div>
                    </div>
                </div>

                <div 
                    className="flex-grow overflow-x-auto lg:overflow-y-auto custom-scrollbar glass-panel p-3 rounded-[2rem] bg-void-950/60 border-white/5 flex lg:flex-col gap-2 snap-x"
                    data-lenis-prevent
                >
                    {races.map((race) => (
                        <div key={race.name} className="snap-start min-w-[200px] lg:min-w-0">
                            <RaceListItem 
                                race={race} 
                                isActive={selectedRace.name === race.name} 
                                onClick={() => setSelectedRace(race)} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT COLUMN: DISPLAY & CONTENT --- */}
            <div className="flex-grow relative h-[70vh] lg:h-full rounded-[3rem] overflow-hidden bg-void-950 border border-white/10 shadow-2xl group ring-1 ring-white/5">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedRace.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 h-full w-full"
                    >
                        {/* 1. Background Image Layer */}
                        <div className="absolute inset-0 bg-void-950">
                            <motion.img 
                                src={bgImage}
                                alt={selectedRace.name}
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.5 }}
                                transition={{ duration: 1.5 }}
                                className="w-full h-full object-cover object-center"
                                onLoad={() => setIsImageLoading(false)}
                            />
                        </div>

                        {/* 2. Gradient Overlays for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-void-950 via-void-950/90 to-transparent sm:via-void-950/70"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                        {/* 3. Scrollable Content Container */}
                        <div 
                            id="codex-content-scroll"
                            className="absolute inset-0 overflow-y-auto custom-scrollbar" 
                            data-lenis-prevent
                        >
                            <div className="min-h-full p-8 lg:p-16 flex flex-col max-w-4xl">
                                
                                {/* Header Section */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="mb-8 pt-4"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 backdrop-blur-md">
                                            Raça Jogável
                                        </span>
                                        <div className="h-px w-12 bg-white/20"></div>
                                    </div>
                                    
                                    <h1 className="text-6xl md:text-7xl lg:text-9xl font-display font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-mystic-100 to-mystic-500">
                                        {selectedRace.name}
                                    </h1>

                                    {/* Stats Hexes Row */}
                                    <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
                                        {Object.entries(selectedRace.bonuses).map(([attr, val], idx) => {
                                            if (!val) return null;
                                            return <StatHex key={attr} label={attr} value={val} delay={0.3 + (idx * 0.1)} />;
                                        })}
                                    </div>
                                </motion.div>

                                {/* Description Text Area - FIX: Ensuring flex-grow and proper spacing */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="relative pl-6 md:pl-8 border-l-2 border-cyan-500/30 mb-12 max-w-2xl"
                                >
                                    <p className="text-lg md:text-xl text-mystic-100 font-light leading-relaxed font-body text-justify tracking-wide">
                                        {selectedRace.description}
                                    </p>
                                </motion.div>

                                {/* Info Grid (Speed, Senses, Langs) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
                                >
                                    <div className="flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                                        <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                            <Wind size={18} /> <span className="text-[10px] font-bold uppercase tracking-wider text-mystic-400">Deslocamento</span>
                                        </div>
                                        <span className="text-2xl font-display font-bold text-white">{selectedRace.speed}m</span>
                                    </div>
                                    <div className="flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                                            <Eye size={18} /> <span className="text-[10px] font-bold uppercase tracking-wider text-mystic-400">Sentidos</span>
                                        </div>
                                        <span className="text-sm font-body text-white font-medium truncate" title={selectedRace.senses?.join(', ')}>
                                            {selectedRace.senses?.length ? selectedRace.senses[0] : "Normal"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                                        <div className="flex items-center gap-2 text-gold-400 mb-2">
                                            <MessageSquare size={18} /> <span className="text-[10px] font-bold uppercase tracking-wider text-mystic-400">Idiomas</span>
                                        </div>
                                        <span className="text-sm font-body text-white font-medium truncate" title={selectedRace.languages.join(', ')}>
                                            {selectedRace.languages[0]}{selectedRace.languages.length > 1 ? ` +${selectedRace.languages.length - 1}` : ''}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Traits Grid */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mb-12"
                                >
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-6 opacity-90">
                                        <Sparkles size={14} /> Traços Raciais
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedRace.racialTraits?.map((trait, i) => (
                                            <div key={i} className="group/trait relative p-4 rounded-xl bg-void-900/40 border border-white/10 hover:border-cyan-500/30 transition-colors flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg text-mystic-400 group-hover/trait:text-cyan-400 transition-colors">
                                                    <Scroll size={16} />
                                                </div>
                                                <span className="text-sm text-mystic-200 font-medium tracking-wide group-hover/trait:text-white transition-colors">
                                                    {trait}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Action Button */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="pb-8"
                                >
                                    <button
                                        onClick={() => createCharacter(false, selectedRace.name)}
                                        className="group relative w-full sm:w-auto px-8 py-5 bg-white text-void-950 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            <Hexagon size={18} strokeWidth={2} />
                                            <span>Criar {selectedRace.name}</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
