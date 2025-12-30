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
        <div className="grid grid-cols-3 gap-6">
            {/* AC */}
            <div className="clean-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-stone-100 opacity-50 group-hover:text-emerald-50 transition-colors">
                    <Shield size={100} />
                </div>
                <span className="text-[10px] uppercase text-stone-500 font-bold tracking-widest mb-2">Armadura</span>
                {isEditing ? (
                    <input type="number" value={character.ac} onChange={(e) => onChange('ac', parseInt(e.target.value))} className="w-20 bg-transparent border-b-2 border-emerald-500 text-center text-4xl font-serif font-bold text-stone-800 focus:outline-none"/>
                ) : (
                    <span className="text-5xl font-serif font-bold text-stone-800 relative z-10">{character.ac}</span>
                )}
            </div>

            {/* HP */}
            <div className="clean-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-stone-100 opacity-50 group-hover:text-rose-50 transition-colors">
                    <Heart size={100} />
                </div>
                <span className="text-[10px] uppercase text-stone-500 font-bold tracking-widest mb-2">Vida (HP)</span>
                {isEditing ? (
                    <input type="number" value={character.hp} onChange={(e) => onChange('hp', parseInt(e.target.value))} className="w-20 bg-transparent border-b-2 border-rose-500 text-center text-4xl font-serif font-bold text-stone-800 focus:outline-none"/>
                ) : (
                    <div className="flex items-baseline gap-2 relative z-10">
                        <span className="text-5xl font-serif font-bold text-stone-800">{character.hp}</span>
                        <span className="text-lg text-stone-400 font-mono">/ {character.maxHp}</span>
                    </div>
                )}
            </div>

            {/* Initiative */}
            <div className="clean-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-stone-100 opacity-50 group-hover:text-amber-50 transition-colors">
                    <Zap size={100} />
                </div>
                <span className="text-[10px] uppercase text-stone-500 font-bold tracking-widest mb-2">Iniciativa</span>
                <span className="text-5xl font-serif font-bold text-stone-800 relative z-10">
                    {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                </span>
            </div>
        </div>
    );
};