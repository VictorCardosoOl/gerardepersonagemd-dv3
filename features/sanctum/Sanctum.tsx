
import React, { useRef, useState, useCallback } from 'react';
import { Plus, Printer, Swords, Shield, Download, Trash2, Crown, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { Character } from '../../types';

interface Props {
    onSelect: (char: Character) => void;
    onPrint: (char: Character) => void; 
    onExport: (char: Character) => void;
}

const SanctumCard: React.FC<{ 
    character: Character; 
    onSelect: () => void;
    onPrint: (e: React.MouseEvent) => void;
    onExport: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}> = ({ character, onSelect, onPrint, onExport, onDelete }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(0, { stiffness: 100, damping: 30 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = ((relativeY - centerY) / centerY) * -3; 
        const rotateYValue = ((relativeX - centerX) / centerX) * 3;
        x.set(relativeX);
        y.set(relativeY);
        mouseX.set(rotateXValue);
        mouseY.set(rotateYValue);
    }, [x, y, mouseX, mouseY]);

    const handleMouseLeave = () => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    const transformStyle = useMotionTemplate`perspective(1200px) rotateX(${mouseX}deg) rotateY(${mouseY}deg) scale3d(1, 1, 1)`;
    const glowBackground = useMotionTemplate`radial-gradient(350px circle at ${x}px ${y}px, rgba(34, 211, 238, 0.1), transparent 80%)`;
    const borderGlow = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.4), transparent 100%)`;
    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';

    return (
        <motion.div
            ref={ref}
            onClick={onSelect}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle }}
            className="relative h-[460px] w-full cursor-pointer group rounded-[2rem] transition-all duration-500 will-change-transform"
        >
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-void-900 border border-white/5 shadow-glass-sm group-hover:shadow-glass transition-shadow duration-500">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out will-change-transform"
                    style={{ 
                        backgroundImage: `url(${bgImage})`,
                        transform: isHovering ? 'scale(1.08)' : 'scale(1.0)',
                        filter: isHovering ? 'brightness(0.5) saturate(1.1)' : 'brightness(0.35) grayscale(0.4)'
                    }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/60 to-transparent opacity-95" />
                <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen"
                    style={{ background: glowBackground }}
                />
                <div className="relative h-full flex flex-col justify-between p-8 z-10">
                    <div className="flex justify-between items-start opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-300 border border-white/10 px-3 py-1 rounded-full bg-void-950/40 backdrop-blur-md shadow-sm">
                            Nv. {character.level}
                        </span>
                        {character.isNPC && (
                            <div className="bg-accent-rose/10 p-1.5 rounded-full border border-accent-rose/20">
                                <Crown size={12} className="text-accent-rose drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                            </div>
                        )}
                    </div>
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-4 will-change-transform">
                        <div className="flex items-center gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 transform translate-y-2 group-hover:translate-y-0">
                            <span className="h-px w-8 bg-gradient-to-r from-gold-500 to-transparent"></span>
                            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.25em]">
                                {character.class}
                            </span>
                        </div>
                        <h3 className="font-display font-black text-4xl text-white leading-[0.9] tracking-tight drop-shadow-xl group-hover:text-cyan-50 transition-colors">
                            {character.name}
                        </h3>
                        <p className="text-xs text-mystic-400 font-medium tracking-widest mt-2 uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                            {character.race}
                        </p>
                    </div>
                    <div className="relative">
                         <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 flex items-center gap-1.5">
                                    <Shield size={10} className="text-cyan-400/70" /> CA
                                </span>
                                <span className="font-mono text-xl text-mystic-200">{character.ac}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 flex items-center gap-1.5 justify-end">
                                    PV <Swords size={10} className="text-accent-rose/70" />
                                </span>
                                <span className="font-mono text-xl text-mystic-200">{character.hp}</span>
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-between items-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                            <div className="flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); onPrint(e as any); }} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-mystic-300 hover:text-white transition-all backdrop-blur-md hover:scale-105 active:scale-95" title="Imprimir">
                                    <Printer size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onExport(e as any); }} className="p-3 rounded-xl bg-white/5 hover:bg-gold-500/10 border border-white/5 text-mystic-300 hover:text-gold-400 transition-all backdrop-blur-md hover:scale-105 active:scale-95" title="Exportar">
                                    <Download size={16} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-cyan-300 transition-colors">Invocar</span>
                                <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(e as any); }} className="absolute -right-2 -bottom-16 opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-500 delay-100 p-3 rounded-full text-rose-900 hover:text-rose-500 hover:bg-rose-500/10" title="Excluir">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <motion.div 
                className="absolute inset-0 rounded-[2rem] border border-transparent pointer-events-none z-20"
                style={{ 
                    maskImage: borderGlow,
                    WebkitMaskImage: borderGlow,
                    borderColor: 'rgba(255, 255, 255, 0.5)' 
                }}
            />
            <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none z-20 transition-colors duration-500 group-hover:border-white/10"></div>
        </motion.div>
    );
};

const CreateCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        mouseX.set(((e.clientY - rect.top - centerY) / centerY) * -2);
        mouseY.set(((e.clientX - rect.left - centerX) / centerX) * 2);
    };

    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };
    
    const transformStyle = useMotionTemplate`perspective(1000px) rotateX(${mouseX}deg) rotateY(${mouseY}deg)`;
    const borderGlow = useMotionTemplate`radial-gradient(300px circle at ${x}px ${y}px, rgba(34, 211, 238, 0.3), transparent 80%)`;

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle }}
            className="h-[460px] w-full cursor-pointer group relative rounded-[2rem] will-change-transform"
        >
            <motion.div 
                className="absolute inset-0 rounded-[2rem] border border-transparent pointer-events-none z-20"
                style={{ maskImage: borderGlow, WebkitMaskImage: borderGlow, borderColor: 'rgba(34, 211, 238, 0.4)' }}
            />
            <div className="absolute inset-0 rounded-[2rem] bg-void-900 border border-dashed border-white/10 group-hover:border-cyan-500/20 group-hover:bg-void-800 transition-all duration-300 flex flex-col items-center justify-center gap-8 overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="relative w-20 h-20 rounded-full border border-white/10 bg-white/[0.01] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/20 shadow-inner">
                        <Plus size={32} className="text-mystic-600 group-hover:text-cyan-300 transition-colors" strokeWidth={1} />
                    </div>
                </div>
                <div className="text-center z-10 space-y-2">
                    <h3 className="font-display font-bold text-xl text-white tracking-widest group-hover:text-cyan-100 transition-colors">Nova Lenda</h3>
                    <p className="text-[10px] font-mono text-mystic-500 uppercase tracking-[0.3em] group-hover:text-cyan-400/70 transition-colors">
                        Invocar Herói
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export const Sanctum: React.FC<Props> = ({ onSelect, onPrint, onExport }) => {
    const { savedCharacters, createCharacter, deleteCharacter } = useCharacter();

    return (
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 py-16 relative min-h-[85vh]">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 relative z-10 animate-fade-in-down">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                        <span className="text-xs font-display font-bold text-cyan-400 tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                            Grimório Digital
                        </span>
                    </div>
                    <h2 className="text-6xl md:text-9xl font-display font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl py-2">
                        SALÃO DAS<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-mystic-200 to-mystic-500 opacity-90 pr-2">LENDAS</span>
                    </h2>
                </div>
                <div className="flex flex-col items-end gap-1 text-right border-r border-white/10 pr-6">
                    <span className="text-7xl font-display font-thin text-white/10">{String(savedCharacters.length).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-mystic-600">Almas<br/>Registradas</span>
                </div>
            </div>
            <motion.div 
                initial="hidden" 
                animate="show" 
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 pb-32"
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                    <CreateCard onClick={() => createCharacter(false)} />
                </motion.div>
                <AnimatePresence mode='popLayout'>
                    {savedCharacters.map(char => (
                        <motion.div 
                            key={char.id} 
                            layoutId={char.id}
                            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
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
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20 top-32">
                    <Sparkles size={120} className="text-mystic-600 mb-8 animate-float" strokeWidth={0.5} />
                    <p className="font-display text-mystic-500 text-3xl tracking-[0.5em] uppercase border-t border-white/10 pt-6">O Vazio Aguarda</p>
                </div>
            )}
        </div>
    );
};
