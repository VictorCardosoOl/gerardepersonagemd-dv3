import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Swords, Target, Backpack, Feather } from 'lucide-react';
import { IdentityHeader } from './sheet/IdentityHeader';
import { SkillsList } from './sheet/SkillsList';
import { InventoryNotes } from './sheet/InventoryNotes';
import { CombatStats } from './sheet/CombatStats';

interface Props {
  character: Character;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

export const CharacterSheet: React.FC<Props> = ({ character, isEditing = false, onUpdate }) => {

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    if (!onUpdate) return;
    const newAttributes = { ...character.attributes, [key]: value };
    onUpdate({ attributes: newAttributes });
  };

  const handleChange = <K extends keyof Character>(field: K, value: Character[K]) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 space-y-8 print:py-0 print:px-0 print:max-w-none">
        
        {/* --- Header Section --- */}
        <div className="mb-6 relative z-10 animate-fade-in-down">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- Bento Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 print:block">
            
            {/* Area 1: Atributos (Top Strip - 12 cols) */}
            <div className="md:col-span-12 glass-panel rounded-[2rem] p-8 relative overflow-hidden flex flex-wrap justify-between items-center gap-6 bg-void-900/60 shadow-glass border-white/5 print:mb-4">
                {/* Decorative Noise & Line */}
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay print:hidden"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent print:hidden"></div>
                
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="relative z-10 flex-1 min-w-[90px] print:border print:border-black/10 print:rounded print:p-2 print:text-center">
                        <StatBlock 
                            label={key} 
                            value={character.attributes[key]} 
                            modifier={character.modifiers[key]} 
                            isEditing={isEditing}
                            onUpdate={(val) => handleAttributeChange(key, val)}
                        />
                    </div>
                ))}
            </div>

            {/* Print Layout Wrapper for columns */}
            <div className="contents print:grid print:grid-cols-12 print:gap-4">
                {/* Area 2: Combat Vitals (Left Column - 3 cols) */}
                <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-6 h-full print:col-span-4">
                    <div className="glass-panel rounded-[2rem] p-6 relative overflow-hidden h-full bg-gradient-to-b from-void-900/40 to-void-950/60 shadow-glass group border-white/5">
                         {/* Decorative Glows */}
                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-all duration-700 print:hidden"></div>
                         
                         <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-2 border-b border-white/5 pb-4">
                            <Swords size={14} className="text-cyan-400" /> Combate
                         </h3>
                         <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                    </div>
                </div>

                {/* Area 3: Skills Matrix (Center - 5 cols) */}
                <div className="md:col-span-12 lg:col-span-5 h-full print:col-span-4">
                    <div className="glass-panel rounded-[2rem] p-6 h-full relative overflow-hidden bg-void-900/40 shadow-glass border-white/5">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                            <Target size={14} className="text-gold-500" /> Perícias
                        </h3>
                        <div className="relative z-10">
                            <SkillsList skills={character.skills} />
                        </div>
                    </div>
                </div>

                {/* Area 4: Inventory & Lore (Right - 4 cols) */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6 print:col-span-4">
                     {/* Inventory */}
                     <div className="glass-panel rounded-[2rem] p-6 min-h-[350px] relative border-white/5 bg-void-900/40 shadow-glass flex flex-col">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
                            <Backpack size={14} className="text-white" /> Equipamento
                        </h3>
                        <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                     </div>
                     
                     {/* Lore - More opaque for text reading */}
                     <div className="glass-panel rounded-[2rem] p-6 min-h-[250px] relative flex flex-col border-white/5 bg-void-950/60 shadow-glass">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
                            <Feather size={14} className="text-accent-rose" /> Origem
                        </h3>
                        <div className="flex-grow relative">
                            {isEditing ? (
                                <textarea 
                                    value={character.backstory || ''} 
                                    onChange={(e) => handleChange('backstory', e.target.value)}
                                    className="w-full h-full bg-void-950/50 rounded-xl p-4 text-mystic-200 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/30 border border-white/5 resize-none font-body shadow-inner tracking-wide"
                                    placeholder="Escreva a lenda deste herói..."
                                    data-lenis-prevent
                                />
                            ) : (
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 p-1 print:relative print:overflow-visible" data-lenis-prevent>
                                    <p className="text-mystic-300/80 text-sm leading-7 font-body font-light text-balance">
                                        <span className="text-4xl font-display text-white float-left mr-2 mt-[-6px]">{character.backstory?.charAt(0) || "S"}</span>
                                        {character.backstory?.slice(1) || "em história definida para este personagem."}
                                    </p>
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>

        </div>
    );
};