
import React from 'react';
import { Monster } from './types';
import { translateTerm } from '../../utils/formatters';
import { DICTIONARY } from '../../constants';
import { Shield, Skull, Zap, Eye, Swords, Activity, Heart, Ghost, AlertTriangle, BookOpen, Anchor } from 'lucide-react';

interface Props {
  monster: Monster;
  onClose: () => void;
}

const DICTIONARY_KEYS = Object.keys(DICTIONARY).sort((a, b) => b.length - a.length);
const TRANSLATION_REGEX = new RegExp(`\\b(${DICTIONARY_KEYS.join('|')})\\b`, 'gi');

export const MonsterCard: React.FC<Props> = ({ monster }) => {
  if (!monster) return null;

  const renderTranslatedDescription = (text: string) => {
      if (!text) return "";
      return text.replace(TRANSLATION_REGEX, (match) => translateTerm(match));
  };

  const hasSaves = monster.saving_throws && monster.saving_throws.length > 0;
  const hasSkills = monster.skills && monster.skills.length > 0;
  const hasAbilities = monster.special_abilities && monster.special_abilities.length > 0;
  const hasResistances = monster.damage_resistances.length > 0;
  const hasImmunities = monster.damage_immunities.length > 0;
  const hasCondImmunities = monster.condition_immunities.length > 0;

  // Cor baseada no tipo (sutil)
  const accentColor = monster.type.toLowerCase().includes('drag') ? 'text-rose-400' : 
                      monster.type.toLowerCase().includes('morto') ? 'text-purple-400' : 'text-cyan-400';
  const glowColor = monster.type.toLowerCase().includes('drag') ? 'bg-rose-500/20' : 
                    monster.type.toLowerCase().includes('morto') ? 'bg-purple-500/20' : 'bg-cyan-500/20';

  return (
    <div className="w-full max-w-5xl mx-auto relative animate-fade-in pb-16" data-lenis-prevent>
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${glowColor} rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-30`}></div>

      {/* --- HEADER --- */}
      <header className="mb-10 relative z-10 border-b border-white/5 pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-[0.25em]">
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-mystic-300 backdrop-blur-sm">{translateTerm(monster.size)}</span>
            <span className={`px-3 py-1 rounded-full border border-white/10 bg-void-950/50 backdrop-blur-sm ${accentColor}`}>{translateTerm(monster.type)}</span>
            <span className="text-mystic-500">{translateTerm(monster.alignment)}</span>
        </div>
        
        <div className="flex justify-between items-end gap-4">
            <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
                {monster.name}
            </h2>
            <div className="text-right shrink-0 flex flex-col items-end">
                <span className="block text-[10px] uppercase tracking-widest text-mystic-500 mb-1">Nível de Desafio</span>
                <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-4xl text-gold-400 text-shadow-glow">{monster.challenge_rating}</span>
                    <span className="block text-xs font-mono text-gold-500/60 bg-gold-500/5 px-2 py-1 rounded border border-gold-500/10">{monster.xp} XP</span>
                </div>
            </div>
        </div>
      </header>

      {/* --- VITALS (AC, HP, SPEED) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-5 rounded-3xl bg-void-950/40 border-white/5 flex items-center gap-5 group hover:border-cyan-500/30 transition-all duration-500 hover:bg-white/[0.02]">
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500 shadow-glow-cyan">
                <Shield size={28} strokeWidth={1.5} />
            </div>
            <div>
                <span className="block text-[9px] uppercase tracking-widest text-mystic-500 font-bold mb-1">Classe de Armadura</span>
                <div className="flex flex-col">
                    <span className="text-3xl font-mono text-white font-bold tracking-tighter">{monster.armor_class_value}</span>
                    <span className="text-[10px] text-mystic-400 italic truncate max-w-[140px] opacity-70 group-hover:opacity-100 transition-opacity">{translateTerm(monster.armor_class_desc || "Natural")}</span>
                </div>
            </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl bg-void-950/40 border-white/5 flex items-center gap-5 group hover:border-rose-500/30 transition-all duration-500 hover:bg-white/[0.02]">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]">
                <Heart size={28} strokeWidth={1.5} />
            </div>
            <div>
                <span className="block text-[9px] uppercase tracking-widest text-mystic-500 font-bold mb-1">Pontos de Vida</span>
                <div className="flex flex-col">
                    <span className="text-3xl font-mono text-white font-bold tracking-tighter">{monster.hit_points}</span>
                    <span className="text-[10px] text-mystic-400 font-mono opacity-70 group-hover:opacity-100 transition-opacity">({monster.hit_dice})</span>
                </div>
            </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl bg-void-950/40 border-white/5 flex items-center gap-5 group hover:border-emerald-500/30 transition-all duration-500 hover:bg-white/[0.02]">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                <Activity size={28} strokeWidth={1.5} />
            </div>
            <div>
                <span className="block text-[9px] uppercase tracking-widest text-mystic-500 font-bold mb-1">Deslocamento</span>
                <span className="text-lg font-body text-white font-medium leading-tight">
                    {Object.entries(monster.speed).map(([k, v]) => `${translateTerm(k)} ${v}`).join(", ")}
                </span>
            </div>
        </div>
      </div>

      {/* --- ATTRIBUTES MATRIX --- */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-10">
         {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((attrKey) => {
            const label = translateTerm(attrKey).substring(0,3); 
            const val = monster[attrKey as keyof Monster] as number || 10;
            const mod = Math.floor((val - 10) / 2);
            const modStr = mod >= 0 ? `+${mod}` : mod;
            return (
                <div key={attrKey} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group">
                    <span className="text-[9px] uppercase tracking-widest text-mystic-500 font-bold mb-2 group-hover:text-cyan-400 transition-colors">{label}</span>
                    <span className="font-display font-bold text-2xl text-white group-hover:scale-110 transition-transform duration-300">{modStr}</span>
                    <span className="text-[10px] font-mono text-mystic-600 bg-black/20 px-2 py-0.5 rounded-md mt-2 border border-white/5">{val}</span>
                </div>
            )
         })}
      </div>

      {/* --- DETAILED STATS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
         
         {/* Left Column: Skills & Saves (5 cols) */}
         <div className="lg:col-span-5 space-y-6">
             {hasSaves && (
                 <div className="bg-void-950/40 p-6 rounded-[1.5rem] border border-white/5 hover:border-cyan-500/20 transition-colors">
                     <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-mystic-500 font-bold mb-4">
                        <Anchor size={12} /> Salvaguardas
                     </span>
                     <div className="flex flex-wrap gap-2">
                        {monster.saving_throws?.map(st => (
                            <span key={st.name} className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:bg-cyan-950/40 transition-colors cursor-default">
                                {translateTerm(st.name)} <span className="text-white ml-1">+{st.value}</span>
                            </span>
                        ))}
                     </div>
                 </div>
             )}
             
             {hasSkills && (
                 <div className="bg-void-950/40 p-6 rounded-[1.5rem] border border-white/5 hover:border-gold-500/20 transition-colors">
                     <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-mystic-500 font-bold mb-4">
                        <BookOpen size={12} /> Perícias
                     </span>
                     <div className="flex flex-wrap gap-2">
                        {monster.skills?.map(sk => (
                            <span key={sk.name} className="text-xs font-body text-mystic-200 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                                {translateTerm(sk.name)} <span className="text-gold-400 font-mono font-bold group-hover:text-gold-300">+{sk.value}</span>
                            </span>
                        ))}
                     </div>
                 </div>
             )}

             <div className="bg-void-950/40 p-6 rounded-[1.5rem] border border-white/5">
                 <div className="space-y-4">
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-mystic-500 font-bold mb-1">Sentidos</span>
                        <p className="text-sm text-mystic-300 font-light leading-relaxed">
                            {Object.entries(monster.senses).map(([k, v]) => `${translateTerm(k)} ${v}`).join(", ")}
                        </p>
                     </div>
                     <div>
                        <span className="block text-[10px] uppercase tracking-widest text-mystic-500 font-bold mb-1">Idiomas</span>
                        <p className="text-sm text-mystic-300 font-light leading-relaxed">{monster.languages || "-"}</p>
                     </div>
                 </div>
             </div>
         </div>

         {/* Right Column: Resistances & Immunities (7 cols) */}
         <div className="lg:col-span-7">
             {(hasResistances || hasImmunities || hasCondImmunities) ? (
                 <div className="bg-void-950/40 p-6 rounded-[1.5rem] border border-white/5 h-full relative overflow-hidden group hover:border-rose-500/20 transition-colors">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Shield size={120} />
                     </div>
                     
                     <div className="relative z-10 space-y-6">
                        {hasImmunities && (
                             <div>
                                 <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-3">
                                     <Shield size={12} className="fill-current" /> Imunidade a Dano
                                 </span>
                                 <div className="flex flex-wrap gap-2">
                                     {monster.damage_immunities.map(dt => (
                                         <span key={dt} className="text-xs text-rose-200 bg-rose-950/30 px-3 py-1 rounded-full border border-rose-500/20 capitalize">
                                             {translateTerm(dt)}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         )}
                         
                         {hasResistances && (
                             <div>
                                 <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold-400 font-bold mb-3">
                                     <Shield size={12} /> Resistência a Dano
                                 </span>
                                 <div className="flex flex-wrap gap-2">
                                     {monster.damage_resistances.map(dt => (
                                         <span key={dt} className="text-xs text-gold-200 bg-gold-950/30 px-3 py-1 rounded-full border border-gold-500/20 capitalize">
                                             {translateTerm(dt)}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         )}

                         {hasCondImmunities && (
                             <div>
                                 <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-mystic-400 font-bold mb-3">
                                     <Ghost size={12} /> Imunidade a Condição
                                 </span>
                                 <div className="flex flex-wrap gap-2">
                                     {monster.condition_immunities.map(c => (
                                         <span key={c.name} className="text-xs text-mystic-300 bg-white/5 px-3 py-1 rounded-full border border-white/5 capitalize">
                                             {translateTerm(c.name)}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             ) : (
                 <div className="bg-void-950/40 p-6 rounded-[1.5rem] border border-white/5 h-full flex flex-col items-center justify-center opacity-50">
                     <Shield size={48} className="text-mystic-600 mb-2" strokeWidth={1} />
                     <p className="text-xs uppercase tracking-widest text-mystic-500">Sem resistências especiais</p>
                 </div>
             )}
         </div>
      </div>

      {/* --- TRAITS & ACTIONS SECTION --- */}
      <div className="space-y-12">
          
          {hasAbilities && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="p-2 rounded-lg bg-cyan-950/30 text-cyan-400 border border-cyan-500/20">
                        <Eye size={20} />
                    </div>
                    Traços Especiais
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {monster.special_abilities?.map((ability, i) => (
                        <div key={i} className="bg-gradient-to-r from-white/[0.03] to-transparent p-5 rounded-2xl border-l-2 border-cyan-500/50 hover:border-cyan-400 transition-colors group">
                            <strong className="text-cyan-100 font-bold block mb-2 font-display text-lg tracking-wide group-hover:text-cyan-400 transition-colors">{translateTerm(ability.name)}</strong> 
                            <div className="text-mystic-300 text-sm leading-7 font-light" dangerouslySetInnerHTML={{__html: renderTranslatedDescription(ability.desc)}} />
                        </div>
                    ))}
                </div>
              </div>
          )}

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-500/20">
                    <Swords size={20} />
                </div>
                Ações
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {monster.actions?.map((action, i) => (
                     <div key={i} className="group p-6 rounded-3xl border border-white/5 bg-void-950/60 hover:bg-white/[0.02] hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-lg">
                         <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <span className="font-display font-bold text-lg text-white group-hover:text-rose-400 transition-colors border-b border-transparent group-hover:border-rose-500/30 pb-0.5">
                                {translateTerm(action.name)}
                            </span>
                            {action.attack_bonus && (
                                <span className="text-[10px] bg-rose-500/10 px-2 py-1 rounded text-rose-400 font-mono font-bold tracking-wider border border-rose-500/20 shadow-glow-rose">
                                    +{action.attack_bonus} ACERTO
                                </span>
                            )}
                         </div>
                         <div className="text-mystic-300 text-sm leading-relaxed font-light" dangerouslySetInnerHTML={{__html: renderTranslatedDescription(action.desc)}} />
                     </div>
                 ))}
             </div>
          </div>

          {monster.legendary_actions && monster.legendary_actions.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="font-display font-bold text-xl text-gold-400 mb-6 flex items-center gap-3 border-b border-gold-500/20 pb-4 mt-8">
                    <div className="p-2 rounded-lg bg-gold-950/30 text-gold-400 border border-gold-500/20">
                        <AlertTriangle size={20} />
                    </div>
                    Ações Lendárias
                </h3>
                <p className="text-sm text-mystic-400 italic mb-6">
                    A criatura pode realizar 3 ações lendárias, escolhendo entre as opções abaixo. Apenas uma ação lendária pode ser usada por vez e apenas no final do turno de outra criatura. A criatura recupera as ações lendárias gastas no início do turno dela.
                </p>
                <div className="grid grid-cols-1 gap-4">
                    {monster.legendary_actions.map((action, i) => (
                        <div key={i} className="bg-gold-900/5 p-5 rounded-2xl border border-gold-500/10 hover:border-gold-500/30 transition-colors">
                            <strong className="text-gold-200 font-bold block mb-1 font-display text-lg tracking-wide">{translateTerm(action.name)}</strong> 
                            <div className="text-mystic-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: renderTranslatedDescription(action.desc)}} />
                        </div>
                    ))}
                </div>
              </div>
          )}
      </div>
    </div>
  );
};
