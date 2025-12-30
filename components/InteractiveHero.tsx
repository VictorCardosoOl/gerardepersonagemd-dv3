import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Hexagon } from 'lucide-react';

export const InteractiveHero: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on center (max +/- 15 deg)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = -((y - centerY) / centerY) * 10;

        setRotation({ x: rotateX, y: rotateY });
        setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div className="relative perspective-1000 w-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
            <div 
                ref={cardRef}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer transition-transform duration-200 ease-out preserve-3d group"
                style={{ 
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Floating Effect Wrapper */}
                <div className="animate-float">
                    
                    {/* The Artifact Card */}
                    <div className="relative w-full aspect-[4/5] rounded-[2rem] bg-void-950 border border-mystic-700/30 overflow-hidden shadow-2xl">
                        
                        {/* Dynamic Glow Background */}
                        <div 
                            className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                            style={{
                                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(139, 92, 246, 0.4), transparent 70%)`
                            }}
                        />

                        {/* Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-10 mix-blend-overlay"></div>

                        {/* Content Layer (Lifted in 3D) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transform translate-z-10" style={{ transform: 'translateZ(40px)' }}>
                            
                            {/* Central Rune */}
                            <div className="relative mb-8 group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute inset-0 bg-accent-cyan blur-[40px] opacity-20 animate-pulse-slow"></div>
                                <Hexagon size={80} strokeWidth={1} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={30} className="text-accent-gold animate-spin-slow" />
                                </div>
                            </div>

                            <h3 className="font-display font-bold text-2xl text-white tracking-widest text-center mb-2 drop-shadow-md">
                                INVOCAR
                            </h3>
                            <p className="font-serif text-mystic-200 italic text-center text-lg leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                "O destino aguarda o rolar dos dados."
                            </p>
                        </div>

                        {/* Border Shine */}
                        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>
                    </div>

                    {/* Shadow Layer (Stays on ground) */}
                    <div className="absolute -bottom-10 left-10 right-10 h-8 bg-black/40 blur-xl rounded-[100%] transform scale-x-75 translate-z-n10 transition-all duration-300 group-hover:scale-x-90 group-hover:bg-mystic-900/40"></div>
                </div>
            </div>
        </div>
    );
};