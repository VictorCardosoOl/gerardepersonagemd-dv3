
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
    // Calculate HP percentage for visual bar
    const hpPercent = Math.min(100, (character.hp / character.maxHp) * 100);
    const hpColor = hpPercent < 30 ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : hpPercent < 60 ? 'bg-gold-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]';

    return (
        <div className="flex flex-col gap-5 h-full">
            
            {/* HP Row - Featured */}
            <div className="flex flex-col p-6 rounded-[2rem] border border-white/5 bg-void-950/20 hover:bg-void-950/40 transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 relative z-10">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500 group-hover:text-white transition-colors">Vitalidade</span>
                     <Heart size={18} className={`${hpPercent < 30 ? 'text-rose-500 animate-pulse' : 'text-mystic-600'} transition-colors`} fill={hpPercent < 30 ? "currentColor" : "none"} />
                </div>
                
                <div className="flex items-end justify-between relative z-10 mb-4">
                    {isEditing ? (
                        <NumberControl 
                            value={character.hp} 
                            onChange={(v) => onChange('hp', v)} 
                            max={character.maxHp + 50}
                            large
                            className="w-full justify-between px-6 bg-void-950/80 border-white/10"
                        />
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-7xl font-display font-bold text-white tracking-tighter leading-none drop-shadow-lg">{character.hp}</span>
                        </div>
                    )}
                    
                    {!isEditing && (
                        <div className="text-right">
                             <span className="text-sm font-bold text-mystic-500 font-mono block">/ {character.maxHp}</span>
                        </div>
                    )}
                </div>
                
                {/* Elegant Health Bar Line */}
                {!isEditing && (
                    <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${hpColor} transition-all duration-1000 ease-out rounded-full`} 
                            style={{ width: `${hpPercent}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* AC & Init Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* AC */}
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 bg-void-950/20 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center gap-2 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Shield size={14} className="text-cyan-400" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mystic-400 group-hover:text-cyan-200">Defesa</span>
                    </div>
                    
                    {isEditing ? (
                         <NumberControl value={character.ac} onChange={(v) => onChange('ac', v)} className="w-full justify-center" />
                    ) : (
                        <span className="text-5xl font-display font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{character.ac}</span>
                    )}
                </div>

                {/* Initiative */}
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 bg-void-950/20 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center gap-2 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Zap size={14} className="text-gold-500" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mystic-400 group-hover:text-gold-200">Reflexo</span>
                    </div>
                    
                    {isEditing ? (
                        <NumberControl value={character.initiative} onChange={(v) => onChange('initiative', v)} min={-5} max={20} className="w-full justify-center" />
                    ) : (
                        <span className="text-5xl font-display font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                            {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
