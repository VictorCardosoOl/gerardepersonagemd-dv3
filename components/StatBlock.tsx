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
        case 'Força': return <Sword size={16} />;
        case 'Destreza': return <Wind size={16} />;
        case 'Constituição': return <Shield size={16} />;
        case 'Inteligência': return <BookOpen size={16} />;
        case 'Sabedoria': return <Eye size={16} />;
        case 'Carisma': return <MessageCircle size={16} />;
        default: return null;
    }
};

export const StatBlock: React.FC<Props> = ({ label, value, modifier, highlight, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleInc = () => onUpdate && onUpdate(value + 1);
  const handleDec = () => onUpdate && onUpdate(value - 1);

  return (
    <div className="group relative w-full">
        <div className={`
            relative flex flex-col items-center justify-between p-6 rounded-2xl transition-all duration-500
            bg-white border border-mystic-100/50 shadow-card
            hover:shadow-glow hover:border-mystic-200 hover:-translate-y-1
        `}>
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 w-full justify-center">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold font-display ${highlight ? 'text-mystic-600' : 'text-slate-400'}`}>
                {label}
              </span>
          </div>
          
          {/* Big Modifier */}
          <div className="relative z-10 flex items-center justify-center my-2">
            <span className={`text-5xl font-display font-bold tracking-tighter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${modifier >= 0 ? 'text-void-900' : 'text-accent-rose'}`}>
                {modString}
            </span>
          </div>
          
          {/* Footer / Value */}
          <div className="mt-2 w-full flex justify-center">
            {isEditing ? (
                <div className="flex items-center gap-2 bg-scroll-50 rounded-full px-2 py-1 border border-scroll-200 shadow-inner">
                    <button onClick={handleDec} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 hover:text-mystic-600 transition-colors"><Minus size={12}/></button>
                    <span className="text-sm font-bold w-6 text-center font-mono text-void-800">{value}</span>
                    <button onClick={handleInc} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 hover:text-mystic-600 transition-colors"><Plus size={12}/></button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2 text-slate-400 group-hover:text-mystic-500 transition-colors">
                    {getIcon(label)}
                    <span className="text-sm font-mono font-bold">{value}</span>
                </div>
            )}
          </div>
        </div>
        
        {/* Mystic Tooltip */}
        <div className="tooltip-container absolute left-full top-0 ml-4 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-x-2 group-hover:translate-x-0">
            <div className="bg-void-950 p-5 rounded-xl border border-void-800 shadow-2xl relative z-50 text-mystic-100">
                <div className="absolute top-8 -left-1.5 w-3 h-3 bg-void-950 rotate-45 border-l border-b border-void-800"></div>
                
                <h4 className="font-display text-white text-base mb-2 flex items-center gap-2">
                    {getIcon(label)} <span className="uppercase tracking-widest text-xs">{label}</span>
                </h4>
                
                <p className="text-sm text-slate-400 leading-relaxed font-serif italic border-l-2 border-mystic-800 pl-3">
                    {ATTRIBUTE_DESCRIPTIONS[label]}
                </p>
            </div>
        </div>
    </div>
  );
};