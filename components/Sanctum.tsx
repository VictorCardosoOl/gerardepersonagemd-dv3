import React from 'react';
import { Character } from '../types';
import { Plus, Upload, Trash2, Download, Wand2, Printer } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RACE_IMAGES } from '../constants';

interface Props {
    savedCharacters: Character[];
    onSelect: (char: Character) => void;
    onCreate: () => void;
    onImport: () => void;
    onDelete: (id: string) => void;
    onExport: (char: Character) => void;
    onPrint: (char: Character) => void;
}

export const Sanctum: React.FC<Props> = ({ savedCharacters, onSelect, onCreate, onImport, onDelete, onExport, onPrint }) => {
    
    // Parallax logic
    const { scrollY } = useScroll();
    const yTitle = useTransform(scrollY, [0, 500], [0, 150]);

    // Stagger Container variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 relative">
            
            {/* Mega Background Title (Parallax) */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -z-10 h-[500px]">
                <motion.span 
                    style={{ y: yTitle }}
                    className="absolute -top-20 -left-20 text-[12rem] md:text-[18rem] font-display font-black text-white/5 select-none blur-sm whitespace-nowrap"
                >
                    SANCTUM
                </motion.span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
                <div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-2 tracking-tight drop-shadow-lg">Sanctum</h2>
                    <p className="text-mystic-400 font-body font-light text-lg opacity-80">Seu salão de lendas e heróis caídos.</p>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={onImport}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-mystic-300 font-display font-bold uppercase text-xs tracking-widest transition-all cursor-pointer"
                    >
                        <Upload size={14} /> Importar
                    </button>
                    <button 
                        onClick={onCreate}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-void-950 hover:bg-accent-cyan font-display font-bold uppercase text-xs tracking-widest shadow-neon-cyan transition-all cursor-pointer"
                    >
                        <Plus size={14} /> Invocar Novo
                    </button>
                </div>
            </div>

            {/* Masonry Grid */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
            >
                
                {/* Create New Card (Visual CTA) */}
                <motion.button 
                    variants={item}
                    onClick={onCreate}
                    className="group relative h-72 rounded-3xl border border-white/10 hover:border-accent-cyan/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden text-left"
                    aria-label="Criar Novo Personagem"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="w-16 h-16 rounded-full bg-void-900 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 group-hover:border-accent-cyan shadow-lg relative z-10">
                        <Wand2 size={24} className="text-mystic-500 group-hover:text-accent-cyan" />
                    </div>
                    <span className="text-sm font-display font-bold uppercase tracking-widest text-mystic-500 group-hover:text-white relative z-10">Forjar Lenda</span>
                </motion.button>

                {/* Character Cards with Spotlight */}
                {savedCharacters.map(char => {
                    // Fallback for image
                    const raceImg = RACE_IMAGES[char.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop';
                    
                    return (
                    <motion.div 
                        key={char.id}
                        variants={item}
                        onClick={() => onSelect(char)}
                        onKeyDown={(e) => handleKeyDown(e, () => onSelect(char))}
                        onMouseMove={handleMouseMove}
                        role="button"
                        tabIndex={0}
                        className="group relative h-72 glass-panel rounded-3xl p-6 cursor-pointer hover:-translate-y-2 transition-transform duration-500 overflow-hidden flex flex-col justify-between spotlight-card focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        {/* 1. Background Image (The fix for missing image) */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 group-hover:opacity-60 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            style={{ backgroundImage: `url(${raceImg})` }}
                        ></div>

                        {/* 2. Dark Overlays for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/80 to-void-950/40 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-void-950/20 group-hover:bg-transparent transition-colors duration-500"></div>

                        {/* Top: Header */}
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-display font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                                    Nv. {char.level}
                                </span>
                                {char.isNPC && (
                                    <span className="px-2 py-1 rounded bg-accent-rose/20 border border-accent-rose/20 text-[10px] font-display font-bold uppercase tracking-widest text-accent-rose backdrop-blur-sm">
                                        NPC
                                    </span>
                                )}
                            </div>
                            <h3 className="font-display font-bold text-2xl text-white leading-tight mb-1 group-hover:text-accent-cyan transition-colors truncate drop-shadow-md tracking-tight">
                                {char.name}
                            </h3>
                            <p className="text-xs text-mystic-300 font-body uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
                                {char.race} {char.class}
                            </p>
                        </div>

                        {/* Middle: Mini Stats */}
                        <div className="grid grid-cols-2 gap-2 relative z-10 my-4 opacity-70 group-hover:opacity-100 transition-opacity">
                            <div className="bg-void-950/60 rounded-lg p-2 text-center border border-white/5 backdrop-blur-sm">
                                <span className="block text-[9px] text-mystic-400 font-display font-bold uppercase tracking-wider">HP</span>
                                <span className="font-mono font-bold text-white text-lg">{char.hp}</span>
                            </div>
                            <div className="bg-void-950/60 rounded-lg p-2 text-center border border-white/5 backdrop-blur-sm">
                                <span className="block text-[9px] text-mystic-400 font-display font-bold uppercase tracking-wider">CA</span>
                                <span className="font-mono font-bold text-white text-lg">{char.ac}</span>
                            </div>
                        </div>

                        {/* Bottom: Actions (Visible on Hover or Focus) */}
                        <div className="relative z-10 flex justify-end gap-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                             <button 
                                onClick={(e) => { e.stopPropagation(); onPrint(char); }}
                                className="p-2 rounded-full bg-void-950 text-mystic-400 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer border border-white/10 hover:border-white/50"
                                title="Imprimir / PDF"
                            >
                                <Printer size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onExport(char); }}
                                className="p-2 rounded-full bg-void-950 text-mystic-400 hover:text-white hover:bg-accent-gold/20 transition-colors z-20 cursor-pointer border border-white/10 hover:border-accent-gold/50"
                                title="Exportar JSON"
                            >
                                <Download size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                className="p-2 rounded-full bg-void-950 text-mystic-400 hover:text-accent-rose hover:bg-accent-rose/20 transition-colors z-20 cursor-pointer border border-white/10 hover:border-accent-rose/50"
                                title="Deletar"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </motion.div>
                )})}
            </motion.div>

            {savedCharacters.length === 0 && (
                <div className="mt-12 text-center text-mystic-600 font-body font-light text-lg opacity-50 relative z-10">
                    O silêncio reina no Sanctum. Invoque seu primeiro herói.
                </div>
            )}
        </div>
    );
};