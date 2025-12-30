import React from 'react';
import { Character } from '../../types';
import { Sparkles, Crown } from 'lucide-react';
import { CLASSES, RACES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: Character[keyof Character]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="w-full relative">
            <div className="flex flex-col items-center text-center relative z-10">
                
                {/* Meta Info */}
                <div className="flex items-center gap-3 mb-4 opacity-70">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
                        Nível {character.level}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                        {character.isNPC ? 'NPC' : 'Jogador'}
                    </span>
                </div>

                {isEditing ? (
                    <div className="space-y-4 w-full max-w-md">
                        <input 
                            type="text" 
                            value={character.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="w-full text-center text-4xl font-display bg-transparent border-b border-white/10 text-white focus:outline-none focus:border-cyan-500 placeholder-white/10 py-2"
                            placeholder="Nome..."
                        />
                        <div className="flex gap-2">
                            <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-1/2 bg-void-900 border border-white/10 rounded-lg p-2 text-xs text-white uppercase font-bold tracking-wider text-center">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                            <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-1/2 bg-void-900 border border-white/10 rounded-lg p-2 text-xs text-white uppercase font-bold tracking-wider text-center">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-mystic-100 to-mystic-900 tracking-tight leading-none mb-4 drop-shadow-2xl">
                            {character.name}
                        </h1>
                        
                        <div className="flex items-center gap-6 mt-2">
                             <div className="flex items-center gap-2 text-mystic-300">
                                <Crown size={14} className="text-gold-500" />
                                <span className="font-display font-bold text-lg">{character.race}</span>
                             </div>
                             <div className="w-px h-4 bg-white/10"></div>
                             <div className="flex items-center gap-2 text-mystic-300">
                                <Sparkles size={14} className="text-cyan-500" />
                                <span className="font-display font-bold text-lg">{character.class}</span>
                             </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};