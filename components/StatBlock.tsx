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
    <div className="flex flex-col items-center group relative z-10 transition-transform hover:-translate-y-1 duration-300">
        {/* Label - Cinzel */}
        <span className="font-display font-bold text-mystic-500 text-[10px] md:text-xs uppercase tracking-[0.25em] mb-3 group-hover:text-cyan-400 transition-colors">
            {label.substring(0, 3)}
        </span>
        
        {/* Modifier - Huge Inter */}
        <div className="relative">
            <span className={`font-body font-light text-5xl md:text-6xl tracking-tighter transition-all duration-300 ${modifier >= 0 ? 'text-white' : 'text-accent-rose drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`}>
                {modString}
            </span>
            {/* Subtle glow behind number */}
            <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${modifier >= 0 ? 'bg-white' : 'bg-red-500'}`}></div>
        </div>
        
        {/* Base Value - Tiny */}
        <div className="mt-3 h-6 flex items-center justify-center">
            {isEditing ? (
                <div className="flex items-center gap-2 bg-void-950 border border-white/10 rounded-full px-2 py-1 shadow-inner">
                    <button onClick={handleDec} className="text-mystic-500 hover:text-white transition-colors"><Minus size={12}/></button>
                    <span className="text-xs font-mono text-white w-5 text-center">{value}</span>
                    <button onClick={handleInc} className="text-mystic-500 hover:text-white transition-colors"><Plus size={12}/></button>
                </div>
            ) : (
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-px bg-white/10 mb-1 group-hover:w-12 group-hover:bg-cyan-500/50 transition-all"></div>
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                        VAL {value}
                    </span>
                 </div>
            )}
        </div>
    </div>
  );
};