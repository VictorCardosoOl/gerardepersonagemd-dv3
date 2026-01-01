import React from 'react';
import { Character } from '../../types';
import { Shield, Heart, Zap } from 'lucide-react';
import { NumberControl } from '../../components/NumberControl';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

export const CombatStats: React.FC<Props> = ({ character, isEditing, onChange }) => {
    return (
        <div className="flex flex-col gap-4 h-full">
            
            {/* HP Row */}
            <div className="flex flex-col p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500 group-hover:text-accent-rose transition-colors">Vitalidade</span>
                     <Heart size={16} className="text-accent-rose opacity-50" />
                </div>
                
                <div className="flex items-end justify-between relative z-10">
                    {isEditing ? (
                        <NumberControl 
                            value={character.hp} 
                            onChange={(v) => onChange('hp', v)} 
                            max={character.maxHp + 20} // Allow temp HP buffer
                            large
                            className="w-full justify-between px-4 bg-void-950/80"
                        />
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-5xl font-body font-light text-white tracking-tighter leading-none">{character.hp}</span>
                        </div>
                    )}
                    
                    {!isEditing && (
                        <span className="text-xs text-white/30 font-mono mb-1.5">/ {character.maxHp} MAX</span>
                    )}
                </div>
                
                {/* Health Bar Background */}
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-accent-rose/50 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (character.hp / character.maxHp) * 100)}%` }}
                ></div>
            </div>

            {/* AC & Init Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* AC */}
                <div className="flex flex-col p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Defesa</span>
                        <Shield size={14} className="text-cyan-400 opacity-50" />
                    </div>
                    
                    {isEditing ? (
                         <NumberControl value={character.ac} onChange={(v) => onChange('ac', v)} className="w-full justify-center" />
                    ) : (
                        <span className="text-4xl font-body font-light text-white tracking-tighter text-center">{character.ac}</span>
                    )}
                </div>

                {/* Initiative */}
                <div className="flex flex-col p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Reflexo</span>
                        <Zap size={14} className="text-gold-500 opacity-50" />
                    </div>
                    
                    {isEditing ? (
                        <NumberControl value={character.initiative} onChange={(v) => onChange('initiative', v)} min={-5} max={20} className="w-full justify-center" />
                    ) : (
                        <span className="text-4xl font-body font-light text-white tracking-tighter text-center">
                            {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};