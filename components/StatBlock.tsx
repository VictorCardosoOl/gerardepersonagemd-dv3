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
        case 'Força': return <Sword size={18} />;
        case 'Destreza': return <Wind size={18} />;
        case 'Constituição': return <Shield size={18} />;
        case 'Inteligência': return <BookOpen size={18} />;
        case 'Sabedoria': return <Eye size={18} />;
        case 'Carisma': return <MessageCircle size={18} />;
        default: return null;
    }
};

export const StatBlock: React.FC<Props> = ({ label, value, modifier, highlight, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleInc = () => onUpdate && onUpdate(value + 1);
  const handleDec = () => onUpdate && onUpdate(value - 1);

  return (
    <div className="group relative">
        <div className={`
            relative flex flex-col items-center justify-between p-6 rounded-[2rem] transition-all duration-500
            glass-panel border-t border-white/10
            hover:border-mystic-500/50 hover:bg-mystic-900/20 group-hover:-translate-y-1
        `}>
          
          {/* Label & Icon */}
          <div className="flex flex-col items-center gap-2 mb-2 relative z-10 w-full justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <span className={`p-2 rounded-full ${highlight ? 'bg-mystic-500/20 text-mystic-300' : 'bg-void-800 text-slate-400'}`}>
                {getIcon(label)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-display">
                {label}
              </span>
          </div>
          
          {/* BIG Modifier (Visual Anchor) */}
          <div className="relative z-10 flex items-center justify-center my-1 scale-110">
            <span className={`text-6xl font-display font-black tracking-tighter drop-shadow-lg transition-transform duration-300 ${modifier >= 0 ? 'text-white' : 'text-accent-rose'}`}>
                {modString}
            </span>
          </div>
          
          {/* Small Score Badge */}
          <div className="mt-3 relative z-10 w-full flex justify-center">
            {isEditing ? (
                <div className="flex items-center gap-3 bg-void-950/50 rounded-full px-3 py-1.5 border border-white/10">
                    <button onClick={handleDec} className="text-slate-500 hover:text-white transition-colors"><Minus size={14}/></button>
                    <span className="text-sm font-bold w-6 text-center font-mono text-mystic-300">{value}</span>
                    <button onClick={handleInc} className="text-slate-500 hover:text-white transition-colors"><Plus size={14}/></button>
                </div>
            ) : (
                <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-void-950/30 border border-white/5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 mr-2 tracking-wider">Score</span>
                    <span className="text-sm font-mono font-bold text-slate-300">{value}</span>
                </div>
            )}
          </div>

        </div>
        
        {/* RICH TOOLTIP (On Hover) */}
        <div className="tooltip-container absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
            <div className="glass-panel bg-void-900/95 p-5 rounded-2xl border border-mystic-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-void-900 rotate-45 border-t border-l border-mystic-500/30"></div>
                
                <h4 className="font-display text-mystic-300 text-lg mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                    {getIcon(label)} <span className="text-white">{label}</span>
                </h4>
                
                <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
                    {ATTRIBUTE_DESCRIPTIONS[label]}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500">
                    <span>Impacto:</span>
                    <span className="text-mystic-500 font-bold">Alto</span>
                </div>
            </div>
        </div>
    </div>
  );
};