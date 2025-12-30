import React from 'react';
import { Character } from '../../types';
import { Sparkles, Crown } from 'lucide-react';
import { CLASSES, RACES, RACE_IMAGES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: Character[keyof Character]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    const bgImage = RACE_IMAGES[character.race] || RACE_IMAGES['Humano'];

    return (
        <div className="w-full relative py-12 px-6 rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
            {/* Dynamic Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-1000 scale-105 group-hover:scale-100 transform"
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-900/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-void-950/90 via-transparent to-void-950/90"></div>
            
            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            <div className="flex flex-col items-center text-center relative z-10">
                
                {/* Meta Info */}
                <div className="flex items-center gap-3 mb-6 opacity-90">
                    <div className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-gold-400 shadow-glow-gold">
                        Nível {character.level}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 shadow-glow-cyan">
                        {character.isNPC ? 'NPC' : 'Jogador'}
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-6 w-full max-w-lg bg-void-950/80 p-8 rounded-2xl backdrop-blur-xl border border-white/10">
                        <input 
                            type="text" 
                            value={character.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="w-full text-center text-3xl font-display bg-transparent border-b border-white/10 text-white focus:outline-none focus:border-cyan-500 placeholder-white/10 py-2 transition-colors"
                            placeholder="Nome da Lenda..."
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col text-left gap-1">
                                <label className="text-[10px] uppercase text-mystic-500 font-bold tracking-widest">Raça</label>
                                <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-full bg-void-900 border border-white/10 rounded-lg p-3 text-xs text-white font-bold tracking-wider outline-none focus:border-cyan-500">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                            </div>
                            <div className="flex flex-col text-left gap-1">
                                <label className="text-[10px] uppercase text-mystic-500 font-bold tracking-widest">Classe</label>
                                <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-full bg-void-900 border border-white/10 rounded-lg p-3 text-xs text-white font-bold tracking-wider outline-none focus:border-cyan-500">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-7xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-mystic-100 to-mystic-900 tracking-tight leading-none mb-6 drop-shadow-2xl">
                            {character.name}
                        </h1>
                        
                        <div className="flex items-center gap-8 mt-2">
                             <div className="flex items-center gap-3 text-mystic-200 group/race">
                                <Crown size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                                <span className="font-display font-bold text-xl tracking-wide">{character.race}</span>
                             </div>
                             <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                             <div className="flex items-center gap-3 text-mystic-200 group/class">
                                <Sparkles size={18} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
                                <span className="font-display font-bold text-xl tracking-wide">{character.class}</span>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};