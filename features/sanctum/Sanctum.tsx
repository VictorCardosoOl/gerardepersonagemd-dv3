
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
    const yTitle = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityTitle = useTransform(scrollY, [0, 300], [0.05, 0]);

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
                staggerChildren: 0.1,
                delayChildren: 0.2
            } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            transition: { type: 'spring', stiffness: 50, damping: 20 } 
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-12 relative min-h-screen">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none -z-10 h-[600px]">
                <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <motion.span 
                    style={{ y: yTitle, opacity: opacityTitle }} 
                    className="absolute -top-10 left-1/2 -translate-x-1/2 text-[12rem] md:text-[20rem] font-display font-black text-white select-none whitespace-nowrap tracking-tighter"
                >
                    SANCTUM
                </motion.span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-2 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Salão das <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Lendas</span>
                    </h2>
                    <p className="text-mystic-400 font-body font-light text-lg max-w-lg">
                        Gerencie seus heróis, invoque novas almas e prepare-se para a aventura.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:block text-right">
                        <span className="block text-4xl font-display font-bold text-white">{savedCharacters.length}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-mystic-500">Heróis Salvos</span>
                    </div>
                </div>
            </div>

            {/* BENTO GRID LAYOUT - Improved Responsive Grid using minmax */}
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 relative z-10 pb-20 auto-rows-[320px]"
            >
                {/* 1. Primary Action: CREATE NEW (Big Tile) */}
                <motion.button 
                    variants={itemVariants} 
                    onClick={() => createCharacter(false)} 
                    className="col-span-1 md:col-span-2 row-span-1 md:row-span-1 group relative rounded-[2.5rem] bg-gradient-to-br from-void-900/80 to-void-950/80 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-6 shadow-lg hover:shadow-glow-cyan h-full w-full"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Floating Icon */}
                    <div className="relative w-24 h-24 rounded-full bg-void-950 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                        <Wand2 size={40} className="text-mystic-400 group-hover:text-cyan-400 transition-colors" />
                        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
                    </div>

                    <div className="text-center relative z-10 px-6">
                        <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">Invocar Novo Herói</h3>
                        <p className="text-mystic-400 text-sm leading-relaxed max-w-xs mx-auto">
                            Forje uma nova alma a partir do éter. Atributos, história e destino aguardam.
                        </p>
                    </div>

                    <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                        <Plus size={12} /> Clique para Iniciar
                    </div>
                </motion.button>

                {/* 2. Secondary Action: IMPORT (Small Tile) */}
                <motion.button 
                    variants={itemVariants} 
                    onClick={handleImportClick}
                    className="col-span-1 row-span-1 group relative rounded-[2rem] bg-void-900/40 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-3 h-full w-full"
                >
                    <Upload size={24} className="text-mystic-500 group-hover:text-white transition-colors" />
                    <span className="text-xs font-display font-bold uppercase tracking-widest text-mystic-400 group-hover:text-white">Importar JSON</span>
                </motion.button>

                {/* 3. Character Cards */}
                {savedCharacters.map(char => {
                    const raceImg = RACE_IMAGES[char.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
                    
                    return (
                        <motion.button 
                            key={char.id} 
                            variants={itemVariants} 
                            onClick={() => onSelect(char)} 
                            className="col-span-1 row-span-1 group relative h-full w-full rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500 bg-void-950 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            tabIndex={0}
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70" style={{ backgroundImage: `url(${raceImg})` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/80 to-transparent"></div>
                            
                            {/* Content Container */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Top Badges */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="w-fit px-2 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                                            Nv. {char.level}
                                        </span>
                                        {char.isNPC && (
                                            <span className="w-fit px-2 py-1 rounded-md bg-rose-500/20 backdrop-blur-md border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                                                NPC
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-void-950/50 backdrop-blur border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                                        <User size={14} className="text-white" />
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div>
                                    <h3 className="font-display font-bold text-2xl text-white mb-1 truncate drop-shadow-md group-hover:text-cyan-200 transition-colors">
                                        {char.name}
                                    </h3>
                                    <p className="text-xs text-mystic-300 font-medium uppercase tracking-wider mb-4 border-l-2 border-white/20 pl-2">
                                        {char.race} • {char.class}
                                    </p>

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-2 bg-void-950/60 p-1.5 rounded-lg border border-white/5">
                                            <Shield size={12} className="text-cyan-400" />
                                            <span className="font-mono text-sm text-white">{char.ac} <span className="text-[9px] text-slate-500">CA</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-void-950/60 p-1.5 rounded-lg border border-white/5">
                                            <Swords size={12} className="text-rose-400" />
                                            <span className="font-mono text-sm text-white">{char.hp} <span className="text-[9px] text-slate-500">PV</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay (Slide Up) */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-void-950/90 backdrop-blur-xl border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-20">
                                <span className="text-[10px] font-bold text-mystic-500 uppercase tracking-widest">Ações</span>
                                <div className="flex gap-2">
                                    <div role="button" onClick={(e) => { e.stopPropagation(); onPrint(char); }} className="p-2 hover:bg-white/10 rounded-full text-mystic-400 hover:text-white transition-colors" title="Imprimir"><Printer size={16} /></div>
                                    <div role="button" onClick={(e) => { e.stopPropagation(); onExport(char); }} className="p-2 hover:bg-white/10 rounded-full text-mystic-400 hover:text-gold-400 transition-colors" title="Exportar"><Download size={16} /></div>
                                    <div role="button" onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="p-2 hover:bg-rose-500/20 rounded-full text-mystic-400 hover:text-rose-500 transition-colors" title="Excluir"><Trash2 size={16} /></div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
};
