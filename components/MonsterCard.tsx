import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity, AlertCircle } from 'lucide-react';
import { translateTerm, translateText } from '../utils/logic';

interface Props {
  monster: Monster;
  onClose: () => void;
}

export const MonsterCard: React.FC<Props> = ({ monster, onClose }) => {
  if (!monster) return null;

  const getMod = (val: number) => {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const safeTranslateList = (list: string[]) => {
      if (!list || !Array.isArray(list) || list.length === 0) return null;
      return list.map(item => translateTerm(item)).join(', ');
  };

  // Safe Armor Class Handling (API 5e updated this field to be complex)
  const renderAC = () => {
    if (!monster.armor_class) return '10';
    
    // Check if it's an array (New API format)
    if (Array.isArray(monster.armor_class) && monster.armor_class.length > 0) {
        const ac = monster.armor_class[0];
        return (
            <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{ac.value}</span>
                {ac.type && (
                   <span className="text-[10px] text-stone-400 font-medium mt-1 uppercase tracking-wide">
                     {translateText(ac.type)}
                   </span>
                )}
            </div>
        );
    }
    
    // Fallback for number/string (Old API format)
    return <span className="text-3xl font-mono font-bold text-stone-800">{monster.armor_class}</span>;
  };

  return (
    <div className="bg-white text-stone-800 border border-emerald-100 rounded-2xl shadow-hover p-8 max-w-3xl w-full relative animate-scale-in">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <div className="border-b border-emerald-100 pb-6 mb-8 text-center sm:text-left">
        <h2 className="font-serif font-black text-4xl md:text-5xl text-emerald-900 tracking-tight mb-2 capitalize">{monster.name}</h2>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-stone-500 font-medium">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{translateTerm(monster.size)}</span>
            <span className="bg-stone-50 px-3 py-1 rounded-full capitalize">{translateTerm(monster.type)}</span>
            <span className="italic text-stone-400">{translateTerm(monster.alignment)}</span>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors">
             <Shield size={24} className="text-emerald-600 mb-3 opacity-80" />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Defesa (CA)</span>
             {renderAC()}
        </div>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors">
             <Heart size={24} className="text-emerald-600 mb-3 opacity-80" />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Vida (PV)</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{monster.hit_points}</span>
                <span className="text-[10px] text-stone-400 font-medium mt-1">Dados: {monster.hit_dice}</span>
             </div>
        </div>
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-emerald-200 transition-colors">
             <Activity size={24} className="text-emerald-600 mb-3 opacity-80" />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Desafio (CR)</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{monster.challenge_rating}</span>
                <span className="text-[10px] text-stone-400 font-medium mt-1">{monster.xp} XP</span>
             </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-8 overflow-x-auto pb-2">
         <div className="flex justify-between min-w-[300px] gap-2">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); 
                const val = monster[attrKey as keyof Monster] as number || 10;
                return (
                    <div key={attrKey} className="flex flex-col items-center flex-1">
                        <span className="font-bold text-stone-400 mb-1 uppercase tracking-widest text-[9px]">{label.substring(0,3)}</span>
                        <div className="w-full bg-white p-2 rounded-lg border border-stone-200 text-center shadow-sm">
                            <span className="font-mono font-bold text-emerald-900 text-lg block leading-none">{val}</span>
                            <span className="text-[10px] text-emerald-600 font-bold">{getMod(val)}</span>
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Traits & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
          <div className="space-y-3">
              <div className="flex items-start gap-2">
                 <AlertCircle size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                 <div>
                    <strong className="block text-emerald-900 text-xs uppercase tracking-wide">Sentidos</strong>
                    <span className="text-stone-600">
                        {monster.senses ? Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ') : '-'}
                    </span>
                 </div>
              </div>
              <div className="flex items-start gap-2">
                 <AlertCircle size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                 <div>
                    <strong className="block text-emerald-900 text-xs uppercase tracking-wide">Idiomas</strong>
                    <span className="text-stone-600">{translateText(monster.languages)}</span>
                 </div>
              </div>
          </div>
          
          <div className="space-y-2">
            {safeTranslateList(monster.damage_vulnerabilities) && (
                <div className="bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 text-rose-800 text-xs">
                    <strong>Vulnerável:</strong> {safeTranslateList(monster.damage_vulnerabilities)}
                </div>
            )}
            {safeTranslateList(monster.damage_resistances) && (
                <div className="bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 text-amber-800 text-xs">
                    <strong>Resistente:</strong> {safeTranslateList(monster.damage_resistances)}
                </div>
            )}
            {safeTranslateList(monster.damage_immunities) && (
                <div className="bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 text-emerald-800 text-xs">
                    <strong>Imune:</strong> {safeTranslateList(monster.damage_immunities)}
                </div>
            )}
          </div>
      </div>

      {/* Actions Section */}
      <div className="border-t border-stone-100 pt-6">
         <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            Ações
         </h3>
         <div className="space-y-6">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="group">
                     <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-lg text-emerald-800">{action.name}</span>
                     </div>
                     <p className="text-stone-600 text-sm leading-relaxed pl-4 border-l-2 border-emerald-100 group-hover:border-emerald-400 transition-colors" dangerouslySetInnerHTML={{__html: action.desc}} />
                 </div>
             ))}
             {!monster.actions && <p className="text-stone-400 italic">Nenhuma ação listada.</p>}
         </div>
      </div>
      
      {/* Legendary Actions */}
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="bg-stone-50 rounded-xl p-6 mt-8 border border-stone-100">
            <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">Ações Lendárias</h3>
            <p className="text-xs text-stone-500 mb-4">A criatura pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma opção pode ser usada por vez e somente no final do turno de outra criatura.</p>
            <div className="space-y-4">
                {monster.legendary_actions.map((action, i) => (
                    <div key={i} className="text-sm">
                        <span className="font-bold text-stone-900 block mb-1">{action.name}</span> 
                        <span className="text-stone-600 leading-relaxed" dangerouslySetInnerHTML={{__html: action.desc}} />
                    </div>
                ))}
            </div>
         </div>
      )}
    </div>
  );
};