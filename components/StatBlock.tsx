import React from 'react';
import { Sword, Wind, Shield, BookOpen, Eye, MessageCircle, Plus, Minus } from 'lucide-react';
import { ATTRIBUTE_DESCRIPTIONS } from '../constants';

interface Props {
  label: string;
  value: number;
  modifier: number;
  highlight?: boolean;
  isEditing?: boolean;
  onUpdate?: (value: number) => void;
}

const getIcon = (label: string) => {
    switch(label) {
        case 'Força': return <Sword size={14} strokeWidth={2.5} />;
        case 'Destreza': return <Wind size={14} strokeWidth={2.5} />;
        case 'Constituição': return <Shield size={14} strokeWidth={2.5} />;
        case 'Inteligência': return <BookOpen size={14} strokeWidth={2.5} />;
        case 'Sabedoria': return <Eye size={14} strokeWidth={2.5} />;
        case 'Carisma': return <MessageCircle size={14} strokeWidth={2.5} />;
        default: return null;
    }
};

export const StatBlock: React.FC<Props> = ({ label, value, modifier, highlight, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleInc = () => onUpdate && onUpdate(value + 1);
  const handleDec = () => onUpdate && onUpdate(value - 1);

  return (
    <div className="group relative w-full perspective-1000">
        <div className={`
            relative flex flex-row lg:flex-col items-center justify-between lg:justify-center p-3 lg:p-5 rounded-2xl transition-all duration-500
            bg-void-900/40 border border-white/5 backdrop-blur-md
            hover:bg-white/5 hover:border-accent-cyan/30 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)]
            overflow-hidden group-hover:-translate-y-1
        `}>
          
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          {/* Label & Icon */}
          <div className="flex items-center gap-2 lg:mb-2 z-10">
              <span className={`p-1.5 rounded-lg bg-white/5 text-mystic-400 group-hover:text-white group-hover:bg-accent-cyan/20 transition-colors`}>
                {getIcon(label)}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold font-body text-mystic-400 group-hover:text-accent-cyan transition-colors`}>
                {label.substring(0, 3)}
              </span>
          </div>
          
          {/* Big Modifier */}
          <div className="relative z-10 flex items-center justify-center lg:my-1">
            <span className={`text-3xl lg:text-4xl font-display font-bold tracking-tight transition-all duration-300 group-hover:scale-110 drop-shadow-lg ${modifier >= 0 ? 'text-white' : 'text-accent-rose'}`}>
                {modString}
            </span>
          </div>
          
          {/* Footer / Value */}
          <div className="lg:mt-2 z-10">
            {isEditing ? (
                <div className="flex items-center gap-2 bg-void-950/50 rounded-full px-1 py-0.5 border border-white/10">
                    <button onClick={handleDec} className="w-5 h-5 flex items-center justify-center rounded-full text-mystic-400 hover:text-white hover:bg-white/10 transition-colors"><Minus size={10}/></button>
                    <span className="text-xs font-bold w-4 text-center font-mono text-mystic-200">{value}</span>
                    <button onClick={handleInc} className="w-5 h-5 flex items-center justify-center rounded-full text-mystic-400 hover:text-white hover:bg-white/10 transition-colors"><Plus size={10}/></button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 text-white/20 group-hover:text-mystic-300 transition-colors">
                    <span className="text-[10px] font-mono font-bold tracking-widest">Base {value}</span>
                </div>
            )}
          </div>
        </div>
        
        {/* Mystic Tooltip */}
        <div className="tooltip-container absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-x-4 group-hover:translate-x-0 hidden lg:block">
            <div className="bg-void-950/95 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-2xl relative z-50 text-mystic-100">
                <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-void-950 rotate-45 border-l border-b border-white/10 -translate-y-1/2"></div>
                
                <h4 className="font-display text-accent-cyan text-sm mb-2 flex items-center gap-2 uppercase tracking-widest font-bold">
                    {label}
                </h4>
                
                <p className="text-xs text-mystic-300 leading-relaxed font-sans border-l border-white/10 pl-3">
                    {ATTRIBUTE_DESCRIPTIONS[label]}
                </p>
            </div>
        </div>
    </div>
  );
};