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
    <div className="flex flex-col items-center group cursor-pointer relative">
        {/* Interaction Hit Area */}
        <div className="absolute inset-0 -m-4 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>

        {/* Label (Serif Italic) */}
        <span className="font-serif italic text-zinc-500 text-lg md:text-xl mb-1 group-hover:text-champagne-400 transition-colors relative z-10">
            {label}
        </span>
        
        {/* Modifier (Big Mono) */}
        <span className="font-mono text-4xl md:text-5xl text-white font-light tracking-tighter relative z-10">
            {modString}
        </span>
        
        {/* Base Value (Small) */}
        <div className="mt-2 relative z-10">
            {isEditing ? (
                <div className="flex items-center gap-3">
                    <button onClick={handleDec} className="text-zinc-600 hover:text-white transition-colors cursor-pointer"><Minus size={12}/></button>
                    <span className="text-xs font-mono text-zinc-400">{value}</span>
                    <button onClick={handleInc} className="text-zinc-600 hover:text-white transition-colors cursor-pointer"><Plus size={12}/></button>
                </div>
            ) : (
                 <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase tracking-widest">
                    Score {value}
                </span>
            )}
        </div>
    </div>
  );
};