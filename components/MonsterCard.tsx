import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity } from 'lucide-react';
import { translateTerm, translateText } from '../utils/logic';

interface Props {
  monster: Monster;
  onClose: () => void;
}

export const MonsterCard: React.FC<Props> = ({ monster, onClose }) => {
  if (!monster) return null;

  const getMod = (val: number) => {
    return Math.floor((val - 10) / 2);
  };

  const safeTranslateList = (list: string[]) => {
      if (!list || !Array.isArray(list)) return '';
      return list.map(item => translateTerm(item)).join(', ');
  };

  // Safe Armor Class Handling
  const renderAC = () => {
    if (!monster.armor_class) return '10';
    if (Array.isArray(monster.armor_class) && monster.armor_class.length > 0) {
        return (
            <>
                {monster.armor_class[0].value}
                <span className="text-xs font-sans font-normal text-stone-500 ml-1">
                    ({translateText(monster.armor_class[0].type || '')})
                </span>
            </>
        );
    }
    // Fallback for number
    return monster.armor_class; 
  };

  return (
    <div className="bg-white text-stone-800 border border-stone-200 rounded-xl shadow-xl p-6 max-w-2xl w-full font-body relative animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-stone-300 hover:text-red-500 font-bold transition-colors p-2"
      >
        ✕
      </button>

      {/* Header */}
      <div className="border-b border-emerald-500/30 pb-4 mb-6">
        <h2 className="font-serif font-black text-4xl text-emerald-900 tracking-tight leading-none mb-2">{monster.name}</h2>
        <p className="italic text-stone-500 text-lg">
            {translateTerm(monster.size)} {translateTerm(monster.type)}, {translateTerm(monster.alignment)}
        </p>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 flex flex-col items-center justify-center text-center">
             <Shield size={24} className="text-emerald-600 mb-2" />
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Defesa (CA)</span>
             <span className="font-mono font-bold text-2xl text-stone-800">{renderAC()}</span>
        </div>
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 flex flex-col items-center justify-center text-center">
             <Heart size={24} className="text-rose-500 mb-2" />
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Vida (PV)</span>
             <span className="font-mono font-bold text-2xl text-stone-800">
                {monster.hit_points} <span className="text-xs text-stone-400 font-sans font-normal">({monster.hit_dice})</span>
             </span>
        </div>
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 flex flex-col items-center justify-center text-center">
             <Activity size={24} className="text-amber-500 mb-2" />
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Deslocamento</span>
             <span className="font-medium text-stone-800 text-sm capitalize">
                {monster.speed ? Object.entries(monster.speed).map(([k, v]) => `${translateTerm(k)} ${v}`).join(', ') : '-'}
             </span>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-8">
         <div className="grid grid-cols-6 gap-2 text-center text-xs">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); 
                const val = monster[attrKey as keyof Monster] as number || 10;
                const mod = getMod(val);
                return (
                    <div key={attrKey} className="flex flex-col">
                        <span className="font-bold text-stone-400 mb-1 uppercase tracking-widest text-[10px]">{label}</span>
                        <div className="bg-stone-100 p-2 rounded border border-stone-200">
                            <span className="font-mono font-bold text-stone-900 text-sm block">{val}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">{mod >= 0 ? '+' : ''}{mod}</span>
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Details List */}
      <div className="space-y-3 mb-8 text-sm text-stone-600 bg-stone-50/50 p-4 rounded-lg border border-stone-100">
        
        {monster.proficiencies && monster.proficiencies.length > 0 && (
           <div className="flex gap-2">
                <strong className="text-stone-800 min-w-[120px]">Perícias/Saves:</strong> 
                <span>
                {monster.proficiencies.map(p => {
                   const name = p.proficiency?.name?.replace('Skill: ', '').replace('Saving Throw: ', '') || '';
                   const isSave = p.proficiency?.name?.includes('Saving Throw');
                   const translatedName = translateTerm(name);
                   return `${isSave ? '(TR)' : ''} ${translatedName} +${p.value}`;
               }).join(', ')}
               </span>
           </div>
        )}

        {monster.damage_vulnerabilities?.length > 0 && (
            <div className="flex gap-2 text-rose-700">
                <strong className="min-w-[120px]">Vulnerável:</strong> {safeTranslateList(monster.damage_vulnerabilities)}
            </div>
        )}
        {monster.damage_resistances?.length > 0 && (
            <div className="flex gap-2 text-emerald-800">
                <strong className="min-w-[120px]">Resistente:</strong> {safeTranslateList(monster.damage_resistances)}
            </div>
        )}
        {monster.damage_immunities?.length > 0 && (
            <div className="flex gap-2 text-emerald-800">
                <strong className="min-w-[120px]">Imune:</strong> {safeTranslateList(monster.damage_immunities)}
            </div>
        )}
        
        <div className="flex gap-2">
            <strong className="text-stone-800 min-w-[120px]">Sentidos:</strong> 
            {monster.senses ? Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ') : '-'}
        </div>
        
        <div className="flex gap-2">
            <strong className="text-stone-800 min-w-[120px]">Idiomas:</strong> {translateText(monster.languages)}
        </div>
        
        <div className="flex gap-2">
            <strong className="text-stone-800 min-w-[120px]">Desafio (CR):</strong> 
            <span className="font-bold text-emerald-600">{monster.challenge_rating}</span> 
            <span className="text-stone-400">({monster.xp} XP)</span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="border-t border-stone-200 pt-6">
         <h3 className="font-serif text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
            Ações
         </h3>
         <div className="space-y-4">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="text-sm group">
                     <span className="font-bold text-stone-900 border-b border-emerald-200 group-hover:border-emerald-500 transition-colors">{action.name}.</span> <span className="text-stone-700 leading-relaxed" dangerouslySetInnerHTML={{__html: action.desc}} />
                 </div>
             ))}
             {!monster.actions && <p className="text-stone-400 italic">Nenhuma ação listada.</p>}
         </div>
      </div>
      
      {/* Legendary Actions */}
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="border-t border-stone-200 pt-6 mt-6">
            <h3 className="font-serif text-xl font-bold text-amber-700 mb-4">Ações Lendárias</h3>
            <p className="text-xs text-stone-400 mb-4 italic">A criatura pode realizar 3 ações lendárias, escolhendo entre as opções abaixo.</p>
            <div className="space-y-4">
                {monster.legendary_actions.map((action, i) => (
                    <div key={i} className="text-sm">
                        <span className="font-bold text-stone-900">{action.name}.</span> <span className="text-stone-700 leading-relaxed" dangerouslySetInnerHTML={{__html: action.desc}} />
                    </div>
                ))}
            </div>
         </div>
      )}

    </div>
  );
};