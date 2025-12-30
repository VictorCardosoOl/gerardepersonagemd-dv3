import React from 'react';
import { Character } from '../../types';
import { Shield, Sparkles, Ghost, Eye, Crown, Star } from 'lucide-react';
import { CLASSES, RACES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: Character[keyof Character]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="w-full relative group">
            {/* Header Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 px-4 md:px-0">
                
                {/* Main Identity Info */}
                <div className="flex-grow w-full md:w-auto space-y-2">
                    {isEditing ? (
                        <div className="space-y-6 max-w-lg glass-panel p-6 rounded-2xl border-white/10 bg-void-900/80 backdrop-blur-xl">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-accent-cyan tracking-widest mb-2 block">Nome da Lenda</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="w-full text-3xl font-display bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-accent-cyan placeholder-white/10 py-2 transition-colors"
                                    placeholder="Digite o nome..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-mystic-500 tracking-widest mb-1 block">Raça</label>
                                    <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-full bg-void-950 border border-white/10 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-accent-cyan outline-none custom-select">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-mystic-500 tracking-widest mb-1 block">Classe</label>
                                    <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-full bg-void-950 border border-white/10 rounded-lg p-2 text-sm text-white focus:ring-1 focus:ring-accent-cyan outline-none custom-select">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold/80 flex items-center gap-2">
                                    <span className="w-8 h-px bg-accent-gold/50"></span> Nível {character.level}
                                </span>
                                {character.isNPC && (
                                    <span className="bg-white/5 text-mystic-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border border-white/5">
                                        NPC
                                    </span>
                                )}
                            </div>

                            <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-mystic-100 to-mystic-400 tracking-tight leading-[0.9] drop-shadow-2xl">
                                {character.name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm flex items-center gap-2">
                                    <span className="text-accent-cyan font-display font-bold text-lg">{character.race}</span>
                                    <span className="text-white/20">|</span>
                                    <span className="text-accent-cyan font-display font-bold text-lg">{character.class}</span>
                                </div>

                                <div className="flex gap-2">
                                    <div className="px-3 py-2 rounded-lg border border-white/5 bg-transparent text-xs font-bold text-mystic-400 uppercase tracking-wider flex items-center gap-2">
                                        <Crown size={12} className="text-mystic-600"/> 
                                        {character.alignment}
                                    </div>
                                    <div className="px-3 py-2 rounded-lg border border-white/5 bg-transparent text-xs font-bold text-mystic-400 uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles size={12} className="text-mystic-600"/> 
                                        {character.background}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Secondary Stats (Proficiency & Passive Perc) */}
                <div className="flex gap-4">
                    <div className="group/stat bg-void-900/60 border border-white/5 p-4 rounded-2xl flex flex-col items-center min-w-[100px] backdrop-blur-md hover:border-accent-gold/30 hover:bg-white/5 transition-all duration-300">
                        <span className="text-[9px] uppercase text-mystic-500 font-bold tracking-widest mb-1 group-hover/stat:text-accent-gold transition-colors">Proficiência</span>
                        <div className="flex items-center gap-2">
                            <Star size={14} className="text-accent-gold fill-accent-gold/20" />
                            <span className="text-3xl font-display font-bold text-white text-shadow-glow-gold">+{character.proficiencyBonus}</span>
                        </div>
                    </div>
                    <div className="group/stat bg-void-900/60 border border-white/5 p-4 rounded-2xl flex flex-col items-center min-w-[100px] backdrop-blur-md hover:border-accent-cyan/30 hover:bg-white/5 transition-all duration-300">
                        <span className="text-[9px] uppercase text-mystic-500 font-bold tracking-widest mb-1 group-hover/stat:text-accent-cyan transition-colors">Percepção</span>
                        <div className="flex items-center gap-2">
                            <Eye size={16} className="text-accent-cyan" />
                            <span className="text-3xl font-display font-bold text-white text-shadow-glow-cyan">{character.passivePerception}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};