import React from 'react';

interface Props {
  label: string;
  value: number;
  modifier: number;
  highlight?: boolean;
  isEditing?: boolean;
  onUpdate?: (value: number) => void;
}

export const StatBlock: React.FC<Props> = ({ label, value, modifier, highlight, isEditing, onUpdate }) => {
  const modString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate(parseInt(e.target.value) || 10);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-xl glass-panel transition-all duration-300 group hover:border-indigo-500/50 ${highlight ? 'border-indigo-500/60 bg-indigo-950/20' : ''}`}>
      
      {/* Label */}
      <span 
        title={label} 
        className="text-[10px] uppercase tracking-[0.2em] text-indigo-300 font-bold mb-1"
      >
        {label.substring(0, 3)}
      </span>
      
      {/* Big Modifier */}
      <div className="flex items-center justify-center">
        <span className={`text-4xl font-mono font-bold tracking-tighter drop-shadow-lg ${modifier >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {modString}
        </span>
      </div>
      
      {/* Small Score Bubble */}
      <div className="absolute -bottom-3 bg-slate-900 text-slate-400 text-xs font-mono font-bold rounded-full w-8 h-8 flex items-center justify-center border border-slate-700 shadow-lg z-10">
        {isEditing ? (
            <input 
            type="number" 
            value={value} 
            onChange={handleChange}
            className="w-full h-full bg-transparent text-center focus:outline-none rounded-full text-white"
            />
        ) : (
            <span>{value}</span>
        )}
      </div>
    </div>
  );
};