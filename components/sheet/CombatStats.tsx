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
            
            {/* AC Card - CYAN */}
            <div className="relative group overflow-hidden bg-void-900/40 border border-white/10 shadow-inner-light rounded-[2rem] p-6 hover:border-accent-cyan/50 transition-all duration-500">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-cyan/20 blur-[50px] rounded-full group-hover:bg-accent-cyan/30 transition-all"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-4 p-3 bg-accent-cyan/10 rounded-full text-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <Shield size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] uppercase text-mystic-400 font-bold tracking-[0.25em] mb-2">Classe de Armadura</span>
                    
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.ac} 
                            onChange={(e) => onChange('ac', parseInt(e.target.value))} 
                            className="w-24 text-6xl font-display font-bold text-center text-white bg-transparent border-b border-accent-cyan/50 focus:border-accent-cyan focus:outline-none"
                        />
                    ) : (
                        <span className="text-7xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            {character.ac}
                        </span>
                    )}
                </div>
            </div>

            {/* HP Card - ROSE */}
            <div className="relative group overflow-hidden bg-void-900/40 border border-white/10 shadow-inner-light rounded-[2rem] p-6 hover:border-accent-rose/50 transition-all duration-500">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-rose/20 blur-[50px] rounded-full group-hover:bg-accent-rose/30 transition-all"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-4 p-3 bg-accent-rose/10 rounded-full text-accent-rose shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                        <Heart size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] uppercase text-mystic-400 font-bold tracking-[0.25em] mb-2">Pontos de Vida</span>
                    
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.hp} 
                            onChange={(e) => onChange('hp', parseInt(e.target.value))} 
                            className="w-24 text-6xl font-display font-bold text-center text-white bg-transparent border-b border-accent-rose/50 focus:border-accent-rose focus:outline-none"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-7xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                                {character.hp}
                            </span>
                            <div className="h-1 w-12 bg-white/10 rounded-full my-1 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full bg-accent-rose" style={{width: `${(character.hp / character.maxHp) * 100}%`}}></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-mystic-500 mt-1">
                                MAX {character.maxHp}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Initiative Card - GOLD */}
            <div className="relative group overflow-hidden bg-void-900/40 border border-white/10 shadow-inner-light rounded-[2rem] p-6 hover:border-accent-gold/50 transition-all duration-500">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-gold/20 blur-[50px] rounded-full group-hover:bg-accent-gold/30 transition-all"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-4 p-3 bg-accent-gold/10 rounded-full text-accent-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <Zap size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] uppercase text-mystic-400 font-bold tracking-[0.25em] mb-2">Iniciativa</span>
                    
                    {isEditing ? (
                        <input 
                            type="number" 
                            value={character.initiative !== undefined ? character.initiative : character.modifiers.Destreza} 
                            onChange={(e) => onChange('initiative', parseInt(e.target.value))} 
                            className="w-24 text-6xl font-display font-bold text-center text-white bg-transparent border-b border-accent-gold/50 focus:border-accent-gold focus:outline-none"
                        />
                    ) : (
                        <span className="text-7xl font-display font-bold text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                             {(character.initiative ?? character.modifiers.Destreza) >= 0 ? `+${character.initiative ?? character.modifiers.Destreza}` : (character.initiative ?? character.modifiers.Destreza)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};