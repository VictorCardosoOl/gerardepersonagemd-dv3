import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  modifier: number;
  isEditing?: boolean;
  onUpdate?: (value: number) => void;
}

export const StatBlock: React.FC<Props> = ({ label, value, modifier, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleInc = () => onUpdate && onUpdate(value + 1);
  const handleDec = () => onUpdate && onUpdate(value - 1);

  return (
    <div className="flex flex-col items-center group relative z-10 transition-transform hover:-translate-y-1 duration-500">
        {/* Label - Cinzel, High Spacing */}
        <span className="font-display font-bold text-mystic-400 text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-2 group-hover:text-cyan-400 transition-colors duration-300">
            {label.substring(0, 3)}
        </span>
        
        {/* Modifier - Inter Thin, Hero Size */}
        <div className="relative flex items-center justify-center">
            <span className={`
                font-body font-thin text-6xl md:text-7xl tracking-tighter transition-all duration-300 select-none
                ${modifier >= 0 ? 'text-white' : 'text-accent-rose drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]'}
            `}>
                {modString}
            </span>
            
            {/* Ethereal Glow */}
            <div className={`
                absolute inset-0 blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full
                ${modifier >= 0 ? 'bg-cyan-400' : 'bg-rose-500'}
            `}></div>
        </div>
        
        {/* Base Value - Mono, Low Opacity */}
        <div className="mt-2 h-8 flex items-center justify-center">
            {isEditing ? (
                <div className="flex items-center gap-2 bg-void-950/80 border border-white/10 rounded-full px-2 py-1 shadow-inner backdrop-blur-sm">
                    <button onClick={handleDec} className="text-mystic-500 hover:text-white transition-colors"><Minus size={10}/></button>
                    <span className="text-xs font-mono text-white w-6 text-center">{value}</span>
                    <button onClick={handleInc} className="text-mystic-500 hover:text-white transition-colors"><Plus size={10}/></button>
                </div>
            ) : (
                 <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-px bg-white/30 mb-1 group-hover:w-16 group-hover:bg-cyan-500/50 transition-all duration-500"></div>
                    <span className="text-[10px] font-mono text-white tracking-widest">
                        VAL {value}
                    </span>
                 </div>
            )}
        </div>
    </div>
  );
};