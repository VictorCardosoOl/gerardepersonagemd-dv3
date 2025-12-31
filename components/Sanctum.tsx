import React from 'react';
import { Character } from '../types';
import { Plus, Upload, Trash2, Download, Wand2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
    savedCharacters: Character[];
    onSelect: (char: Character) => void;
    onCreate: () => void;
    onImport: () => void;
    onDelete: (id: string) => void;
    onExport: (char: Character) => void;
}

export const Sanctum: React.FC<Props> = ({ savedCharacters, onSelect, onCreate, onImport, onDelete, onExport }) => {
    
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
                    <p className="text-mystic-400 font-serif italic text-lg">Seu salão de lendas e heróis caídos.</p>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={onImport}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-mystic-300 font-bold uppercase text-xs tracking-widest transition-all cursor-pointer"
                    >
                        <Upload size={14} /> Importar
                    </button>
                    <button 
                        onClick={onCreate}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-void-950 hover:bg-accent-cyan font-bold uppercase text-xs tracking-widest shadow-neon-cyan transition-all cursor-pointer"
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
                    className="group relative h-64 rounded-3xl border border-white/10 hover:border-accent-cyan/50 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden text-left"
                    aria-label="Criar Novo Personagem"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="w-16 h-16 rounded-full bg-void-900 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 group-hover:border-accent-cyan shadow-lg relative z-10">
                        <Wand2 size={24} className="text-mystic-500 group-hover:text-accent-cyan" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-mystic-500 group-hover:text-white relative z-10">Forjar Lenda</span>
                </motion.button>

                {/* Character Cards with Spotlight */}
                {savedCharacters.map(char => (
                    <motion.div 
                        key={char.id}
                        variants={item}
                        onClick={() => onSelect(char)}
                        onKeyDown={(e) => handleKeyDown(e, () => onSelect(char))}
                        onMouseMove={handleMouseMove}
                        role="button"
                        tabIndex={0}
                        className="group relative h-64 glass-panel rounded-3xl p-6 cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden flex flex-col justify-between spotlight-card focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        {/* Background Gradient based on Class */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full group-hover:bg-accent-cyan/20 transition-all"></div>

                        {/* Top: Header */}
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-mystic-400">
                                    Nv. {char.level}
                                </span>
                                {char.isNPC && (
                                    <span className="px-2 py-1 rounded bg-void-950 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-mystic-600">
                                        NPC
                                    </span>
                                )}
                            </div>
                            <h3 className="font-display font-bold text-2xl text-white leading-tight mb-1 group-hover:text-accent-cyan transition-colors truncate">
                                {char.name}
                            </h3>
                            <p className="text-xs text-mystic-400 font-mono uppercase tracking-wider">
                                {char.race} {char.class}
                            </p>
                        </div>

                        {/* Middle: Mini Stats */}
                        <div className="grid grid-cols-2 gap-2 relative z-10 my-4">
                            <div className="bg-void-950/50 rounded-lg p-2 text-center border border-white/5">
                                <span className="block text-[9px] text-slate-500 uppercase font-bold">HP</span>
                                <span className="font-mono font-bold text-white text-lg">{char.hp}</span>
                            </div>
                            <div className="bg-void-950/50 rounded-lg p-2 text-center border border-white/5">
                                <span className="block text-[9px] text-slate-500 uppercase font-bold">CA</span>
                                <span className="font-mono font-bold text-white text-lg">{char.ac}</span>
                            </div>
                        </div>

                        {/* Bottom: Actions (Visible on Hover or Focus) */}
                        <div className="relative z-10 flex justify-end gap-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 group-focus:translate-y-0">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onExport(char); }}
                                className="p-2 rounded-full bg-void-950 text-mystic-400 hover:text-white hover:bg-accent-gold/20 transition-colors z-20 cursor-pointer"
                                title="Exportar"
                            >
                                <Download size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                className="p-2 rounded-full bg-void-950 text-mystic-400 hover:text-accent-rose hover:bg-accent-rose/20 transition-colors z-20 cursor-pointer"
                                title="Deletar"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {savedCharacters.length === 0 && (
                <div className="mt-12 text-center text-mystic-600 font-serif italic text-lg opacity-50 relative z-10">
                    O silêncio reina no Sanctum. Invoque seu primeiro herói.
                </div>
            )}
        </div>
    );
};