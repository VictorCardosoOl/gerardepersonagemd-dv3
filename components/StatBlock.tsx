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
    <div className={`flex flex-col items-center justify-between p-2 rounded-lg border-2 ${highlight ? 'border-amber-500 bg-wood-800/80' : 'border-stone-600 bg-wood-900/60'} h-28 w-full relative group shadow-lg`}>
      <span 
        title={label} 
        className="text-[10px] md:text-xs uppercase tracking-widest text-stone-400 font-bold -mt-1"
      >
        {label.substring(0, 3)}
      </span>
      
      {/* Big Modifier */}
      <div className="flex-grow flex items-center justify-center">
        <span className={`text-3xl md:text-4xl font-fantasy font-bold ${modifier >= 0 ? 'text-amber-100' : 'text-red-200'}`}>
            {modString}
        </span>
      </div>
      
      {/* Small Score Bubble */}
      <div className="bg-white text-wood-900 font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-stone-500 -mb-5 z-10 text-sm shadow-md">
        {isEditing ? (
            <input 
            type="number" 
            value={value} 
            onChange={handleChange}
            className="w-full h-full bg-transparent text-center focus:outline-none rounded-full"
            />
        ) : (
            <span>{value}</span>
        )}
      </div>
    </div>
  );
};