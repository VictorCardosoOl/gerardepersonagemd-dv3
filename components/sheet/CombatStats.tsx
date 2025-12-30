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
        <div className="grid grid-cols-3 gap-8">
            {/* AC */}
            <div className="relative group">
                <div className="absolute inset-0 bg-stone-100 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
                <div className="relative bg-white border border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm group-hover:-translate-y-1 transition-transform">
                    <Shield className="text-emerald-100 absolute top-2 right-2" size={48} />
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-2 z-10">Classe de Armadura</span>
                    {isEditing ? (
                        <input type="number" value={character.ac} onChange={(e) => onChange('ac', parseInt(e.target.value))} className="w-16 text-center text-4xl font-serif font-black text-stone-800 border-b-2 border-emerald-500 focus:outline-none bg-transparent z-10"/>
                    ) : (
                        <span className="text-5xl font-serif font-black text-stone-800 z-10">{character.ac}</span>
                    )}
                </div>
            </div>

            {/* HP */}
            <div className="relative group">
                <div className="absolute inset-0 bg-stone-100 rounded-2xl transform -rotate-2 group-hover:-rotate-4 transition-transform"></div>
                <div className="relative bg-white border border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm group-hover:-translate-y-1 transition-transform">
                    <Heart className="text-rose-100 absolute top-2 right-2" size={48} />
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-2 z-10">Pontos de Vida</span>
                    {isEditing ? (
                        <input type="number" value={character.hp} onChange={(e) => onChange('hp', parseInt(e.target.value))} className="w-20 text-center text-4xl font-serif font-black text-rose-700 border-b-2 border-rose-500 focus:outline-none bg-transparent z-10"/>
                    ) : (
                        <div className="flex items-baseline gap-1 z-10">
                            <span className="text-5xl font-serif font-black text-rose-700">{character.hp}</span>
                            <span className="text-sm text-stone-400 font-bold">/ {character.maxHp}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Initiative */}
            <div className="relative group">
                <div className="absolute inset-0 bg-stone-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative bg-white border border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm group-hover:-translate-y-1 transition-transform">
                    <Zap className="text-amber-100 absolute top-2 right-2" size={48} />
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-2 z-10">Iniciativa</span>
                    <span className="text-5xl font-serif font-black text-stone-800 z-10">
                        {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                    </span>
                </div>
            </div>
        </div>
    );
};