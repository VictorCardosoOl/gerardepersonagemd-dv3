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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AC Card */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Classe de Armadura</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.ac} 
                            onChange={(e) => onChange('ac', parseInt(e.target.value))} 
                            className="w-20 text-4xl font-serif font-black text-stone-800 bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                        />
                    ) : (
                        <span className="text-5xl font-serif font-black text-stone-800">{character.ac}</span>
                    )}
                </div>
                <Shield className="text-emerald-500 relative z-10" size={32} strokeWidth={1.5} />
            </div>

            {/* HP Card */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Pontos de Vida</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.hp} 
                            onChange={(e) => onChange('hp', parseInt(e.target.value))} 
                            className="w-20 text-4xl font-serif font-black text-stone-800 bg-transparent border-b-2 border-rose-500 focus:outline-none"
                        />
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-black text-stone-800">{character.hp}</span>
                            <span className="text-sm font-bold text-stone-400">/ {character.maxHp}</span>
                        </div>
                    )}
                </div>
                <Heart className="text-rose-400 relative z-10" size={32} strokeWidth={1.5} />
            </div>

            {/* Initiative Card */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest block mb-1">Iniciativa</span>
                    <span className="text-5xl font-serif font-black text-stone-800">
                        {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                    </span>
                </div>
                <Zap className="text-amber-400 relative z-10" size={32} strokeWidth={1.5} />
            </div>
        </div>
    );
};