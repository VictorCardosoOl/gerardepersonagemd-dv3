import React, { useRef, useState } from 'react';
import { Plus, Printer, Swords, Shield, Download, Trash2, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { RACE_IMAGES } from '../../constants';
import { useCharacter } from '../../context/CharacterContext';
import { Character } from '../../types';

interface Props {
    onSelect: (char: Character) => void;
    onPrint: (char: Character) => void; 
    onExport: (char: Character) => void;
}

// --- SUB-COMPONENT: 3D TILT CARD ---
const TiltCard: React.FC<{ 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
    bgImage?: string;
}> = ({ children, onClick, className = "", bgImage }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate rotation (Max 3 degrees for subtle effect)
        const rotateY = ((mouseX - width / 2) / width) * 6; 
        const rotateX = ((mouseY - height / 2) / height) * -6;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div 
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-transform ease-out duration-200 cursor-pointer group rounded-[2.5rem] ${className}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`,
                transition: isHovering ? 'none' : 'transform 0.5s ease-out' 
            }}
        >
            {/* Background Image Layer (Parallax-like) */}
            {bgImage && (
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none transform-gpu">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out grayscale-[0.3] group-hover:grayscale-0"
                        style={{ 
                            backgroundImage: `url(${bgImage})`,
                            transform: isHovering ? 'scale(1.1)' : 'scale(1.0)' 
                        }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-transparent opacity-90" />
                </div>
            )}
            
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 group-hover:border-cyan-500/30 transition-colors z-20 pointer-events-none"></div>
            
            {/* Content Layer */}
            <div className="relative z-10 h-full">
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
            transition: { staggerChildren: 0.1 } 
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)' }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 py-16 relative min-h-[80vh]">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 relative z-10">
                <div className="flex flex-col">
                    <span className="text-sm font-display font-bold text-cyan-400 tracking-[0.5em] uppercase mb-2 pl-1 animate-fade-in">
                        Salão das
                    </span>
                    <h2 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-mystic-100 to-mystic-900 leading-[0.8] tracking-tighter drop-shadow-2xl animate-fade-in-down">
                        LENDAS
                    </h2>
                </div>
                
                <div className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="text-right hidden md:block">
                        <span className="block text-4xl font-display font-bold text-white leading-none">{savedCharacters.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-500">Heróis Invocados</span>
                    </div>
                    <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                    <button 
                        onClick={() => createCharacter(false)}
                        className="group flex items-center justify-center w-16 h-16 rounded-full bg-void-900 border border-white/10 hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 shadow-lg hover:shadow-glow-cyan active:scale-95"
                        title="Invocar Novo Herói"
                    >
                        <Plus size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* --- GRID --- */}
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10 pb-32"
            >
                {/* 1. Create Card (Minimalist) */}
                <motion.div variants={itemVariants} className="h-[450px]">
                    <div 
                        onClick={() => createCharacter(false)} 
                        className="h-full rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-cyan-500/40 bg-void-900/20 hover:bg-void-900/40 transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-void-950 border border-white/5 group-hover:border-cyan-500/50 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <Plus size={32} className="text-mystic-600 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div className="text-center">
                            <span className="block font-display font-bold text-white text-lg tracking-wider mb-1 group-hover:text-cyan-200 transition-colors">Nova Lenda</span>
                            <span className="text-xs text-mystic-500 uppercase tracking-widest">Criar Ficha</span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Character Cards */}
                {savedCharacters.map(char => {
                    const raceImg = RACE_IMAGES[char.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
                    
                    return (
                        <motion.div key={char.id} variants={itemVariants} className="h-[450px]">
                            <TiltCard 
                                onClick={() => onSelect(char)} 
                                bgImage={raceImg}
                                className="h-full shadow-2xl"
                            >
                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 rounded-lg bg-void-950/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                                    Nv. {char.level}
                                                </span>
                                                {char.isNPC && (
                                                    <span className="px-2 py-1 rounded-lg bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-[10px] font-bold uppercase tracking-widest text-rose-300">
                                                        NPC
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <h3 className="font-display font-black text-3xl md:text-4xl text-white mb-2 leading-none line-clamp-2 drop-shadow-lg">
                                            {char.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="w-8 h-px bg-cyan-500/50"></span>
                                            <p className="text-xs text-cyan-100 font-bold uppercase tracking-widest">
                                                {char.race} {char.class}
                                            </p>
                                        </div>

                                        {/* Mini Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10">
                                                <div className="flex items-center gap-2 text-mystic-400">
                                                    <Shield size={14} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">Defesa</span>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-white">{char.ac}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10">
                                                <div className="flex items-center gap-2 text-mystic-400">
                                                    <Swords size={14} />
                                                    <span className="text-[9px] font-bold uppercase tracking-wider">Vida</span>
                                                </div>
                                                <span className="font-mono text-sm font-bold text-white">{char.hp}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-center z-30 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); onPrint(char); }} className="p-3 rounded-xl bg-void-950/80 hover:bg-white text-mystic-400 hover:text-void-950 transition-colors backdrop-blur-md border border-white/10" title="Imprimir">
                                            <Printer size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onExport(char); }} className="p-3 rounded-xl bg-void-950/80 hover:bg-gold-500 text-mystic-400 hover:text-white transition-colors backdrop-blur-md border border-white/10" title="Baixar JSON">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }} className="p-3 rounded-xl bg-void-950/80 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors backdrop-blur-md border border-rose-500/20" title="Excluir">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </TiltCard>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};