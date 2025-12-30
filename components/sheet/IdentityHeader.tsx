import React from 'react';
import { Character } from '../../types';
import { Shield, Sparkles } from 'lucide-react';
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
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                <div className="w-full md:w-auto">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                value={character.name}
                                onChange={(e) => onChange('name', e.target.value)}
                                className="w-full text-4xl font-serif bg-transparent border-b border-indigo-500/50 text-white focus:outline-none placeholder-slate-600"
                                placeholder="Nome do Personagem"
                            />
                            <div className="flex gap-2">
                                <select value={character.race} onChange={(e) => onChange('race', e.target.value)} className="glass-input rounded px-2 py-1 text-sm">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                                <select value={character.class} onChange={(e) => onChange('class', e.target.value)} className="glass-input rounded px-2 py-1 text-sm">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                                    {character.name}
                                </h1>
                                {character.isNPC && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-900/50 text-rose-300 border border-rose-500/20">NPC</span>}
                            </div>
                            <div className="flex items-center gap-3 text-indigo-200 text-lg font-light">
                                <span className="flex items-center gap-1">{character.race}</span>
                                <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                                <span className="flex items-center gap-1">{character.class}</span>
                                <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                                <span className="text-white font-medium">Nível {character.level}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                    <div className="glass-panel p-3 rounded-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Proficiência</span>
                        <span className="text-xl font-mono text-cyan-400">+{character.proficiencyBonus}</span>
                    </div>
                    <div className="glass-panel p-3 rounded-lg flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Perc. Passiva</span>
                        <div className="flex items-center gap-1 text-xl font-mono text-white">
                            <EyeSize14 className="text-indigo-400" />
                            {character.passivePerception}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-header details */}
            <div className="flex gap-6 mt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-indigo-400"/> 
                    <span>{character.alignment}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-400"/> 
                    <span>{character.background}</span>
                </div>
            </div>
        </div>
    );
};

// Helper Icon since lucide imports are tricky in XML sometimes
const EyeSize14 = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
