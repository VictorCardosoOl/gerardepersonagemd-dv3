import React, { useRef, useState } from 'react';
import { Plus, Printer, Swords, Shield, Download, Trash2, Crown, Sparkles, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { Character } from '../../types';

interface Props {
    onSelect: (char: Character) => void;
    onPrint: (char: Character) => void; 
    onExport: (char: Character) => void;
}

// --- ETHEREAL GLASS CARD COMPONENT ---
const GlassCard: React.FC<{ 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
    bgImage?: string;
}> = ({ children, onClick, className = "", bgImage }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div 
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`relative group rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer ${className} ${isHovering ? 'shadow-glow-cyan/30 translate-y-[-4px]' : 'shadow-glass'}`}
        >
            {/* 1. Background Layer (Parallax Zoom) */}
            {bgImage && (
                <div className="absolute inset-0 pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                        style={{ 
                            backgroundImage: `url(${bgImage})`,
                            transform: isHovering ? 'scale(1.1)' : 'scale(1.0)',
                            filter: isHovering ? 'grayscale(0%)' : 'grayscale(40%) contrast(110%)'
                        }} 
                    />
                    {/* Deep Void Gradient Overlay - Essencial para legibilidade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-void-900/10 mix-blend-multiply opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-950/20 to-void-950 opacity-90" />
                </div>
            )}

            {/* 2. Glass Surface & Noise */}
            <div className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay pointer-events-none"></div>
            
            {/* 3. Glowing Border */}
            <div className={`absolute inset-0 rounded-[2rem] border transition-colors duration-500 pointer-events-none z-20 ${isHovering ? 'border-cyan-400/30' : 'border-white/10'}`}></div>
            
            {/* 4. Content Content */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                {children}
            </div>
        </div>
    );
};

export const Sanctum: React.FC<Props> = ({ onSelect, onPrint, onExport }) => {
    const { savedCharacters, createCharacter, deleteCharacter } = useCharacter();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1, 
            transition: { staggerChildren: 0.08 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
        show: { opacity: 1, scale: 1, filter: 'blur(0px)' }
    };

    return (
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 py-12 relative min-h-[85vh]">
            
            {/* --- HEADER HERO --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 animate-fade-in">
                        <span className="w-12 h-px bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></span>
                        <span className="text-xs font-display font-bold text-cyan-400 tracking-[0.4em] uppercase shadow-cyan-500/50">
                            Grimório
                        </span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl animate-fade-in-down">
                        SALÃO DAS<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-white">LENDAS</span>
                    </h2>
                </div>
                
                <div className="flex items-center gap-8 animate-fade-in delay-200">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-5xl font-display font-bold text-white/90 leading-none">{savedCharacters.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-500">Almas Invocadas</span>
                    </div>
                    
                    <button 
                        onClick={() => createCharacter(false)}
                        className="relative group w-20 h-20 flex items-center justify-center rounded-full bg-void-950 border border-white/10 overflow-hidden shadow-2xl hover:shadow-glow-cyan transition-all duration-500 active:scale-95"
                        title="Nova Lenda"
                    >
                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Plus size={32} className="text-mystic-400 group-hover:text-cyan-300 group-hover:rotate-90 transition-all duration-500" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* --- BENTO GRID --- */}
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-32"
            >
                {/* 1. CREATE NEW CARD (Ghost Wireframe Style) */}
                <motion.div variants={itemVariants} className="h-[420px]">
                    <div 
                        onClick={() => createCharacter(false)} 
                        className="h-full rounded-[2rem] border border-dashed border-white/10 hover:border-cyan-500/50 bg-void-900/10 hover:bg-void-900/30 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center gap-6 relative overflow-hidden backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-glass">
                            <Sparkles size={32} className="text-mystic-600 group-hover:text-cyan-400 transition-colors" strokeWidth={1} />
                        </div>
                        <div className="text-center z-10">
                            <span className="block font-display font-bold text-white text-xl tracking-wider mb-2 group-hover:text-cyan-200 transition-colors">Nova Lenda</span>
                            <span className="text-[10px] font-mono text-mystic-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Invocar</span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. CHARACTER CARDS */}
                <AnimatePresence>
                    {savedCharacters.map(char => {
                        const raceImg = RACE_IMAGES[char.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
                        
                        return (
                            <motion.div 
                                key={char.id} 
                                variants={itemVariants} 
                                layoutId={char.id}
                                className="h-[420px]"
                            >
                                <GlassCard 
                                    onClick={() => onSelect(char)} 
                                    bgImage={raceImg}
                                    className="h-full group"
                                >
                                    {/* --- TOP: Meta Info --- */}
                                    <div className="flex justify-between items-start w-full">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-void-950/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-sm">
                                                <Crown size={10} className="text-gold-500" /> Nv. {char.level}
                                            </span>
                                            {char.isNPC && (
                                                <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest text-rose-300 shadow-sm">
                                                    NPC
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* --- MIDDLE: Identity --- */}
                                    <div className="mt-auto mb-6 transform transition-all duration-500 group-hover:-translate-y-2">
                                        <h3 className="font-display font-black text-3xl text-white mb-2 leading-[0.9] tracking-tight drop-shadow-lg group-hover:text-cyan-50 transition-colors line-clamp-2">
                                            {char.name}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="h-px w-6 bg-gold-500/50"></span>
                                            <p className="text-xs text-gold-100 font-bold uppercase tracking-[0.2em] opacity-80">
                                                {char.race} {char.class}
                                            </p>
                                        </div>
                                    </div>

                                    {/* --- BOTTOM: Quick Stats (Glass Pills) --- */}
                                    <div className="grid grid-cols-2 gap-2 transform transition-all duration-500 group-hover:-translate-y-2">
                                        <div className="flex items-center justify-between px-4 py-2.5 bg-void-950/40 backdrop-blur-md rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 text-mystic-400">
                                                <Shield size={14} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">CA</span>
                                            </div>
                                            <span className="font-mono text-sm font-bold text-white">{char.ac}</span>
                                        </div>
                                        <div className="flex items-center justify-between px-4 py-2.5 bg-void-950/40 backdrop-blur-md rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 text-mystic-400">
                                                <Swords size={14} />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">PV</span>
                                            </div>
                                            <span className="font-mono text-sm font-bold text-white">{char.hp}</span>
                                        </div>
                                    </div>

                                    {/* --- HOVER: Action Bar (Slide Up) --- */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-center z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-void-950 via-void-950/90 to-transparent">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onPrint(char); }} 
                                                className="p-3 rounded-xl bg-white/5 hover:bg-white text-mystic-400 hover:text-void-950 transition-colors backdrop-blur-md border border-white/10" 
                                                title="Imprimir"
                                            >
                                                <Printer size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onExport(char); }} 
                                                className="p-3 rounded-xl bg-white/5 hover:bg-gold-500 text-mystic-400 hover:text-white transition-colors backdrop-blur-md border border-white/10" 
                                                title="Baixar JSON"
                                            >
                                                <Download size={16} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} 
                                            className="p-3 rounded-xl bg-white/5 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors backdrop-blur-md border border-rose-500/20" 
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {savedCharacters.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
                    <Ghost size={64} className="text-mystic-600 mb-4 animate-float" />
                    <p className="font-display text-mystic-500 text-xl tracking-widest uppercase">O Grimório está vazio</p>
                </div>
            )}
        </div>
    );
};