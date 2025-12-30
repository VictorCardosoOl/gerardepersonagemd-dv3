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
    <div className="flex flex-col items-center group relative z-10">
        {/* Label - Cinzel */}
        <span className="font-display font-bold text-mystic-500 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 group-hover:text-cyan-400 transition-colors">
            {label.substring(0, 3)}
        </span>
        
        {/* Modifier - Huge Inter */}
        <span className={`font-body font-light text-4xl md:text-5xl tracking-tight transition-all duration-300 ${modifier >= 0 ? 'text-white' : 'text-red-400'}`}>
            {modString}
        </span>
        
        {/* Base Value - Tiny */}
        <div className="mt-2 h-6 flex items-center justify-center">
            {isEditing ? (
                <div className="flex items-center gap-2 bg-white/5 rounded-full px-1">
                    <button onClick={handleDec} className="p-1 text-mystic-500 hover:text-white transition-colors"><Minus size={10}/></button>
                    <span className="text-xs font-mono text-mystic-300 w-4 text-center">{value}</span>
                    <button onClick={handleInc} className="p-1 text-mystic-500 hover:text-white transition-colors"><Plus size={10}/></button>
                </div>
            ) : (
                 <span className="text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors">
                    BASE {value}
                </span>
            )}
        </div>
    </div>
  );
};