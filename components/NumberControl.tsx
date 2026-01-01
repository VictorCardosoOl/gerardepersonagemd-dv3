import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
  large?: boolean;
}

export const NumberControl: React.FC<Props> = ({ value, onChange, min = 0, max = 999, className = "", large = false }) => {
  const handleDec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) onChange(value - 1);
  };

  const handleInc = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`flex items-center gap-2 bg-void-950/50 border border-white/10 rounded-xl p-1 shadow-inner backdrop-blur-sm ${className}`}>
      <button 
        onClick={handleDec}
        className={`flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 active:scale-95 transition-all text-mystic-400 ${large ? 'w-10 h-10' : 'w-8 h-8'}`}
      >
        <Minus size={large ? 18 : 14} />
      </button>
      
      <span className={`font-mono font-bold text-white text-center select-none ${large ? 'text-xl w-12' : 'text-sm w-8'}`}>
        {value}
      </span>
      
      <button 
        onClick={handleInc}
        className={`flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 active:scale-95 transition-all text-mystic-400 ${large ? 'w-10 h-10' : 'w-8 h-8'}`}
      >
        <Plus size={large ? 18 : 14} />
      </button>
    </div>
  );
};