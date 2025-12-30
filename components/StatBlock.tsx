import React from 'react';
import { Sword, Wind, Shield, BookOpen, Eye, MessageCircle } from 'lucide-react';

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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate(parseInt(e.target.value) || 10);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-xl glass-panel transition-all duration-300 group hover:border-emerald-500/50 hover:shadow-lg ${highlight ? 'border-emerald-500/60 bg-emerald-50/50' : 'bg-white/60'}`}>
      
      {/* Label & Icon */}
      <div className="flex items-center gap-1.5 mb-1 text-emerald-800">
          <span className="opacity-70">{getIcon(label)}</span>
          <span 
            title={label} 
            className="text-[10px] uppercase tracking-[0.2em] font-bold"
          >
            {label.substring(0, 3)}
          </span>
      </div>
      
      {/* Big Modifier */}
      <div className="flex items-center justify-center">
        <span className={`text-4xl font-mono font-bold tracking-tighter drop-shadow-sm ${modifier >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {modString}
        </span>
      </div>
      
      {/* Small Score Bubble */}
      <div className="absolute -bottom-3 bg-white text-stone-600 text-xs font-mono font-bold rounded-full w-8 h-8 flex items-center justify-center border border-stone-200 shadow-md z-10">
        {isEditing ? (
            <input 
            type="number" 
            value={value} 
            onChange={handleChange}
            className="w-full h-full bg-transparent text-center focus:outline-none rounded-full text-stone-800"
            />
        ) : (
            <span>{value}</span>
        )}
      </div>
    </div>
  );
};