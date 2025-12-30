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

  // Helper to safely translate damage types which are usually simple strings
  const safeTranslateList = (list: string[]) => {
      return list.map(item => translateTerm(item)).join(', ');
  };

  return (
    <div className="bg-[#fdf6e3] text-[#58180D] border-4 border-[#e63946] rounded-lg shadow-2xl p-4 max-w-lg w-full font-body relative animate-in fade-in zoom-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-[#58180D] hover:text-red-600 font-bold text-xl"
      >
        ✕
      </button>

      {/* Header */}
      <div className="border-b-2 border-[#e63946] pb-2 mb-4">
        <h2 className="font-heading font-black text-3xl uppercase tracking-tight">{monster.name}</h2>
        <p className="italic text-lg text-black">
            {translateTerm(monster.size)} {translateTerm(monster.type)}, {translateTerm(monster.alignment)}
        </p>
      </div>

      {/* Vitals */}
      <div className="space-y-2 mb-4 text-[#e63946] font-bold">
        <div className="flex items-center gap-2">
            <Shield size={20} />
            <span className="text-black">Classe de Armadura</span> 
            <span>{monster.armor_class[0].value} ({translateText(monster.armor_class[0].type)})</span>
        </div>
        <div className="flex items-center gap-2">
            <Heart size={20} />
            <span className="text-black">Pontos de Vida</span> 
            <span>{monster.hit_points} ({monster.hit_dice})</span>
        </div>
        <div className="flex items-center gap-2">
            <Activity size={20} />
            <span className="text-black">Deslocamento</span> 
            <span className="capitalize">{Object.entries(monster.speed).map(([k, v]) => `${translateTerm(k)} ${v}`).join(', ')}</span>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="border-t-2 border-b-2 border-[#e63946] py-4 mb-4">
         <div className="grid grid-cols-6 gap-2 text-center text-sm">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); // e.g., 'strength' -> 'FOR'
                const val = monster[attrKey as keyof Monster] as number;
                return (
                    <div key={attrKey} className="flex flex-col">
                        <span className="font-bold">{label}</span>
                        <span>{val} ({getMod(val)})</span>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        {/* Saving Throws (Requires filtering proficiencies) */}
        {monster.proficiencies && monster.proficiencies.length > 0 && (
           <p><strong className="text-black">Perícias/Resistências:</strong> {
               monster.proficiencies.map(p => {
                   // Clean up "Skill: Perception" to "Perception" then translate
                   const name = p.proficiency.name.replace('Skill: ', '').replace('Saving Throw: ', '');
                   const isSave = p.proficiency.name.includes('Saving Throw');
                   const translatedName = translateTerm(name);
                   return `${isSave ? '(TR)' : ''} ${translatedName} +${p.value}`;
               }).join(', ')
           }</p>
        )}

        {monster.damage_vulnerabilities.length > 0 && <p><strong className="text-black">Vulnerabilidades:</strong> {safeTranslateList(monster.damage_vulnerabilities)}</p>}
        {monster.damage_resistances.length > 0 && <p><strong className="text-black">Resistências:</strong> {safeTranslateList(monster.damage_resistances)}</p>}
        {monster.damage_immunities.length > 0 && <p><strong className="text-black">Imunidades:</strong> {safeTranslateList(monster.damage_immunities)}</p>}
        
        <p><strong className="text-black">Sentidos:</strong> {Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ')}</p>
        
        <p><strong className="text-black">Idiomas:</strong> {translateText(monster.languages)}</p>
        <p><strong className="text-black">Desafio:</strong> {monster.challenge_rating} ({monster.xp} XP)</p>
      </div>

      <div className="border-t-2 border-[#e63946] pt-4">
         <h3 className="font-heading text-xl border-b border-black mb-2 pb-1 inline-block text-black">Ações</h3>
         <div className="space-y-4">
             {monster.actions?.map((action, i) => (
                 <div key={i}>
                     <span className="font-bold italic text-black">{action.name}.</span> <span dangerouslySetInnerHTML={{__html: action.desc}} />
                 </div>
             ))}
         </div>
         <p className="text-xs text-stone-500 mt-4 italic">* Descrições de ações mantidas no idioma original (SRD).</p>
      </div>
      
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="border-t-2 border-[#e63946] pt-4 mt-4">
            <h3 className="font-heading text-xl border-b border-black mb-2 pb-1 inline-block text-black">Ações Lendárias</h3>
            <div className="space-y-4">
                {monster.legendary_actions.map((action, i) => (
                    <div key={i}>
                        <span className="font-bold italic text-black">{action.name}.</span> <span dangerouslySetInnerHTML={{__html: action.desc}} />
                    </div>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};