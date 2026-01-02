
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
    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
    const races = RulesRepository.getRaces();
    const classes = RulesRepository.getClasses();

    return (
        <div className="w-full relative group rounded-[2.5rem] overflow-hidden bg-void-900 border border-white/5 shadow-2xl hover:shadow-glow-cyan/10 transition-all duration-1000">
             <style>{`
                @keyframes glitch-skew { 0% { transform: skew(0deg); } 20% { transform: skew(-0.5deg); } 40% { transform: skew(0.5deg); } 60% { transform: skew(-0.2deg); } 80% { transform: skew(0.2deg); } 100% { transform: skew(0deg); } }
                .glitch-text { position: relative; display: inline-block; }
                .glitch-text:hover { animation: glitch-skew 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite; color: #fff; }
                .glitch-text:hover::before, .glitch-text:hover::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8; }
                .glitch-text:hover::before { color: #22d3ee; z-index: -1; transform: translate(-2px, 0); opacity: 0.5; }
                .glitch-text:hover::after { color: #e11d48; z-index: -2; transform: translate(2px, 0); opacity: 0.5; }
            `}</style>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-50" style={{ backgroundImage: `url(${bgImage})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/90 to-void-950/30"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 px-6 py-16 md:py-24 flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-10 animate-fade-in-down">
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-void-950/60 border border-white/5 backdrop-blur-md shadow-lg">
                        <Crown size={12} className="text-gold-500" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-widest text-gold-100">Nível {character.level}</span>
                    </div>
                    {character.isNPC && (
                        <div className="px-3 py-2 rounded-full bg-accent-rose/10 border border-accent-rose/20 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-rose">NPC</span>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="w-full max-w-2xl bg-void-900/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl animate-scale-in">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-widest text-mystic-500 font-bold text-center">Nome da Lenda</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="w-full text-center text-4xl md:text-5xl font-display font-black text-white tracking-tight p-2 placeholder-white/10 bg-transparent border-b border-white/10 focus:border-cyan-500 transition-colors"
                                    placeholder="Nome..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Scroll size={12}/> Raça</label>
                                    <div className="relative">
                                        <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-full appearance-none bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-cyan-500 focus:bg-void-900 transition-all cursor-pointer">
                                            {races.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-gold-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Swords size={12}/> Classe</label>
                                    <div className="relative">
                                        <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-full appearance-none bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-gold-500 focus:bg-void-900 transition-all cursor-pointer">
                                            {classes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-10 animate-fade-in-up">
                            <h1 className="glitch-text text-6xl md:text-9xl font-display font-black text-white tracking-tighter leading-[0.85] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-default select-none" data-text={character.name}>
                                {character.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-8 md:gap-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                             <div className="flex flex-col items-center gap-2 group/race cursor-default">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 group-hover:text-cyan-400 transition-colors">Linhagem</span>
                                <span className="font-display font-bold text-xl md:text-2xl text-mystic-200 tracking-wide group-hover:text-white transition-colors">{character.race}</span>
                             </div>
                             <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                             <div className="flex flex-col items-center gap-2 group/class cursor-default">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-mystic-500 group-hover:text-gold-400 transition-colors">Vocação</span>
                                <span className="font-display font-bold text-xl md:text-2xl text-mystic-200 tracking-wide group-hover:text-white transition-colors">{character.class}</span>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
