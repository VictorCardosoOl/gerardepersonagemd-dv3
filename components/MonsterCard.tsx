import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity, AlertCircle, Zap } from 'lucide-react';
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

  // --- CRITICAL FIX FOR API CHANGE ---
  // The D&D 5e API changed 'armor_class' from a number to an array of objects.
  // Example: [{ "type": "armor", "value": 18, "armor": [{ "index": "plate", "name": "Plate" }] }]
  const renderAC = () => {
    if (!monster.armor_class) return <span className="text-3xl font-mono font-bold text-stone-800">10</span>;
    
    // New API Format (Array)
    if (Array.isArray(monster.armor_class) && monster.armor_class.length > 0) {
        const acData = monster.armor_class[0];
        return (
            <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{acData.value}</span>
                {acData.type && (
                   <span className="text-[10px] text-stone-400 font-medium mt-1 uppercase tracking-wide">
                     {translateText(acData.type)}
                   </span>
                )}
            </div>
        );
    }
    
    // Fallback (Old API Format or Simple Number)
    return <span className="text-3xl font-mono font-bold text-stone-800">{monster.armor_class}</span>;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-hover p-8 max-w-4xl w-full relative animate-scale-in mx-auto mt-4">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition-colors z-10"
      >
        ✕
      </button>

      {/* Header */}
      <header className="border-b border-emerald-100 pb-8 mb-8 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
            <Skull size={120} />
        </div>
        <h2 className="font-serif font-black text-4xl md:text-5xl text-emerald-900 tracking-tight mb-3 capitalize relative z-10">
            {monster.name}
        </h2>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold uppercase tracking-widest relative z-10">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded border border-emerald-100">{translateTerm(monster.size)}</span>
            <span className="bg-stone-50 text-stone-600 px-3 py-1.5 rounded border border-stone-200 capitalize">{translateTerm(monster.type)}</span>
            <span className="text-stone-400 italic">{translateTerm(monster.alignment)}</span>
        </div>
      </header>

      {/* Vitals Grid (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-emerald-300 transition-colors">
             <Shield size={28} className="text-emerald-600 mb-3 opacity-80 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Classe de Armadura</span>
             {renderAC()}
        </div>
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-rose-300 transition-colors">
             <Heart size={28} className="text-rose-500 mb-3 opacity-80 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Pontos de Vida</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{monster.hit_points}</span>
                <span className="text-[10px] text-stone-400 font-medium mt-1">Dados: {monster.hit_dice}</span>
             </div>
        </div>
        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
             <Zap size={28} className="text-amber-500 mb-3 opacity-80 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Desafio (CR)</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-stone-800">{monster.challenge_rating}</span>
                <span className="text-[10px] text-stone-400 font-medium mt-1">{monster.xp} XP</span>
             </div>
        </div>
      </div>

      {/* Ability Scores Table */}
      <div className="mb-10 overflow-x-auto pb-2">
         <div className="flex justify-between min-w-[300px] gap-2 md:gap-4">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); 
                const val = monster[attrKey as keyof Monster] as number || 10;
                return (
                    <div key={attrKey} className="flex flex-col items-center flex-1 min-w-[60px]">
                        <span className="font-bold text-stone-400 mb-2 uppercase tracking-widest text-[9px]">{label.substring(0,3)}</span>
                        <div className="w-full bg-white p-3 rounded-xl border border-stone-200 text-center shadow-sm flex flex-col items-center justify-center h-20">
                            <span className="font-mono font-bold text-emerald-900 text-xl block leading-none mb-1">{val}</span>
                            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded">{getMod(val)}</span>
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Info Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm">
          <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100">
                 <Activity size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                 <div>
                    <strong className="block text-emerald-900 text-xs uppercase tracking-wide mb-0.5">Sentidos</strong>
                    <span className="text-stone-600 leading-snug block">
                        {monster.senses ? Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ') : '-'}
                    </span>
                 </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100">
                 <Activity size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                 <div>
                    <strong className="block text-emerald-900 text-xs uppercase tracking-wide mb-0.5">Idiomas</strong>
                    <span className="text-stone-600 leading-snug block">{translateText(monster.languages)}</span>
                 </div>
              </div>
          </div>
          
          <div className="space-y-2">
            {safeTranslateList(monster.damage_vulnerabilities) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Vulnerável</span>
                    <span className="text-stone-600 py-0.5">{safeTranslateList(monster.damage_vulnerabilities)}</span>
                </div>
            )}
            {safeTranslateList(monster.damage_resistances) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Resistente</span>
                    <span className="text-stone-600 py-0.5">{safeTranslateList(monster.damage_resistances)}</span>
                </div>
            )}
            {safeTranslateList(monster.damage_immunities) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Imune</span>
                    <span className="text-stone-600 py-0.5">{safeTranslateList(monster.damage_immunities)}</span>
                </div>
            )}
            {monster.condition_immunities && monster.condition_immunities.length > 0 && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Condições</span>
                    <span className="text-stone-600 py-0.5">{monster.condition_immunities.map(c => translateTerm(c.name)).join(', ')}</span>
                </div>
            )}
          </div>
      </div>

      {/* Actions */}
      <div className="border-t border-stone-200 pt-8">
         <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            Ações
         </h3>
         <div className="space-y-6">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="group pl-4 border-l-2 border-emerald-200 hover:border-emerald-500 transition-colors">
                     <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-lg text-emerald-800">{action.name}</span>
                        {action.attack_bonus && <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-500 font-mono">+{action.attack_bonus} atk</span>}
                     </div>
                     <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: action.desc}} />
                 </div>
             ))}
             {!monster.actions && <p className="text-stone-400 italic">Nenhuma ação listada.</p>}
         </div>
      </div>
      
      {/* Legendary */}
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="bg-stone-50 rounded-xl p-8 mt-10 border border-stone-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2 relative z-10">Ações Lendárias</h3>
            <p className="text-xs text-stone-500 mb-6 relative z-10">A criatura pode realizar 3 ações lendárias no final do turno de outra criatura.</p>
            <div className="space-y-4 relative z-10">
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