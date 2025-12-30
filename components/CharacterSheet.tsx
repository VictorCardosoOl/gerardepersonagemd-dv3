import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Sword, Backpack, Eye, MessageCircle, Scroll } from 'lucide-react';
import { CLASSES, RACES, ALIGNMENTS, BACKGROUNDS } from '../constants';

interface Props {
  character: Character;
  backstoryLoading: boolean; // Kept for interface compatibility but unused
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

export const CharacterSheet: React.FC<Props> = ({ character, isEditing = false, onUpdate }) => {
  
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
    <div className="sheet-container w-full max-w-4xl bg-parchment-200 text-wood-900 rounded-xl shadow-2xl overflow-hidden border-4 border-wood-800 relative print:border-2 print:shadow-none">
      
      {/* Header */}
      <div className="bg-wood-800 p-6 text-amber-100 relative overflow-hidden print:bg-white print:text-black print:border-b-2 print:border-black">
        <div className="absolute top-0 right-0 p-4 opacity-10 no-print">
          <Shield size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="w-full">
            {isEditing ? (
              <div className="space-y-2 no-print">
                <input 
                  type="text" 
                  value={character.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full text-4xl font-fantasy bg-wood-900/50 border-b border-amber-500 text-amber-400 focus:outline-none"
                  placeholder="Nome"
                />
                <div className="flex gap-2">
                  <select value={character.race} onChange={(e) => handleChange('race', e.target.value)} className="bg-wood-900 border border-stone-600 rounded px-1">{RACES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}</select>
                  <select value={character.class} onChange={(e) => handleChange('class', e.target.value)} className="bg-wood-900 border border-stone-600 rounded px-1">{CLASSES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                </div>
              </div>
            ) : (
              <div className="border-b-2 border-amber-500/30 pb-2 mb-2 w-full">
                <h1 className="text-4xl md:text-5xl font-fantasy text-amber-400 drop-shadow-md print:text-black">{character.name}</h1>
                <div className="flex gap-4 text-lg font-heading text-stone-300 print:text-gray-700">
                  <span>{character.race} {character.class}</span>
                  <span>•</span>
                  <span>Nível {character.level}</span>
                  {character.isNPC && <span className="text-red-400 font-bold">(NPC)</span>}
                </div>
              </div>
            )}
          </div>
          
          {/* Top Right Stats */}
          <div className="flex gap-4 items-center bg-wood-900/50 p-3 rounded-lg border border-amber-900/30 print:bg-transparent print:border-black">
             <div className="text-center px-2 border-r border-stone-600">
                <span className="block text-xs uppercase text-stone-400 print:text-black">Proficiência</span>
                <span className="text-xl font-bold text-amber-200 print:text-black">+{character.proficiencyBonus}</span>
             </div>
             <div className="text-center px-2">
                <span className="block text-xs uppercase text-stone-400 print:text-black">Percepção Passiva</span>
                <span className="text-xl font-bold text-amber-200 print:text-black">{character.passivePerception}</span>
             </div>
          </div>
        </div>
        
        {/* Sub-header info row */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-amber-200/80 print:text-black">
           <span className="flex items-center gap-1"><Shield size={14} /> {character.alignment}</span>
           <span className="flex items-center gap-1"><Scroll size={14} /> {character.background}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 bg-parchment-200">
        
        {/* Left Column: Stats & Skills */}
        <div className="md:col-span-4 lg:col-span-3 bg-wood-900/10 p-4 border-r border-wood-800/20 flex flex-col gap-6">
            {/* Ability Scores */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-4 gap-y-6 mb-4">
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

        {/* Center/Right Column: Combat & Details */}
        <div className="md:col-span-8 lg:col-span-9 p-6 flex flex-col gap-6">
            
            {/* Combat Stats Row */}
            <div className="flex flex-wrap justify-around items-center bg-white/40 p-4 rounded-xl border border-wood-800/20 shadow-inner gap-4">
                <div className="flex flex-col items-center p-2 min-w-[80px]">
                    <Shield className="text-wood-800 mb-1" size={32} />
                    <span className="text-xs uppercase font-bold text-wood-600">Classe de Armadura</span>
                    {isEditing ? (
                        <input type="number" value={character.ac} onChange={(e) => handleChange('ac', parseInt(e.target.value))} className="text-center text-3xl font-bold font-fantasy bg-transparent border-b border-black w-16"/>
                    ) : (
                        <span className="text-3xl font-fantasy font-bold">{character.ac}</span>
                    )}
                </div>

                <div className="flex flex-col items-center p-2 min-w-[80px] border-l border-r border-wood-800/10 px-8">
                    <Heart className="text-red-700 mb-1" size={32} />
                    <span className="text-xs uppercase font-bold text-wood-600">Pontos de Vida</span>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input type="number" value={character.hp} onChange={(e) => handleChange('hp', parseInt(e.target.value))} className="text-center text-3xl font-bold font-fantasy bg-transparent border-b border-black w-16"/>
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-fantasy font-bold">{character.hp}</span>
                                <span className="text-sm text-wood-600 font-bold">/ {character.maxHp}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center p-2 min-w-[80px]">
                    <span className="text-xs uppercase font-bold text-wood-600 mb-1">Iniciativa</span>
                    <span className="text-3xl font-fantasy font-bold text-wood-800">
                        {character.modifiers.Destreza >= 0 ? `+${character.modifiers.Destreza}` : character.modifiers.Destreza}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Skills List */}
                <div className="bg-white/50 p-4 rounded-lg border border-wood-800/10 print:border-black">
                    <h3 className="font-heading font-bold text-lg mb-3 border-b border-wood-800/20 pb-1 flex items-center gap-2">
                        <Scroll size={18}/> Perícias
                    </h3>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                        {character.skills.map(skill => (
                            <div key={skill.name} className={`flex justify-between items-center px-2 py-1 rounded ${skill.proficient ? 'bg-wood-800/10 font-bold' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${skill.proficient ? 'bg-wood-800' : 'bg-stone-300'}`}></span>
                                    <span>{skill.name} <span className="text-xs text-stone-500 font-normal">({skill.attribute.substring(0,3)})</span></span>
                                </div>
                                <span className={skill.proficient ? 'text-wood-900' : 'text-stone-500'}>
                                    {skill.value >= 0 ? `+${skill.value}` : skill.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features & Equipment */}
                <div className="flex flex-col gap-6">
                    {/* Features */}
                    <div className="bg-white/50 p-4 rounded-lg border border-wood-800/10">
                        <h3 className="font-heading font-bold text-lg mb-3 border-b border-wood-800/20 pb-1 flex items-center gap-2">
                            <Eye size={18}/> Traços & Idiomas
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <strong className="block text-wood-700">Sentidos:</strong>
                                <span className="text-wood-900">{character.senses.length > 0 ? character.senses.join(", ") : "Nenhum especial"}</span>
                            </div>
                            <div>
                                <strong className="block text-wood-700">Idiomas:</strong>
                                <span className="text-wood-900">{character.languages.join(", ")}</span>
                            </div>
                            <div>
                                <strong className="block text-wood-700">Proficiências de Classe:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {classData?.proficiencies.map((p, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-wood-200 text-wood-900 text-xs rounded border border-wood-300">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="bg-white/50 p-4 rounded-lg border border-wood-800/10 flex-grow">
                        <h3 className="font-heading font-bold text-lg mb-3 border-b border-wood-800/20 pb-1 flex items-center gap-2">
                            <Backpack size={18}/> Equipamento
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                            {character.equipment.map((item, idx) => (
                                <li key={idx} className="text-wood-900">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Backstory */}
            <div className="bg-white/40 p-5 rounded-lg border border-wood-800/10 min-h-[150px] print:break-inside-avoid">
                <div className="flex items-center gap-2 mb-2 border-b border-wood-800/20 pb-2">
                    <MessageCircle className="text-wood-800" size={20} />
                    <h3 className="font-bold font-heading uppercase tracking-wider text-wood-900">Histórico / Notas</h3>
                </div>
                {isEditing ? (
                    <textarea 
                        value={character.backstory || ''} 
                        onChange={(e) => handleChange('backstory', e.target.value)}
                        className="w-full h-full min-h-[100px] bg-transparent focus:outline-none"
                    />
                ) : (
                    <p className="font-body text-wood-900 leading-relaxed italic whitespace-pre-wrap">
                        {character.backstory || "Sem notas adicionais."}
                    </p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};