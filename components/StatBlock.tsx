import React from 'react';
import { NumberControl } from './NumberControl';
import { Dices } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  modifier: number;
  isEditing?: boolean;
  onUpdate?: (value: number) => void;
}

export const StatBlock: React.FC<Props> = ({ label, value, modifier, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  // Simulation of a "Roll" action in Play Mode
  const handleRoll = () => {
    if (isEditing) return;
    // In a real app, this would trigger a Toast or Modal with the dice result
    console.log(`Rolando ${label}: 1d20${modString}`);
  };

  return (
    <div className="flex flex-col items-center group relative z-10">
        
        {/* Label */}
        <span className="font-body font-bold text-mystic-500 text-[10px] md:text-[11px] uppercase tracking-[0.25em] mb-3 group-hover:text-cyan-400 transition-colors duration-300">
            {label.substring(0, 3)}
        </span>
        
        {/* Modifier (Hero Number) */}
        <div className="relative flex items-center justify-center mb-3">
            {isEditing ? (
                 // Edit Mode: Just visual wrapper, control is below
                 <span className={`font-body font-thin text-5xl md:text-6xl tracking-tighter opacity-50 select-none ${modifier >= 0 ? 'text-white' : 'text-accent-rose'}`}>
                    {modString}
                 </span>
            ) : (
                // Play Mode: Interactive Button
                <button 
                    onClick={handleRoll}
                    className="relative group/btn cursor-pointer active:scale-95 transition-transform"
                    title={`Rolar teste de ${label}`}
                >
                    <span className={`
                        font-body font-thin text-6xl md:text-7xl tracking-tighter transition-all duration-300 select-none relative z-10
                        ${modifier >= 0 ? 'text-white group-hover/btn:text-cyan-200' : 'text-accent-rose group-hover/btn:text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]'}
                    `}>
                        {modString}
                    </span>
                    
                    {/* Hover Glow Effect */}
                    <div className={`
                        absolute inset-0 blur-[40px] opacity-0 group-hover/btn:opacity-40 transition-opacity duration-500 rounded-full
                        ${modifier >= 0 ? 'bg-cyan-400' : 'bg-rose-500'}
                    `}></div>

                    {/* Hidden "Roll" Icon hint */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity z-20">
                         <Dices className={`w-8 h-8 ${modifier >= 0 ? 'text-cyan-900' : 'text-rose-900'}`} />
                    </div>
                </button>
            )}
        </div>
        
        {/* Base Value Control */}
        <div className="h-10 flex items-center justify-center">
            {isEditing && onUpdate ? (
                <NumberControl value={value} onChange={onUpdate} min={1} max={30} />
            ) : (
                 <div className="flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-px bg-white/30 mb-1 group-hover:w-12 group-hover:bg-cyan-500/50 transition-all duration-500"></div>
                    <span className="text-[10px] font-mono text-white tracking-widest">
                        VAL {value}
                    </span>
                 </div>
            )}
        </div>
    </div>
  );
};