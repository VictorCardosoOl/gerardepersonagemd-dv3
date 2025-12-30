import React from 'react';
import { Character } from '../../types';
import { Shield, Sparkles, Ghost, Eye } from 'lucide-react';
import { CLASSES, RACES } from '../../constants';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="w-full mb-6 relative">
            {/* Background Accent */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-200 pb-6">
                <div className="w-full md:w-auto">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                value={character.name}
                                onChange={(e) => onChange('name', e.target.value)}
                                className="w-full text-4xl font-serif bg-transparent border-b border-emerald-500/50 text-stone-800 focus:outline-none placeholder-stone-400"
                                placeholder="Nome do Personagem"
                            />
                            <div className="flex gap-2">
                                <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="glass-input rounded px-2 py-1 text-sm">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                                <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="glass-input rounded px-2 py-1 text-sm">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                                    {character.name}
                                </h1>
                                {character.isNPC && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-600" title="NPC (Personagem Não Jogável)">
                                        <Ghost size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">NPC</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-emerald-800 text-lg font-light">
                                <span className="flex items-center gap-1 font-medium">{character.race}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                <span className="flex items-center gap-1 font-medium">{character.class}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                <span className="text-stone-600">Nível {character.level}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                    <div className="glass-panel p-3 rounded-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase text-stone-500 font-bold">Proficiência</span>
                        <span className="text-xl font-mono text-emerald-600">+{character.proficiencyBonus}</span>
                    </div>
                    <div className="glass-panel p-3 rounded-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase text-stone-500 font-bold">Perc. Passiva</span>
                        <div className="flex items-center gap-1 text-xl font-mono text-stone-800">
                            <Eye size={16} className="text-emerald-500" />
                            {character.passivePerception}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-header details */}
            <div className="flex gap-6 mt-4 text-sm text-stone-500">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-600"/> 
                    <span>{character.alignment}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-600"/> 
                    <span>{character.background}</span>
                </div>
            </div>
        </div>
    );
};