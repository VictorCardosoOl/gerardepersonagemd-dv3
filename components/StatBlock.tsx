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
    <div className={`flex flex-col items-center p-3 rounded-lg border-2 ${highlight ? 'border-amber-500 bg-wood-800/50' : 'border-stone-700 bg-stone-800/50'} relative group`}>
      <span 
        title={label} 
        className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-1 cursor-help border-b border-dashed border-stone-600 hover:text-amber-300 hover:border-amber-300 transition-colors"
      >
        {label.substring(0, 3)}
      </span>
      
      {isEditing ? (
        <input 
          type="number" 
          value={value} 
          onChange={handleChange}
          className="w-16 text-center text-2xl font-fantasy bg-wood-900 border-b-2 border-amber-500 text-amber-100 focus:outline-none focus:bg-wood-800"
        />
      ) : (
        <span className="text-2xl font-fantasy text-amber-100">{value}</span>
      )}
      
      <span className={`text-sm font-bold mt-1 px-2 rounded-full ${modifier >= 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
        {modString}
      </span>
    </div>
  );
};