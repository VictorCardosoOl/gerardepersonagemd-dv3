
import React from 'react';
import { NumberControl } from './NumberControl';
import { Dices } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  label: string;
  value: number;
  modifier: number;
  isEditing?: boolean;
  onUpdate?: (value: number) => void;
  delay?: number;
}

export const StatBlock: React.FC<Props> = ({ label, value, modifier, isEditing, onUpdate, delay = 0 }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleRoll = () => {
    if (isEditing) return;
    console.log(`Rolando ${label}: 1d20${modString}`);
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative group h-full"
    >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[1.5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex flex-col items-center justify-between h-full py-4 px-2 rounded-[1.5rem] border border-white/5 bg-void-950/20 backdrop-blur-sm transition-all duration-300 group-hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            
            {/* Label */}
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-mystic-500 group-hover:text-cyan-300 transition-colors duration-300">
                {label.substring(0, 3)}
            </span>
            
            {/* Modifier (Hero) */}
            <div className="relative flex items-center justify-center my-2 w-full flex-grow">
                {isEditing ? (
                     <span className={`font-display font-bold text-4xl text-white/40 select-none`}>
                        {modString}
                     </span>
                ) : (
                    <button 
                        onClick={handleRoll}
                        className="relative w-full h-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                        title={`Rolar teste de ${label}`}
                    >
                        <span className={`
                            font-display font-bold text-5xl tracking-tight transition-all duration-300 select-none z-10
                            ${modifier >= 0 ? 'text-white group-hover:text-cyan-100' : 'text-rose-200 group-hover:text-rose-100'}
                            group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]
                        `}>
                            {modString}
                        </span>
                    </button>
                )}
            </div>
            
            {/* Base Value */}
            <div className="mt-auto">
                {isEditing && onUpdate ? (
                    <NumberControl value={value} onChange={onUpdate} min={1} max={30} className="scale-75 origin-bottom" />
                ) : (
                     <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-px bg-white/10 group-hover:bg-cyan-500/50 transition-colors duration-300"></div>
                        <span className="text-[10px] font-mono text-mystic-600 group-hover:text-mystic-400 transition-colors">
                            {value}
                        </span>
                     </div>
                )}
            </div>
        </div>
    </motion.div>
  );
};
