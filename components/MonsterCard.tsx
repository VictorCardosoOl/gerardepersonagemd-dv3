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
    // Component is rendered inside a scrolling container in BestiarySection, 
    // but specific text areas might need lenis prevent if they scroll independently.
    // For this design, the main card flows naturally.
    <div className="w-full max-w-4xl mx-auto relative">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-rose/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Header */}
      <header className="mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-rose">
            <span className="bg-accent-rose/10 px-2 py-1 rounded border border-accent-rose/20">{translateTerm(monster.size)}</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
            <span>{translateTerm(monster.type)}</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
            <span className="text-white opacity-60">{translateTerm(monster.alignment)}</span>
        </div>
        <h2 className="font-display font-black text-6xl md:text-7xl text-white tracking-tight leading-none mb-8 drop-shadow-2xl">
            {monster.name}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-accent-rose to-transparent"></div>
      </header>

      {/* Vitals (Minimal) */}
      <div className="grid grid-cols-3 gap-8 mb-16 border-y border-white/5 py-12">
        <div className="flex flex-col gap-2">
             <span className="text-[10px] uppercase tracking-widest text-mystic-500 font-bold">Classe de Armadura</span>
             <div className="flex items-baseline gap-3">
                <span className="text-5xl font-mono text-white tracking-tighter">{monster.armor_class_value}</span>
                <span className="text-xs text-mystic-500">{monster.armor_class_desc || 'Natural'}</span>
             </div>
        </div>
        <div className="flex flex-col gap-2">
             <span className="text-[10px] uppercase tracking-widest text-mystic-500 font-bold">Pontos de Vida</span>
             <div className="flex items-baseline gap-3">
                <span className="text-5xl font-mono text-white tracking-tighter">{monster.hit_points}</span>
                <span className="text-xs text-mystic-500">{monster.hit_dice}</span>
             </div>
        </div>
        <div className="flex flex-col gap-2">
             <span className="text-[10px] uppercase tracking-widest text-mystic-500 font-bold">Desafio</span>
             <div className="flex items-baseline gap-3">
                <span className="text-5xl font-mono text-white tracking-tighter">{monster.challenge_rating}</span>
                <span className="text-xs text-gold-500 font-bold">{monster.xp} XP</span>
             </div>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-16">
         {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
            const label = translateTerm(attrKey).substring(0,3); 
            const val = monster[attrKey as keyof Monster] as number || 10;
            const mod = Math.floor((val - 10) / 2);
            return (
                <div key={attrKey} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest text-mystic-500 font-bold mb-2">{label}</span>
                    <span className="font-mono text-2xl text-white mb-1">{val}</span>
                    <span className={`text-xs font-bold ${mod >= 0 ? 'text-cyan-400' : 'text-accent-rose'}`}>{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
            )
         })}
      </div>

      {/* Actions (Editorial Style) */}
      <div className="space-y-12">
         <div>
             <h3 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-4">
                <span className="w-8 h-px bg-white/20"></span> Ações
             </h3>
             <div className="space-y-10">
                 {monster.actions?.map((action, i) => (
                     <div key={i} className="group pl-6 border-l-2 border-white/10 hover:border-accent-rose transition-colors">
                         <div className="flex flex-wrap items-baseline gap-3 mb-3">
                            <span className="font-display font-bold text-xl text-white">{translateTerm(action.name)}</span>
                            {action.attack_bonus && <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-cyan-300 font-mono font-bold tracking-wider">+{action.attack_bonus} ACERTO</span>}
                         </div>
                         <p className="text-mystic-300 text-base leading-relaxed font-body" dangerouslySetInnerHTML={{__html: translateDescription(action.desc)}} />
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};