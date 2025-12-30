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
            glass-panel border-t border-white
            hover:border-royal-400 hover:shadow-lg group-hover:-translate-y-1 bg-white
        `}>
          
          {/* Label & Icon */}
          <div className="flex flex-col items-center gap-2 mb-2 relative z-10 w-full justify-center opacity-70 group-hover:opacity-100 transition-opacity">
              <span className={`p-2 rounded-full ${highlight ? 'bg-royal-100 text-royal-600' : 'bg-canvas-100 text-slate-400'}`}>
                {getIcon(label)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 font-display">
                {label}
              </span>
          </div>
          
          {/* BIG Modifier (Visual Anchor) */}
          <div className="relative z-10 flex items-center justify-center my-1 scale-110">
            <span className={`text-6xl font-display font-black tracking-tighter drop-shadow-sm transition-transform duration-300 ${modifier >= 0 ? 'text-royal-900' : 'text-rose-500'}`}>
                {modString}
            </span>
          </div>
          
          {/* Small Score Badge */}
          <div className="mt-3 relative z-10 w-full flex justify-center">
            {isEditing ? (
                <div className="flex items-center gap-3 bg-canvas-100 rounded-full px-3 py-1.5 border border-canvas-200">
                    <button onClick={handleDec} className="text-slate-400 hover:text-royal-600 transition-colors"><Minus size={14}/></button>
                    <span className="text-sm font-bold w-6 text-center font-mono text-royal-800">{value}</span>
                    <button onClick={handleInc} className="text-slate-400 hover:text-royal-600 transition-colors"><Plus size={14}/></button>
                </div>
            ) : (
                <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-canvas-50 border border-canvas-200">
                    <span className="text-[9px] uppercase font-bold text-slate-400 mr-2 tracking-wider">Score</span>
                    <span className="text-sm font-mono font-bold text-slate-600">{value}</span>
                </div>
            )}
          </div>

        </div>
        
        {/* RICH TOOLTIP (On Hover) */}
        <div className="tooltip-container absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
            <div className="bg-white p-5 rounded-2xl border border-royal-100 shadow-xl relative z-50 text-slate-600">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-royal-100"></div>
                
                <h4 className="font-display text-royal-800 text-lg mb-2 flex items-center gap-2 border-b border-royal-50 pb-2">
                    {getIcon(label)} <span>{label}</span>
                </h4>
                
                <p className="text-sm text-slate-500 leading-relaxed font-serif italic">
                    {ATTRIBUTE_DESCRIPTIONS[label]}
                </p>

                <div className="mt-3 pt-2 border-t border-royal-50 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400">
                    <span>Impacto:</span>
                    <span className="text-royal-600 font-bold">Alto</span>
                </div>
            </div>
        </div>
    </div>
  );
};