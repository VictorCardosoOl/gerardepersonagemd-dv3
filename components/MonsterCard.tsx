import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity, Zap, Info } from 'lucide-react';
import { translateTerm, translateText } from '../utils/logic';
import { DICTIONARY } from '../constants';

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

  const translateDescription = (text: string) => {
      if (!text) return "";
      let translated = text;
      const terms = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);
      terms.forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          if (regex.test(translated)) {
             translated = translated.replace(regex, (match) => translateTerm(match));
          }
      });
      return translated;
  };

  return (
    <div className="bg-white rounded-[2rem] border border-mystic-100 shadow-xl p-8 max-w-4xl w-full relative animate-scale-in mx-auto mt-4 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mystic-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full text-slate-300 hover:text-void-900 hover:bg-slate-50 transition-colors z-10"
      >
        ✕
      </button>

      {/* Header */}
      <header className="border-b border-mystic-100 pb-8 mb-8 text-center sm:text-left relative z-10">
        <h2 className="font-display font-black text-4xl md:text-5xl text-void-950 tracking-tight mb-3 capitalize">
            {monster.name}
        </h2>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold uppercase tracking-widest">
            <span className="bg-void-950 text-white px-3 py-1.5 rounded-lg">{translateTerm(monster.size)}</span>
            <span className="bg-mystic-100 text-mystic-800 px-3 py-1.5 rounded-lg capitalize">{translateTerm(monster.type)}</span>
            <span className="text-slate-400 italic">{translateTerm(monster.alignment)}</span>
        </div>
      </header>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-scroll-50 p-6 rounded-2xl border border-scroll-200 flex flex-col items-center justify-center text-center">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Shield size={12}/> Armadura</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-void-800">{monster.armor_class_value}</span>
                {monster.armor_class_desc && (
                   <span className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wide">
                     {translateText(monster.armor_class_desc)}
                   </span>
                )}
            </div>
        </div>
        <div className="bg-scroll-50 p-6 rounded-2xl border border-scroll-200 flex flex-col items-center justify-center text-center">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Heart size={12}/> Vida</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-void-800">{monster.hit_points}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Dados: {monster.hit_dice}</span>
             </div>
        </div>
        <div className="bg-scroll-50 p-6 rounded-2xl border border-scroll-200 flex flex-col items-center justify-center text-center">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Skull size={12}/> Desafio</span>
             <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-mono font-bold text-void-800">{monster.challenge_rating}</span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">{monster.xp} XP</span>
             </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-10 bg-white border border-mystic-100 rounded-2xl p-4 overflow-x-auto">
         <div className="flex justify-between min-w-[300px] gap-2">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
                const label = translateTerm(attrKey); 
                const val = monster[attrKey as keyof Monster] as number || 10;
                return (
                    <div key={attrKey} className="flex flex-col items-center flex-1 min-w-[60px]">
                        <span className="font-bold text-slate-400 mb-1 uppercase tracking-widest text-[9px]">{label.substring(0,3)}</span>
                        <span className="font-mono font-bold text-void-900 text-lg">{val}</span>
                        <span className="text-xs text-mystic-600 font-bold">{getMod(val)}</span>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Info Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm">
          <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <Activity size={16} className="text-mystic-500 mt-1 shrink-0" />
                 <div>
                    <strong className="block text-void-900 text-xs uppercase tracking-wide mb-1">Sentidos</strong>
                    <span className="text-slate-600 leading-snug block">
                        {monster.senses ? Object.entries(monster.senses).map(([k,v]) => `${translateTerm(k.replace('_',' '))} ${v}`).join(', ') : '-'}
                    </span>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <Activity size={16} className="text-mystic-500 mt-1 shrink-0" />
                 <div>
                    <strong className="block text-void-900 text-xs uppercase tracking-wide mb-1">Idiomas</strong>
                    <span className="text-slate-600 leading-snug block">{translateText(monster.languages)}</span>
                 </div>
              </div>
          </div>
          
          <div className="space-y-2">
            {safeTranslateList(monster.damage_vulnerabilities) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Vulnerável</span>
                    <span className="text-slate-600 py-0.5">{safeTranslateList(monster.damage_vulnerabilities)}</span>
                </div>
            )}
            {safeTranslateList(monster.damage_resistances) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Resistente</span>
                    <span className="text-slate-600 py-0.5">{safeTranslateList(monster.damage_resistances)}</span>
                </div>
            )}
            {safeTranslateList(monster.damage_immunities) && (
                <div className="flex items-start gap-2 text-xs">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Imune</span>
                    <span className="text-slate-600 py-0.5">{safeTranslateList(monster.damage_immunities)}</span>
                </div>
            )}
          </div>
      </div>

      {/* Actions */}
      <div className="border-t border-mystic-100 pt-8">
         <h3 className="font-display text-xl font-bold text-void-950 mb-6 flex items-center gap-2">
            Ações
         </h3>
         <div className="space-y-8">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="group">
                     <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-bold text-lg text-void-900 border-b border-mystic-200">{translateTerm(action.name)}</span>
                        {action.attack_bonus && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">+{action.attack_bonus} atk</span>}
                     </div>
                     <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: translateDescription(action.desc)}} />
                 </div>
             ))}
         </div>
      </div>
      
      {/* Legendary */}
      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
          <div className="mt-8 pt-8 border-t border-mystic-100">
            <h3 className="font-display text-lg font-bold text-accent-gold mb-2">Ações Lendárias</h3>
            <div className="space-y-4">
                {monster.legendary_actions.map((action, i) => (
                    <div key={i} className="text-sm">
                        <span className="font-bold text-void-900 block mb-1">{translateTerm(action.name)}</span> 
                        <span className="text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{__html: translateDescription(action.desc)}} />
                    </div>
                ))}
            </div>
         </div>
      )}
    </div>
  );
};