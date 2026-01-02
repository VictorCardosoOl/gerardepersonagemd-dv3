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
    const hpColor = hpPercent < 30 ? 'bg-rose-500' : hpPercent < 60 ? 'bg-gold-500' : 'bg-emerald-500';

    return (
        <div className="flex flex-col gap-6 h-full">
            
            {/* HP Row - Featured */}
            <div className="flex flex-col p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mystic-500 group-hover:text-white transition-colors">Vitalidade</span>
                     <Heart size={16} className={`${hpPercent < 30 ? 'text-rose-500 animate-pulse' : 'text-mystic-600'}`} />
                </div>
                
                <div className="flex items-end justify-between relative z-10">
                    {isEditing ? (
                        <NumberControl 
                            value={character.hp} 
                            onChange={(v) => onChange('hp', v)} 
                            max={character.maxHp + 20}
                            large
                            className="w-full justify-between px-6 bg-void-950/80 border-white/10"
                        />
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-6xl font-body font-thin text-white tracking-tighter leading-none">{character.hp}</span>
                        </div>
                    )}
                    
                    {!isEditing && (
                        <div className="text-right">
                             <span className="text-sm font-bold text-mystic-500">MAX {character.maxHp}</span>
                        </div>
                    )}
                </div>
                
                {/* Elegant Health Bar Line */}
                {!isEditing && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-void-900">
                        <div 
                            className={`h-full ${hpColor} transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`} 
                            style={{ width: `${hpPercent}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* AC & Init Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* AC */}
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Shield size={12} className="text-cyan-400" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mystic-400">CA</span>
                    </div>
                    
                    {isEditing ? (
                         <NumberControl value={character.ac} onChange={(v) => onChange('ac', v)} className="w-full justify-center" />
                    ) : (
                        <span className="text-5xl font-body font-thin text-white tracking-tighter">{character.ac}</span>
                    )}
                </div>

                {/* Initiative */}
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Zap size={12} className="text-gold-500" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mystic-400">Inic.</span>
                    </div>
                    
                    {isEditing ? (
                        <NumberControl value={character.initiative} onChange={(v) => onChange('initiative', v)} min={-5} max={20} className="w-full justify-center" />
                    ) : (
                        <span className="text-5xl font-body font-thin text-white tracking-tighter">
                            {character.initiative >= 0 ? `+${character.initiative}` : character.initiative}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};