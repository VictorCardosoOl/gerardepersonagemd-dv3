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
            <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-hover hover:border-emerald-300 transition-all group">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-1">Classe de Armadura</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.ac} 
                            onChange={(e) => onChange('ac', parseInt(e.target.value))} 
                            className="w-20 text-5xl font-serif font-black text-emerald-800 bg-transparent border-b-2 border-emerald-500 focus:outline-none"
                        />
                    ) : (
                        <span className="text-5xl font-serif font-black text-emerald-800">{character.ac}</span>
                    )}
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <Shield size={32} strokeWidth={1.5} />
                </div>
            </div>

            {/* HP Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-hover hover:border-emerald-300 transition-all group">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-1">Pontos de Vida</span>
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.hp} 
                            onChange={(e) => onChange('hp', parseInt(e.target.value))} 
                            className="w-20 text-5xl font-serif font-black text-rose-700 bg-transparent border-b-2 border-rose-500 focus:outline-none"
                        />
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-serif font-black text-stone-800">{character.hp}</span>
                            <span className="text-sm font-bold text-stone-400">/ {character.maxHp}</span>
                        </div>
                    )}
                </div>
                <div className="bg-rose-50 p-4 rounded-xl text-rose-500 group-hover:bg-rose-100 transition-colors">
                    <Heart size={32} strokeWidth={1.5} />
                </div>
            </div>

            {/* Initiative Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-hover hover:border-emerald-300 transition-all group">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-stone-400 font-bold tracking-widest mb-1">Iniciativa</span>
                    <span className="text-5xl font-serif font-black text-stone-800">
                        {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                    </span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl text-amber-500 group-hover:bg-amber-100 transition-colors">
                    <Zap size={32} strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
};