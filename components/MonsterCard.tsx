import React from 'react';
import { Monster } from '../types';
import { Skull, Shield, Heart, Activity } from 'lucide-react';
import { translateTerm, translateText } from '../utils/logic';
import { DICTIONARY } from '../constants';

interface Props {
  monster: Monster;
  onClose: () => void;
}

const DICTIONARY_KEYS = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);

export const MonsterCard: React.FC<Props> = ({ monster, onClose }) => {
  if (!monster) return null;

  const translateDescription = (text: string) => {
      if (!text) return "";
      let translated = text;
      DICTIONARY_KEYS.forEach(term => {
          const regex = new RegExp(`\\b${term}\\b`, 'gi');
          if (regex.test(translated)) {
             translated = translated.replace(regex, (match) => translateTerm(match));
          }
      });
      return translated;
  };

  return (
    // ADDED data-lenis-prevent HERE
    <div className="h-full w-full max-w-2xl ml-auto bg-obsidian-950/40 backdrop-blur-2xl border-l border-white/10 p-12 overflow-y-auto custom-scrollbar relative" data-lenis-prevent>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-champagne-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="mb-12 relative z-10">
        <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-champagne-500/80">
            <span>{translateTerm(monster.size)}</span>
            <span className="w-1 h-1 rounded-full bg-current"></span>
            <span>{translateTerm(monster.type)}</span>
            <span className="w-1 h-1 rounded-full bg-current"></span>
            <span>{translateTerm(monster.alignment)}</span>
        </div>
        <h2 className="font-display font-medium text-6xl text-white tracking-tight leading-none mb-6">
            {monster.name}
        </h2>
        <div className="w-12 h-1 bg-champagne-500"></div>
      </header>

      {/* Vitals (Minimal) */}
      <div className="grid grid-cols-3 gap-8 mb-16 border-b border-white/5 pb-12">
        <div className="flex flex-col">
             <span className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Armor Class</span>
             <span className="text-4xl font-mono text-white">{monster.armor_class_value}</span>
             <span className="text-xs text-zinc-600 mt-1">{monster.armor_class_desc || 'Natural'}</span>
        </div>
        <div className="flex flex-col">
             <span className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Hit Points</span>
             <span className="text-4xl font-mono text-white">{monster.hit_points}</span>
             <span className="text-xs text-zinc-600 mt-1">{monster.hit_dice}</span>
        </div>
        <div className="flex flex-col">
             <span className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Challenge</span>
             <span className="text-4xl font-mono text-white">{monster.challenge_rating}</span>
             <span className="text-xs text-zinc-600 mt-1">{monster.xp} XP</span>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-6 gap-2 mb-16">
         {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
            const label = translateTerm(attrKey).substring(0,3); 
            const val = monster[attrKey as keyof Monster] as number || 10;
            const mod = Math.floor((val - 10) / 2);
            return (
                <div key={attrKey} className="flex flex-col items-center text-center">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">{label}</span>
                    <span className="font-mono text-lg text-white">{val}</span>
                    <span className="text-[10px] text-champagne-500">{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
            )
         })}
      </div>

      {/* Actions (Editorial Style) */}
      <div className="space-y-12">
         <div>
             <h3 className="font-display text-2xl text-white mb-8 flex items-center gap-4">
                <span className="w-8 h-px bg-white/20"></span> Ações
             </h3>
             <div className="space-y-8">
                 {monster.actions?.map((action, i) => (
                     <div key={i} className="group">
                         <div className="flex items-baseline gap-3 mb-2">
                            <span className="font-serif text-xl italic text-champagne-100">{translateTerm(action.name)}</span>
                            {action.attack_bonus && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-zinc-300 font-mono">+{action.attack_bonus} HIT</span>}
                         </div>
                         <p className="text-zinc-400 text-sm leading-7 font-serif" dangerouslySetInnerHTML={{__html: translateDescription(action.desc)}} />
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};