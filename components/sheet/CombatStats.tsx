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
        <div className="flex flex-col gap-4 h-full">
            
            {/* HP Row */}
            <div className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Vitalidade</span>
                     <Heart size={14} className="text-accent-rose opacity-50" />
                </div>
                
                <div className="flex items-baseline justify-between">
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.hp} 
                            onChange={(e) => onChange('hp', parseInt(e.target.value))} 
                            className="w-full bg-transparent border-b border-white/20 text-3xl font-body font-light text-white focus:outline-none focus:border-accent-rose text-left" 
                        />
                    ) : (
                        <span className="text-4xl font-body font-light text-white tracking-tighter">{character.hp}</span>
                    )}
                    <span className="text-xs text-white/20 font-mono self-end mb-1">/ {character.maxHp}</span>
                </div>
            </div>

            {/* AC Row */}
            <div className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                 <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Defesa</span>
                     <Shield size={14} className="text-cyan-400 opacity-50" />
                </div>
                
                <div className="flex items-baseline justify-between">
                     {isEditing ? (
                        <input 
                            type="number" 
                            value={character.ac} 
                            onChange={(e) => onChange('ac', parseInt(e.target.value))} 
                            className="w-full bg-transparent border-b border-white/20 text-3xl font-body font-light text-white focus:outline-none focus:border-cyan-400 text-left" 
                        />
                    ) : (
                        <span className="text-4xl font-body font-light text-white tracking-tighter">{character.ac}</span>
                    )}
                </div>
            </div>

            {/* Initiative Row */}
            <div className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                 <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500">Reflexo</span>
                     <Zap size={14} className="text-gold-500 opacity-50" />
                </div>
                
                 <div className="flex items-baseline justify-between">
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.initiative} 
                            onChange={(e) => onChange('initiative', parseInt(e.target.value))} 
                            className="w-full bg-transparent border-b border-white/20 text-3xl font-body font-light text-white focus:outline-none focus:border-gold-500 text-left" 
                        />
                    ) : (
                        <span className="text-4xl font-body font-light text-white tracking-tighter">{character.initiative >= 0 ? `+${character.initiative}` : character.initiative}</span>
                    )}
                 </div>
            </div>
        </div>
    );
};