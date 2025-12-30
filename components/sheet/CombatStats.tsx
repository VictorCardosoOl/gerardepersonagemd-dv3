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
        <div className="flex flex-col gap-4">
            
            {/* HP Row */}
            <div className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                        <Heart size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-mystic-400">Vida</span>
                </div>
                
                <div className="flex items-baseline gap-2">
                    {isEditing ? (
                        <input type="number" value={character.hp} onChange={(e) => onChange('hp', parseInt(e.target.value))} className="w-16 bg-transparent text-right text-2xl font-mono text-white border-b border-white/20 focus:outline-none" />
                    ) : (
                        <span className="text-2xl font-mono text-white font-bold">{character.hp}</span>
                    )}
                    <span className="text-[10px] text-white/30 font-mono">/ {character.maxHp}</span>
                </div>
            </div>

            {/* AC Row */}
            <div className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <Shield size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-mystic-400">Armadura</span>
                </div>
                
                {isEditing ? (
                    <input type="number" value={character.ac} onChange={(e) => onChange('ac', parseInt(e.target.value))} className="w-16 bg-transparent text-right text-2xl font-mono text-white border-b border-white/20 focus:outline-none" />
                ) : (
                    <span className="text-2xl font-mono text-white font-bold">{character.ac}</span>
                )}
            </div>

            {/* Initiative Row */}
            <div className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold-500/10 rounded-lg text-gold-400 group-hover:text-gold-300 transition-colors">
                        <Zap size={18} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-mystic-400">Iniciativa</span>
                </div>
                
                {isEditing ? (
                    <input type="number" value={character.initiative} onChange={(e) => onChange('initiative', parseInt(e.target.value))} className="w-16 bg-transparent text-right text-2xl font-mono text-white border-b border-white/20 focus:outline-none" />
                ) : (
                    <span className="text-2xl font-mono text-white font-bold">{character.initiative >= 0 ? `+${character.initiative}` : character.initiative}</span>
                )}
            </div>
        </div>
    );
};