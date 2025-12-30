import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity } from 'lucide-react';
import { translateTerm, translateText } from '../utils/logic';

interface Props {
  monster: Monster;
  onClose: () => void;
}

export const MonsterCard: React.FC<Props> = ({ monster, onClose }) => {
  const getMod = (val: number) => {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  };

  // Helper to safely translate list of strings
  const safeTranslateList = (list: string[]) => {
      return list.map(item => translateTerm(item)).join(', ');
  };

  return (
    <div className="bg-white text-stone-800 border border-stone-200 rounded-xl shadow-xl p-6 max-w-lg w-full font-body relative animate-in fade-in zoom-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-stone-400 hover:text-red-500 font-bold text-xl transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <div className="border-b border-emerald-500/30 pb-4 mb-4">
        <h2 className="font-serif font-black text-3xl text-emerald-900 tracking-tight leading-none mb-1">{monster.name}</h2>
        <p className="italic text-stone-500">
            {translateTerm(monster.size)} {translateTerm(monster.type)}, {translateTerm(monster.alignment)}
        </p>
      </div>

      {/* Vitals */}
      <div className="space-y-3 mb-6 bg-stone-50 p-4 rounded-lg border border-stone-100">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2 text-stone-600 font-bold">
                <Shield size={18} className="text-emerald-600" />
                <span>Classe de Armadura</span>
            </div> 
            <span className="font-mono font-bold text-lg">{monster.armor_class[0].value} <span className="text-xs font-sans font-normal text-stone-500">({translateText(monster.armor_class[0].type)})</span></span>
        </div>
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2 text-stone-600 font-bold">
                <Heart size={18} className="text-rose-500" />
                <span>Pontos de Vida</span>
            </div> 
            <span className="font-mono font-bold text-lg">{monster.hit_points} <span className="text-xs font-sans font-normal text-stone-500">({monster.hit_dice})</span></span>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-600 font-bold">
                <Activity size={18} className="text-amber-500" />
                <span>Deslocamento</span>
            </div> 
            <span className="capitalize font-medium text-stone-800 text-right">{Object.entries(monster.speed).map(([k, v]) => `${translateTerm(k)} ${v}`).join(', ')}</span>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-6">
         <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); // e.g., 'strength' -> 'FOR'
                const val = monster[attrKey as keyof Monster] as number;
                const mod = getMod(val);
                return (
                    <div key={attrKey} className="flex flex-col bg-stone-100 p-2 rounded border border-stone-200">
                        <span className="font-bold text-stone-500 mb-1">{label}</span>
                        <span className="font-mono font-bold text-stone-900 text-sm">{val}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{mod}</span>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-6 text-sm text-stone-600">
        {/* Saving Throws (Requires filtering proficiencies) */}
        {monster.proficiencies && monster.proficiencies.length > 0 && (
           <p className="leading-relaxed"><strong className="text-emerald-800">Perícias/Resistências:</strong> {
               monster.proficiencies.map(p => {
                   // Clean up "Skill: Perception" to "Perception" then translate
                   const name = p.proficiency.name.replace('Skill: ', '').replace('Saving Throw: ', '');
                   const isSave = p.proficiency.name.includes('Saving Throw');
                   const translatedName = translateTerm(name);
                   return `${isSave ? '(TR)' : ''} ${translatedName} +${p.value}`;
               }).join(', ')
           }</p>
        )}

        {monster.damage_vulnerabilities.length > 0 && <p className="leading-relaxed"><strong className="text-rose-700">Vulnerabilidades:</strong> {safeTranslateList(monster.damage_vulnerabilities)}</p>}
        {monster.damage_resistances.length > 0 && <p className="leading-relaxed"><strong className="text-emerald-800">Resistências:</strong> {safeTranslateList(monster.damage_resistances)}</p>}
        {monster.damage_immunities.length > 0 && <p className="leading-relaxed"><strong className="text-emerald-800">Imunidades:</strong> {safeTranslateList(monster.damage_immunities)}</p>}
        
        <p className="leading-relaxed"><strong className="text-emerald-800">Sentidos:</strong> {Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ')}</p>
        
        <p className="leading-relaxed"><strong className="text-emerald-800">Idiomas:</strong> {translateText(monster.languages)}</p>
        <p className="leading-relaxed"><strong className="text-emerald-800">Desafio:</strong> {monster.challenge_rating} ({monster.xp} XP)</p>
      </div>

      <div className="border-t border-stone-200 pt-4">
         <h3 className="font-heading text-lg font-bold text-emerald-900 mb-3 border-l-4 border-emerald-500 pl-2">Ações</h3>
         <div className="space-y-4">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="text-sm">
                     <span className="font-bold text-stone-900">{action.name}.</span> <span className="text-stone-700" dangerouslySetInnerHTML={{__html: action.desc}} />
                 </div>
             ))}
         </div>
      </div>
      
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="border-t border-stone-200 pt-4 mt-4">
            <h3 className="font-heading text-lg font-bold text-emerald-900 mb-3 border-l-4 border-amber-500 pl-2">Ações Lendárias</h3>
            <div className="space-y-4">
                {monster.legendary_actions.map((action, i) => (
                    <div key={i} className="text-sm">
                        <span className="font-bold text-stone-900">{action.name}.</span> <span className="text-stone-700" dangerouslySetInnerHTML={{__html: action.desc}} />
                    </div>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};