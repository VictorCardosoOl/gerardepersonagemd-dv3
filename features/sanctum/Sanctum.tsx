
import React, { useRef, useState, useCallback } from 'react';
import { Plus, Printer, Swords, Shield, Download, Trash2, Crown, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { Character } from '../../types';

interface Props {
    onSelect: (char: Character) => void;
    onPrint: (char: Character) => void; 
    onExport: (char: Character) => void;
}

// Configuração do efeito de Tilt
const TILT_CONFIG = {
    maxRotation: 12, // Graus de inclinação máxima
    spring: { stiffness: 200, damping: 20 }
};

const SanctumCard: React.FC<{ 
    character: Character; 
    onSelect: () => void;
    onPrint: (e: React.MouseEvent) => void;
    onExport: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}> = ({ character, onSelect, onPrint, onExport, onDelete }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Mouse position state relative to card center (0 to 1)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics for smooth tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [TILT_CONFIG.maxRotation, -TILT_CONFIG.maxRotation]), TILT_CONFIG.spring);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-TILT_CONFIG.maxRotation, TILT_CONFIG.maxRotation]), TILT_CONFIG.spring);
    
    // Dynamic shine effect
    const sheenOpacity = useTransform(mouseY, [-0.5, 0.5], [0, 0.4]); 
    const sheenGradient = useMotionTemplate`linear-gradient(${rotateY}deg, transparent, rgba(255, 255, 255, ${sheenOpacity}), transparent)`;

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        // Calculate mouse position relative to card dimensions (normalized -0.5 to 0.5)
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = (e.clientX - rect.left) / width - 0.5;
        const mouseYVal = (e.clientY - rect.top) / height - 0.5;

        mouseX.set(mouseXVal);
        mouseY.set(mouseYVal);
    }, [mouseX, mouseY]);

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';

    return (
        <motion.div
            style={{ 
                perspective: 1200,
                transformStyle: "preserve-3d" 
            }}
            className="h-[520px] w-full"
        >
            <motion.div
                ref={ref}
                onClick={onSelect}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                    rotateX, 
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative w-full h-full cursor-pointer group"
            >
                {/* --- CARD CONTENT CONTAINER --- */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-void-950 border border-white/10 overflow-hidden shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]">
                    
                    {/* Background Image with Parallax Scale */}
                    <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                            style={{ 
                                backgroundImage: `url(${bgImage})`,
                                filter: 'brightness(0.6) saturate(1.1)'
                            }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-transparent opacity-90" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-10 z-20" style={{ transform: "translateZ(20px)" }}>
                        
                        {/* Top Meta */}
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-mystic-300 border border-white/10 px-4 py-1.5 rounded-full bg-void-950/40 backdrop-blur-md shadow-sm">
                                Nv. {character.level}
                            </span>
                            {character.isNPC && (
                                <div className="bg-accent-rose/10 p-2 rounded-full border border-accent-rose/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                                    <Crown size={14} className="text-accent-rose" />
                                </div>
                            )}
                        </div>

                        {/* Character Info */}
                        <div className="transform transition-transform duration-500 group-hover:-translate-y-6">
                            <div className="flex items-center gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="h-px w-8 bg-gold-500"></span>
                                <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.25em]">
                                    {character.class}
                                </span>
                            </div>
                            <h3 className="font-display font-black text-5xl text-white leading-[0.9] tracking-tight drop-shadow-lg group-hover:text-cyan-50 transition-colors">
                                {character.name}
                            </h3>
                            <p className="text-xs text-mystic-400 font-medium tracking-widest mt-3 uppercase opacity-70">
                                {character.race}
                            </p>
                        </div>

                        {/* Bottom Actions & Stats */}
                        <div className="relative">
                             {/* Stats (Hide on Hover) */}
                             <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 flex items-center gap-2">
                                        <Shield size={10} className="text-cyan-400" /> Defesa
                                    </span>
                                    <span className="font-display text-2xl text-white">{character.ac}</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 flex items-center gap-2 justify-end">
                                        Vida <Swords size={10} className="text-accent-rose" />
                                    </span>
                                    <span className="font-display text-2xl text-white">{character.hp}</span>
                                </div>
                            </div>

                            {/* Actions (Show on Hover) */}
                            <div className="absolute inset-x-0 bottom-0 flex justify-between items-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                <div className="flex gap-3">
                                    <button onClick={(e) => { e.stopPropagation(); onPrint(e as any); }} className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-mystic-300 hover:text-white transition-all backdrop-blur-md" title="Imprimir">
                                        <Printer size={18} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onExport(e as any); }} className="p-3.5 rounded-2xl bg-white/10 hover:bg-gold-500/20 border border-white/10 text-mystic-300 hover:text-gold-400 transition-all backdrop-blur-md" title="Exportar">
                                        <Download size={18} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-3 pr-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Abrir</span>
                                    <div className="p-2.5 rounded-full bg-cyan-500 text-void-950 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                        <ArrowUpRight size={18} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <button onClick={(e) => { e.stopPropagation(); onDelete(e as any); }} className="absolute -right-4 -bottom-20 opacity-0 group-hover:opacity-100 group-hover:-bottom-2 transition-all duration-500 delay-200 p-3 rounded-full text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10" title="Excluir">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gloss Reflection Effect */}
                    <motion.div 
                        className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay"
                        style={{ background: sheenGradient }}
                    />
                </div>
                
                {/* Glowing Border effect based on tilt */}
                <motion.div 
                    className="absolute inset-0 rounded-[2.7rem] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: useMotionTemplate`radial-gradient(circle at ${useTransform(mouseX, m => m * 100 + 50)}% ${useTransform(mouseY, m => m * 100 + 50)}%, rgba(34,211,238,0.4), transparent 60%)`,
                        transform: "translateZ(-1px) scale(1.02)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

const CreateCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="h-[520px] w-full cursor-pointer group relative rounded-[2.5rem] bg-void-900/50 border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-void-900 transition-all duration-500 flex flex-col items-center justify-center gap-8 overflow-hidden"
        >
            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
                <div className="relative w-24 h-24 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-cyan-500/50 shadow-2xl">
                    <Plus size={32} className="text-mystic-500 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                </div>
            </div>
            <div className="text-center z-10 space-y-3">
                <h3 className="font-display font-bold text-2xl text-white tracking-widest group-hover:text-cyan-200 transition-colors">Nova Lenda</h3>
                <p className="text-[10px] font-mono text-mystic-500 uppercase tracking-[0.4em] group-hover:text-cyan-500/70 transition-colors">
                    Invocar Herói
                </p>
            </div>
        </motion.div>
    );
};

export const Sanctum: React.FC<Props> = ({ onSelect, onPrint, onExport }) => {
    const { savedCharacters, createCharacter, deleteCharacter } = useCharacter();

    return (
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 py-20 relative min-h-[85vh]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12 relative z-10 animate-fade-in-down">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-16 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                        <span className="text-xs font-display font-bold text-cyan-400 tracking-[0.5em] uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            Grimório Digital
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-display font-black text-white leading-[0.8] tracking-tighter drop-shadow-2xl">
                        SALÃO DAS<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-mystic-200 to-mystic-600 opacity-90">LENDAS</span>
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-2 text-right border-r-2 border-white/5 pr-8 py-2">
                    <span className="text-6xl md:text-8xl font-display font-thin text-white/5 tabular-nums">{String(savedCharacters.length).padStart(2, '0')}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-mystic-600">Almas<br/>Registradas</span>
                </div>
            </div>

            <motion.div 
                initial="hidden" 
                animate="show" 
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-16 pb-32 perspective-1000"
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}>
                    <CreateCard onClick={() => createCharacter(false)} />
                </motion.div>
                
                <AnimatePresence mode='popLayout'>
                    {savedCharacters.map(char => (
                        <motion.div 
                            key={char.id} 
                            layoutId={char.id}
                            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                        >
                            <SanctumCard 
                                character={char}
                                onSelect={() => onSelect(char)}
                                onPrint={(e) => { e.stopPropagation(); onPrint(char); }}
                                onExport={(e) => { e.stopPropagation(); onExport(char); }}
                                onDelete={(e) => { e.stopPropagation(); deleteCharacter(char.id); }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {savedCharacters.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30 top-40">
                    <Sparkles size={180} className="text-mystic-700 mb-12 animate-float" strokeWidth={0.5} />
                    <p className="font-display text-mystic-600 text-4xl tracking-[0.6em] uppercase border-t border-white/5 pt-10">O Vazio Aguarda</p>
                </div>
            )}
        </div>
    );
};
