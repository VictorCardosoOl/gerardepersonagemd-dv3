import React from 'react';
import { Character } from '../../types';
import { Crown, Swords, Scroll } from 'lucide-react';
import { CLASSES, RACES, RACE_IMAGES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    // Fallback image logic
    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="w-full relative group rounded-[2.5rem] overflow-hidden bg-void-950 border border-white/10 shadow-2xl transition-all duration-700 hover:shadow-glow-cyan/20">
            
            {/* Embedded Styles for Glitch Effect to keep component self-contained */}
            <style>{`
                @keyframes glitch-skew {
                    0% { transform: skew(0deg); }
                    20% { transform: skew(-2deg); }
                    40% { transform: skew(2deg); }
                    60% { transform: skew(-1deg); }
                    80% { transform: skew(1deg); }
                    100% { transform: skew(0deg); }
                }
                @keyframes glitch-anim-1 {
                    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
                    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
                    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
                    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
                    80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
                    100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
                    20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
                    40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
                    60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, -2px); }
                    80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 2px); }
                    100% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 1px); }
                }
                .glitch-text {
                    position: relative;
                    display: inline-block;
                }
                .glitch-text:hover {
                    animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
                    color: white;
                }
                .glitch-text:hover::before,
                .glitch-text:hover::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.8;
                }
                /* Cyan Channel */
                .glitch-text:hover::before {
                    color: #22d3ee; 
                    z-index: -1;
                    animation: glitch-anim-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
                }
                /* Rose/Magenta Channel */
                .glitch-text:hover::after {
                    color: #e11d48;
                    z-index: -2;
                    animation: glitch-anim-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
                }
            `}</style>

            {/* --- Background Layers --- */}
            {/* 1. Image with Parallax Scale Effect */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            
            {/* 2. Dark Gradient Overlay (Crucial for Text Visibility) */}
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/80 to-void-950/40 opacity-95"></div>
            
            {/* 3. Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            {/* --- Content --- */}
            <div className="relative z-10 px-6 py-12 md:py-20 flex flex-col items-center text-center">
                
                {/* Badges / Top Meta */}
                <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-void-950/50 border border-white/10 backdrop-blur-md">
                        <Crown size={12} className="text-gold-500" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-gold-100">
                            Nível {character.level}
                        </span>
                    </div>
                    {character.isNPC && (
                        <div className="px-3 py-1.5 rounded-full bg-accent-rose/10 border border-accent-rose/20 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-rose">NPC</span>
                        </div>
                    )}
                </div>

                {/* Main Identity Area */}
                {isEditing ? (
                    <div className="w-full max-w-2xl bg-void-950/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-scale-in">
                        <div className="flex flex-col gap-6">
                            {/* Name Edit */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-mystic-500 mb-2 font-bold">Nome do Personagem</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="w-full text-center text-3xl md:text-4xl font-display font-bold bg-void-900/50 border-b-2 border-white/20 text-white focus:outline-none focus:border-cyan-500 focus:bg-void-900 p-4 rounded-t-lg transition-all placeholder-white/10"
                                    placeholder="Nome da Lenda..."
                                />
                            </div>

                            {/* Race & Class Edit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest mb-2 flex items-center gap-2">
                                        <Scroll size={12}/> Raça
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={character.race} 
                                            onChange={(e) => onChange('race', e.target.value)} 
                                            className="w-full appearance-none bg-void-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all hover:bg-void-800"
                                        >
                                            {RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
                                    </div>
                                </div>

                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-gold-400 font-bold tracking-widest mb-2 flex items-center gap-2">
                                        <Swords size={12}/> Classe
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={character.class} 
                                            onChange={(e) => onChange('class', e.target.value)} 
                                            className="w-full appearance-none bg-void-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all hover:bg-void-800"
                                        >
                                            {CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Name Display - High Contrast with GLITCH EFFECT */}
                        <div className="mb-8 animate-fade-in-up">
                            <h1 
                                className="glitch-text text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-default"
                                data-text={character.name}
                            >
                                {character.name}
                            </h1>
                        </div>
                        
                        {/* Race & Class Display */}
                        <div className="flex items-center gap-4 md:gap-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                             <div className="flex flex-col items-center gap-1 group/race cursor-default">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-mystic-500 group-hover:text-cyan-400 transition-colors">Linhagem</span>
                                <span className="font-display font-bold text-xl md:text-3xl text-mystic-100 group-hover:text-white transition-colors border-b border-transparent group-hover:border-cyan-500/50 pb-1">{character.race}</span>
                             </div>
                             
                             <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                             
                             <div className="flex flex-col items-center gap-1 group/class cursor-default">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-mystic-500 group-hover:text-gold-400 transition-colors">Vocação</span>
                                <span className="font-display font-bold text-xl md:text-3xl text-mystic-100 group-hover:text-white transition-colors border-b border-transparent group-hover:border-gold-500/50 pb-1">{character.class}</span>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};