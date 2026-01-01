import React from 'react';
import { Attributes, Character } from '../../types';
import { StatBlock } from '../../components/StatBlock';
import { Swords, Target, Backpack, Feather } from 'lucide-react';
import { IdentityHeader } from './IdentityHeader';
import { SkillsList } from '../../components/sheet/SkillsList'; 
import { InventoryNotes } from './InventoryNotes';
import { CombatStats } from '../../components/sheet/CombatStats'; 
import { useCharacter } from '../../context/CharacterContext';

export const CharacterSheet: React.FC = () => {
  const { activeCharacter: character, isEditing, updateCharacter } = useCharacter();

  if (!character) return null;

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    const newAttributes = { ...character.attributes, [key]: value };
    updateCharacter({ attributes: newAttributes });
  };

  // Generic Type Safe Handler
  const handleChange = <K extends keyof Character>(field: K, value: Character[K]) => {
    updateCharacter({ [field]: value });
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12 py-12 space-y-10 print:py-0 print:px-0 print:max-w-none">
        
        {/* --- Header Section --- */}
        <div className="mb-8 relative z-10 animate-fade-in-down">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- Bento Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 print:block">
            
            {/* Area 1: Atributos (Top Strip - 12 cols) */}
            <div className="md:col-span-12 glass-panel rounded-[2.5rem] p-10 relative overflow-hidden flex flex-wrap justify-between items-center gap-8 bg-void-900/60 shadow-glass border-white/5 print:mb-4">
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay print:hidden"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent print:hidden"></div>
                
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="relative z-10 flex-1 min-w-[100px] print:border print:border-black/10 print:rounded print:p-2 print:text-center">
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

            <div className="contents print:grid print:grid-cols-12 print:gap-4">
                {/* Area 2: Combat Vitals (Left Column - 3 cols) */}
                <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-8 h-full print:col-span-4">
                    <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden h-full bg-gradient-to-b from-void-900/40 to-void-950/60 shadow-glass group border-white/5">
                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-all duration-700 print:hidden"></div>
                         <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Swords size={16} className="text-cyan-400" /> Combate
                         </h3>
                         <CombatStats character={character} isEditing={isEditing} onChange={handleChange as any} /> 
                    </div>
                </div>

                {/* Area 3: Skills Matrix (Center - 5 cols) */}
                <div className="md:col-span-12 lg:col-span-5 h-full print:col-span-4">
                    <div className="glass-panel rounded-[2.5rem] p-8 h-full relative overflow-hidden bg-void-900/40 shadow-glass border-white/5">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Target size={16} className="text-gold-500" /> Perícias
                        </h3>
                        <div className="relative z-10">
                            <SkillsList skills={character.skills} />
                        </div>
                    </div>
                </div>

                {/* Area 4: Inventory & Lore (Right - 4 cols) */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-8 print:col-span-4">
                     <div className="glass-panel rounded-[2.5rem] p-8 min-h-[400px] relative border-white/5 bg-void-900/40 shadow-glass flex flex-col">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Backpack size={16} className="text-white" /> Equipamento
                        </h3>
                        <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                     </div>
                     
                     <div className="glass-panel rounded-[2.5rem] p-8 min-h-[300px] relative flex flex-col border-white/5 bg-void-950/60 shadow-glass">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Feather size={16} className="text-accent-rose" /> Origem
                        </h3>
                        <div className="flex-grow relative">
                            {isEditing ? (
                                <textarea 
                                    value={character.backstory || ''} 
                                    onChange={(e) => handleChange('backstory', e.target.value)}
                                    className="w-full h-full bg-void-950/50 rounded-xl p-5 text-mystic-200 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/30 border border-white/5 resize-none font-body shadow-inner tracking-wide"
                                    placeholder="Escreva a lenda deste herói..."
                                    data-lenis-prevent
                                />
                            ) : (
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 p-1 print:relative print:overflow-visible" data-lenis-prevent>
                                    <p className="text-mystic-300/80 text-sm leading-7 font-body font-light text-balance">
                                        <span className="text-5xl font-display text-white float-left mr-3 mt-[-8px] opacity-50">{character.backstory?.charAt(0) || "S"}</span>
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