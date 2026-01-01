
import React from 'react';
import { Character } from '../../types';
import { Crown, Swords, Scroll } from 'lucide-react';
import { RACE_IMAGES } from '../../constants';
import { RulesRepository } from '../../services/RulesRepository';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    // Optimized image URL
    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
    
    // Data from Repository
    const races = RulesRepository.getRaces();
    const classes = RulesRepository.getClasses();

    return (
        <div className="w-full relative group rounded-[2.5rem] overflow-hidden bg-void-950 border border-white/10 shadow-2xl transition-all duration-700 hover:shadow-glow-cyan/20">
             <style>{`
                @keyframes glitch-skew { 0% { transform: skew(0deg); } 20% { transform: skew(-2deg); } 40% { transform: skew(2deg); } 60% { transform: skew(-1deg); } 80% { transform: skew(1deg); } 100% { transform: skew(0deg); } }
                .glitch-text:hover { animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite; color: white; }
            `}</style>
            
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105" style={{ backgroundImage: `url(${bgImage})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/80 to-void-950/40 opacity-95"></div>
            <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 px-6 py-12 md:py-20 flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-void-950/50 border border-white/10 backdrop-blur-md">
                        <Crown size={12} className="text-gold-500" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-gold-100">Nível {character.level}</span>
                    </div>
                    {character.isNPC && (
                        <div className="px-3 py-1.5 rounded-full bg-accent-rose/10 border border-accent-rose/20 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-rose">NPC</span>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="w-full max-w-2xl bg-void-950/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl animate-scale-in">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-mystic-500 mb-2 font-bold">Nome do Personagem</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="ghost-input w-full text-center text-3xl md:text-4xl font-display font-bold text-white border-b-2 border-white/20 p-4 rounded-t-lg transition-all placeholder-white/10 focus:border-cyan-500 focus:bg-void-900/50"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Scroll size={12}/> Raça</label>
                                    <div className="relative">
                                        <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-full appearance-none bg-void-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all hover:bg-void-800">
                                            {races.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-gold-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Swords size={12}/> Classe</label>
                                    <div className="relative">
                                        <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-full appearance-none bg-void-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all hover:bg-void-800">
                                            {classes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 animate-fade-in-up">
                            <h1 className="glitch-text text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-default" data-text={character.name}>{character.name}</h1>
                        </div>
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
