import React, { useMemo } from 'react';
import { Monster } from '../types';
import { translateTerm } from '../utils/logic';
import { DICTIONARY } from '../constants';
import { Shield, Skull, Zap, Eye, BookOpen, Swords } from 'lucide-react';

interface Props {
  monster: Monster;
  onClose: () => void;
}

const DICTIONARY_KEYS = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);
const TRANSLATION_REGEX = new RegExp(`\\b(${DICTIONARY_KEYS.join('|')})\\b`, 'gi');

export const MonsterCard: React.FC<Props> = ({ monster, onClose }) => {
  if (!monster) return null;

  const renderTranslatedDescription = (text: string) => {
      if (!text) return "";
      return text.replace(TRANSLATION_REGEX, (match) => translateTerm(match));
  };

  const hasSaves = monster.saving_throws && monster.saving_throws.length > 0;
  const hasSkills = monster.skills && monster.skills.length > 0;
  const hasAbilities = monster.special_abilities && monster.special_abilities.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto relative" data-lenis-prevent>
      
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

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-y border-white/5 py-10 bg-white/[0.02] rounded-2xl p-6">
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-mystic-500 mb-1">
                 <Shield size={14} />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Defesa (CA)</span>
             </div>
             <div className="flex items-baseline gap-3">
                <span className="text-4xl font-mono text-white tracking-tighter">{monster.armor_class_value}</span>
                <span className="text-xs text-mystic-500 leading-tight max-w-[100px]">{monster.armor_class_desc || 'Natural'}</span>
             </div>
        </div>
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-mystic-500 mb-1">
                 <Zap size={14} />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Pontos de Vida</span>
             </div>
             <div className="flex items-baseline gap-3">
                <span className="text-4xl font-mono text-white tracking-tighter">{monster.hit_points}</span>
                <span className="text-xs text-mystic-500">{monster.hit_dice}</span>
             </div>
        </div>
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-mystic-500 mb-1">
                 <Skull size={14} />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Desafio (CR)</span>
             </div>
             <div className="flex items-baseline gap-3">
                <span className="text-4xl font-mono text-white tracking-tighter">{monster.challenge_rating}</span>
                <span className="text-xs text-gold-500 font-bold bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">{monster.xp} XP</span>
             </div>
        </div>
      </div>

      {/* Attributes Matrix */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-12">
         {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
            const label = translateTerm(attrKey).substring(0,3); 
            const val = monster[attrKey as keyof Monster] as number || 10;
            const mod = Math.floor((val - 10) / 2);
            return (
                <div key={attrKey} className="flex flex-col items-center text-center p-3 rounded-xl bg-void-950/50 border border-white/10">
                    <span className="text-[9px] uppercase tracking-widest text-mystic-500 font-bold mb-1">{label}</span>
                    <span className="font-mono text-xl text-white">{val}</span>
                    <span className={`text-[10px] font-bold ${mod >= 0 ? 'text-cyan-400' : 'text-accent-rose'}`}>{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
            )
         })}
      </div>

      {/* Secondary Stats (Saves, Skills, Senses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-sm text-mystic-300 leading-relaxed bg-void-900/30 p-6 rounded-2xl border border-white/5">
         
         {/* Left Col */}
         <div className="space-y-4">
             {hasSaves && (
                 <div className="flex gap-2">
                     <span className="font-bold text-white shrink-0">Salvaguardas:</span>
                     <span className="text-cyan-300">
                         {monster.saving_throws?.map(st => `${translateTerm(st.name)} +${st.value}`).join(", ")}
                     </span>
                 </div>
             )}
             {hasSkills && (
                 <div className="flex gap-2">
                     <span className="font-bold text-white shrink-0">Perícias:</span>
                     <span className="text-gold-300">
                         {monster.skills?.map(sk => `${translateTerm(sk.name)} +${sk.value}`).join(", ")}
                     </span>
                 </div>
             )}
              {monster.damage_immunities.length > 0 && (
                 <div className="flex gap-2">
                     <span className="font-bold text-white shrink-0">Imunidade a Dano:</span>
                     <span>{monster.damage_immunities.map(translateTerm).join(", ")}</span>
                 </div>
             )}
         </div>

         {/* Right Col */}
         <div className="space-y-4">
             <div className="flex gap-2">
                 <span className="font-bold text-white shrink-0">Sentidos:</span>
                 <span>
                     {Object.entries(monster.senses).map(([k, v]) => `${translateTerm(k)} ${v}`).join(", ")}
                 </span>
             </div>
             <div className="flex gap-2">
                 <span className="font-bold text-white shrink-0">Idiomas:</span>
                 <span>{monster.languages || "-"}</span>
             </div>
         </div>
      </div>

      {/* Traits (Special Abilities) */}
      {hasAbilities && (
          <div className="mb-12">
            <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3">
                <Eye size={20} className="text-cyan-400" /> Traços & Habilidades
            </h3>
            <div className="space-y-6">
                {monster.special_abilities?.map((ability, i) => (
                    <div key={i} className="text-mystic-300">
                        <strong className="text-white font-bold italic">{ability.name}.</strong> <span dangerouslySetInnerHTML={{__html: renderTranslatedDescription(ability.desc)}} />
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* Actions */}
      <div>
         <h3 className="font-display font-bold text-2xl text-white mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
            <Swords size={24} className="text-accent-rose" /> Ações
         </h3>
         <div className="space-y-8">
             {monster.actions?.map((action, i) => (
                 <div key={i} className="group pl-4 border-l-2 border-white/10 hover:border-accent-rose transition-colors">
                     <div className="flex flex-wrap items-baseline gap-3 mb-2">
                        <span className="font-display font-bold text-lg text-white">{translateTerm(action.name)}</span>
                        {action.attack_bonus && <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-cyan-300 font-mono font-bold tracking-wider">+{action.attack_bonus} ACERTO</span>}
                     </div>
                     <p className="text-mystic-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: renderTranslatedDescription(action.desc)}} />
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};