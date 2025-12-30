import React from 'react';
import { Character } from '../../types';
import { Shield, Sparkles, Ghost, Eye, Crown } from 'lucide-react';
import { CLASSES, RACES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="w-full relative">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                
                {/* Main Identity Info */}
                <div className="flex-grow w-full md:w-auto">
                    {isEditing ? (
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="text-xs uppercase font-bold text-stone-400">Nome do Personagem</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="w-full text-3xl font-serif bg-transparent border-b-2 border-emerald-500 text-stone-900 focus:outline-none placeholder-stone-300 py-1"
                                    placeholder="Nome..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-stone-400">Raça</label>
                                    <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded p-2 text-sm">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold text-stone-400">Classe</label>
                                    <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded p-2 text-sm">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-5xl md:text-6xl font-serif font-black text-stone-900 tracking-tight leading-none">
                                    {character.name}
                                </h1>
                                {character.isNPC && (
                                    <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-stone-200 align-top">
                                        NPC
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-lg text-emerald-800 font-serif italic">
                                <span>{character.race}</span>
                                <span className="w-1 h-1 rounded-full bg-emerald-300"></span>
                                <span>{character.class}</span>
                                <span className="w-1 h-1 rounded-full bg-emerald-300"></span>
                                <span className="text-stone-500 not-italic font-sans text-sm font-bold bg-stone-100 px-2 py-0.5 rounded-full">Nível {character.level}</span>
                            </div>

                            <div className="flex gap-4 mt-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Crown size={14} className="text-stone-400"/> 
                                    <span>{character.alignment}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-stone-400"/> 
                                    <span>{character.background}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Secondary Stats */}
                <div className="flex gap-4">
                    <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl flex flex-col items-center min-w-[90px]">
                        <span className="text-[10px] uppercase text-stone-400 font-bold mb-1">Proficiência</span>
                        <span className="text-2xl font-mono font-bold text-emerald-700">+{character.proficiencyBonus}</span>
                    </div>
                    <div className="bg-stone-50 border border-stone-100 p-3 rounded-xl flex flex-col items-center min-w-[90px]">
                        <span className="text-[10px] uppercase text-stone-400 font-bold mb-1">Percepção</span>
                        <div className="flex items-center gap-1.5">
                            <Eye size={16} className="text-stone-400" />
                            <span className="text-2xl font-mono font-bold text-stone-800">{character.passivePerception}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};