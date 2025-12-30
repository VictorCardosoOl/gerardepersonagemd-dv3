import React from 'react';
import { Character } from '../../types';
import { Shield, Heart, Zap } from 'lucide-react';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const CombatStats: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {/* AC */}
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield size={64} />
                </div>
                <span className="text-xs uppercase text-slate-400 font-bold mb-1">Classe de Armadura</span>
                {isEditing ? (
                    <input type="number" value={character.ac} onChange={(e) => onChange('ac', parseInt(e.target.value))} className="w-16 bg-transparent border-b border-white/20 text-center text-3xl font-mono font-bold text-white focus:outline-none"/>
                ) : (
                    <span className="text-3xl font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">{character.ac}</span>
                )}
            </div>

            {/* HP */}
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">
                    <Heart size={64} />
                </div>
                <span className="text-xs uppercase text-slate-400 font-bold mb-1">Pontos de Vida</span>
                {isEditing ? (
                    <input type="number" value={character.hp} onChange={(e) => onChange('hp', parseInt(e.target.value))} className="w-16 bg-transparent border-b border-white/20 text-center text-3xl font-mono font-bold text-white focus:outline-none"/>
                ) : (
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-mono font-bold text-white">{character.hp}</span>
                        <span className="text-sm text-slate-500">/ {character.maxHp}</span>
                    </div>
                )}
            </div>

            {/* Initiative */}
            <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity text-yellow-500">
                    <Zap size={64} />
                </div>
                <span className="text-xs uppercase text-slate-400 font-bold mb-1">Iniciativa</span>
                <span className="text-3xl font-mono font-bold text-white">
                    {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                </span>
            </div>
        </div>
    );
};