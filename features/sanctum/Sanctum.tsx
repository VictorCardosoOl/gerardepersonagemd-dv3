import React from 'react';
import { Plus, Upload, Trash2, Download, Wand2, Printer, User, Swords, Shield } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { Character } from '../../types';

interface Props {
    onSelect: (char: Character) => void;
    onPrint: (char: Character) => void; 
    onExport: (char: Character) => void;
}

export const Sanctum: React.FC<Props> = ({ onSelect, onPrint, onExport }) => {
    const { savedCharacters, createCharacter, deleteCharacter, importCharacter } = useCharacter();
    const { scrollY } = useScroll();
    const yTitle = useTransform(scrollY, [0, 500], [0, 100]);
    const opacityTitle = useTransform(scrollY, [0, 200], [0.05, 0]);

    const handleImportClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) importCharacter(file);
        };
        input.click();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.05,
                delayChildren: 0.1
            } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: 'spring', stiffness: 70, damping: 20 } 
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-8 py-8 relative min-h-screen">
            {/* Background Atmosphere (Scaled Down) */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -z-10 h-[600px]">
                <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <motion.span 
                    style={{ y: yTitle, opacity: opacityTitle }} 
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10rem] md:text-[14rem] font-display font-black text-white select-none whitespace-nowrap tracking-tighter"
                >
                    SANCTUM
                </motion.span>
            </div>

            {/* Header (More Compact) */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-2 tracking-tight drop-shadow-lg">
                        Salão das <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Lendas</span>
                    </h2>
                    <p className="text-mystic-400 font-body font-light text-base max-w-xl leading-relaxed">
                        Gerencie seus heróis, invoque novas almas e prepare-se para a aventura.
                    </p>
                </div>
                <div className="flex gap-4 items-end">
                    <div className="hidden md:block text-right">
                        <span className="block text-4xl font-display font-bold text-white">{savedCharacters.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Heróis Salvos</span>
                    </div>
                </div>
            </div>

            {/* BENTO GRID LAYOUT (Refined Dimensions) */}
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 pb-20"
            >
                {/* 1. Primary Action: CREATE NEW (Scaled Down) */}
                <motion.button 
                    variants={itemVariants} 
                    onClick={() => createCharacter(false)} 
                    className="col-span-1 md:col-span-2 row-span-2 group relative rounded-[2rem] bg-gradient-to-br from-void-900/80 to-void-950/80 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-6 min-h-[300px] shadow-lg hover:shadow-glow-cyan"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Floating Icon */}
                    <div className="relative w-20 h-20 rounded-full bg-void-950 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                        <Wand2 size={32} className="text-mystic-400 group-hover:text-cyan-400 transition-colors" />
                        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
                    </div>

                    <div className="text-center relative z-10 px-6">
                        <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">Invocar Novo Herói</h3>
                        <p className="text-mystic-400 text-sm leading-relaxed max-w-xs mx-auto font-light">
                            Forje uma nova alma a partir do éter. Atributos, história e destino aguardam.
                        </p>
                    </div>

                    <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                        <Plus size={12} /> Clique para Iniciar
                    </div>
                </motion.button>

                {/* 2. Secondary Action: IMPORT (Compact) */}
                <motion.button 
                    variants={itemVariants} 
                    onClick={handleImportClick}
                    className="col-span-1 md:col-span-1 row-span-1 group relative rounded-[2rem] bg-void-900/40 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[140px]"
                >
                    <Upload size={24} className="text-mystic-500 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-mystic-400 group-hover:text-white">Importar JSON</span>
                </motion.button>

                {/* 3. Character Cards (Reduced Height) */}
                {savedCharacters.map(char => {
                    const raceImg = RACE_IMAGES[char.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop';
                    
                    return (
                        <motion.div 
                            key={char.id} 
                            variants={itemVariants} 
                            onClick={() => onSelect(char)} 
                            className="col-span-1 md:col-span-1 row-span-1 group relative h-[280px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500 bg-void-950"
                            tabIndex={0}
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-70" style={{ backgroundImage: `url(${raceImg})` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/90 to-transparent"></div>
                            
                            {/* Content Container */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Top Badges */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="w-fit px-2 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm">
                                            Nv. {char.level}
                                        </span>
                                        {char.isNPC && (
                                            <span className="w-fit px-2 py-1 rounded-md bg-rose-500/20 backdrop-blur-md border border-rose-500/20 text-[9px] font-bold uppercase tracking-widest text-rose-400 shadow-sm">
                                                NPC
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-void-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-500">
                                        <User size={14} className="text-white" />
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-display font-bold text-2xl text-white mb-1 truncate drop-shadow-md group-hover:text-cyan-200 transition-colors">
                                        {char.name}
                                    </h3>
                                    <p className="text-[10px] text-mystic-300 font-medium uppercase tracking-[0.15em] mb-3 border-l-2 border-white/20 pl-2">
                                        {char.race} • {char.class}
                                    </p>

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 bg-void-950/60 p-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                                            <Shield size={12} className="text-cyan-400" />
                                            <span className="font-mono text-xs text-white">{char.ac} <span className="text-[8px] text-slate-500 ml-0.5">CA</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-void-950/60 p-1.5 rounded-lg border border-white/5 backdrop-blur-sm">
                                            <Swords size={12} className="text-rose-400" />
                                            <span className="font-mono text-xs text-white">{char.hp} <span className="text-[8px] text-slate-500 ml-0.5">PV</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay (Compact Slide Up) */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-void-950/95 backdrop-blur-xl border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-20">
                                <span className="text-[9px] font-bold text-mystic-500 uppercase tracking-widest">Opções</span>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); onPrint(char); }} className="p-2 hover:bg-white/10 rounded-full text-mystic-400 hover:text-white transition-colors" title="Imprimir"><Printer size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onExport(char); }} className="p-2 hover:bg-white/10 rounded-full text-mystic-400 hover:text-gold-400 transition-colors" title="Exportar"><Download size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="p-2 hover:bg-rose-500/20 rounded-full text-mystic-400 hover:text-rose-500 transition-colors" title="Excluir"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};