import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Sparkles, ScrollText, Sword, Backpack } from 'lucide-react';
import { CLASSES, RACES, ALIGNMENTS, BACKGROUNDS } from '../constants';

interface Props {
  character: Character;
  backstoryLoading: boolean;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

export const CharacterSheet: React.FC<Props> = ({ character, backstoryLoading, isEditing = false, onUpdate }) => {
  
  const classData = CLASSES.find(c => c.name === character.class);

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    if (!onUpdate) return;
    const newAttributes = { ...character.attributes, [key]: value };
    onUpdate({ attributes: newAttributes });
  };

  const handleChange = (field: keyof Character, value: any) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  return (
    <div className="w-full max-w-2xl bg-parchment-200 text-wood-900 rounded-xl shadow-2xl overflow-hidden border-4 border-wood-800 relative">
      {/* Header */}
      <div className="bg-wood-800 p-6 text-amber-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div className="w-full">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={character.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full text-4xl md:text-5xl font-fantasy bg-wood-900/50 border-b border-amber-500 text-amber-400 focus:outline-none placeholder-wood-600"
                  placeholder="Nome do Personagem"
                />
                <div className="flex gap-2">
                  <select 
                    value={character.race}
                    onChange={(e) => handleChange('race', e.target.value)}
                    className="bg-wood-900 text-stone-300 border border-stone-600 rounded px-2 py-1"
                  >
                    {RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                  <select 
                    value={character.class}
                    onChange={(e) => handleChange('class', e.target.value)}
                    className="bg-wood-900 text-stone-300 border border-stone-600 rounded px-2 py-1"
                  >
                    {CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-fantasy text-amber-400 drop-shadow-md">{character.name}</h1>
                <p className="text-lg md:text-xl font-heading text-stone-300 mt-1">
                  {character.race} {character.class}, Nível {character.level}
                </p>
              </>
            )}
          </div>
          <div className="text-right flex flex-col items-end min-w-[150px]">
             {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                  <select 
                    value={character.alignment}
                    onChange={(e) => handleChange('alignment', e.target.value)}
                    className="bg-wood-900 text-stone-300 text-sm border border-stone-600 rounded px-2 py-1 text-right"
                  >
                    {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select 
                    value={character.background}
                    onChange={(e) => handleChange('background', e.target.value)}
                    className="bg-wood-900 text-stone-300 text-sm border border-stone-600 rounded px-2 py-1 text-right font-bold"
                  >
                    {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
             ) : (
               <>
                 <span className="italic text-stone-400 text-sm">{character.alignment}</span>
                 <span className="font-bold text-amber-200">{character.background}</span>
               </>
             )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 bg-wood-900">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
            <StatBlock 
              key={key} 
              label={key} 
              value={character.attributes[key]} 
              modifier={character.modifiers[key]} 
              isEditing={isEditing}
              onUpdate={(val) => handleAttributeChange(key, val)}
            />
          ))}
        </div>
      </div>

      {/* Vital Stats & Details */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Vitals Column */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-white/50 p-4 rounded-lg border border-wood-800/20 shadow-inner">
            <div className="flex items-center gap-2">
              <Shield className="text-wood-800" size={24} />
              <span className="font-bold font-heading text-lg">CA</span>
            </div>
            {isEditing ? (
              <input 
                type="number"
                value={character.ac}
                onChange={(e) => handleChange('ac', parseInt(e.target.value) || 10)}
                className="w-16 text-right text-3xl font-fantasy font-bold bg-transparent border-b border-wood-800 focus:outline-none"
              />
            ) : (
              <span className="text-3xl font-fantasy font-bold">{character.ac}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between bg-white/50 p-4 rounded-lg border border-wood-800/20 shadow-inner">
            <div className="flex items-center gap-2">
              <Heart className="text-red-700" size={24} />
              <span className="font-bold font-heading text-lg">PV</span>
            </div>
             {isEditing ? (
              <input 
                type="number"
                value={character.hp}
                onChange={(e) => handleChange('hp', parseInt(e.target.value) || 1)}
                className="w-16 text-right text-3xl font-fantasy font-bold bg-transparent border-b border-wood-800 focus:outline-none"
              />
            ) : (
              <span className="text-3xl font-fantasy font-bold">{character.hp}</span>
            )}
          </div>

          {/* Equipment Section */}
          <div className="bg-white/40 p-4 rounded-lg border border-wood-800/10 text-sm">
             <div className="flex items-center gap-2 mb-2 border-b border-wood-800/20 pb-1">
                <Backpack size={16} className="text-wood-800" />
                <h3 className="font-bold font-heading text-wood-900">Equipamento</h3>
             </div>
             <ul className="list-disc list-inside space-y-1 pl-1">
                {character.equipment.length > 0 ? character.equipment.map((item, idx) => (
                    <li key={idx} className="truncate text-wood-900 font-medium">{item}</li>
                )) : <li className="text-wood-800/50 italic">Nenhum equipamento.</li>}
             </ul>
          </div>
        </div>

        {/* Story/Details Column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          
          {/* Proficiencies Section (Derived from Class) */}
          <div className="bg-white/40 p-4 rounded-lg border border-wood-800/10">
            <div className="flex items-center gap-2 mb-2 border-b border-wood-800/20 pb-1">
              <Sword size={18} className="text-wood-800" />
              <h3 className="font-bold font-heading uppercase tracking-wider text-wood-900 text-sm">Proficiências de Classe ({character.class})</h3>
            </div>
            <div className="flex flex-wrap gap-2">
               {classData?.proficiencies.map((prof, idx) => (
                 <span key={idx} className="bg-wood-800 text-amber-100 text-xs px-2 py-1 rounded font-bold">
                   {prof}
                 </span>
               )) || <span className="text-sm italic text-wood-800/50">Nenhuma proficiência encontrada.</span>}
            </div>
          </div>

          {/* Backstory Section */}
          <div className="bg-white/40 p-5 rounded-lg border border-wood-800/10 flex-grow flex flex-col min-h-[200px]">
            <div className="flex items-center gap-2 mb-3 border-b border-wood-800/20 pb-2">
              <ScrollText className="text-wood-800" size={20} />
              <h3 className="font-bold font-heading uppercase tracking-wider text-wood-900">Histórico</h3>
            </div>
            
            <div className="flex-grow">
              {backstoryLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-wood-800/60 animate-pulse">
                  <Sparkles size={32} className="mb-2" />
                  <p>O oráculo está consultando os planos...</p>
                </div>
              ) : isEditing ? (
                 <textarea 
                    value={character.backstory || ''}
                    onChange={(e) => handleChange('backstory', e.target.value)}
                    className="w-full h-full min-h-[150px] bg-transparent border border-wood-800/30 rounded p-2 focus:outline-none focus:border-amber-500 font-body text-wood-900"
                    placeholder="Escreva a história deste personagem..."
                 />
              ) : character.backstory ? (
                <p className="font-body text-wood-900 leading-relaxed italic text-lg whitespace-pre-wrap">
                  "{character.backstory}"
                </p>
              ) : (
                <p className="font-body text-wood-800/50 italic">
                  A história deste aventureiro ainda não foi escrita... (Gere com IA para detalhes)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};