import React, { useState } from 'react';
import { Attributes, Character } from '../../types';
import { StatBlock } from '../../components/StatBlock';
import { Swords, Target, Backpack, Feather, Shield, Brain, Box } from 'lucide-react';
import { IdentityHeader } from './IdentityHeader';
import { SkillsList } from './SkillsList'; 
import { InventoryNotes } from './InventoryNotes';
import { CombatStats } from './CombatStats'; 
import { useCharacter } from '../../context/CharacterContext';
import { motion } from 'framer-motion';

type SheetTab = 'main' | 'combat' | 'skills' | 'inventory';

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
    // Split by words to be more performant than characters for long texts
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 5,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-mystic-300/90 text-sm leading-7 font-body font-light text-balance relative"
        >
            {/* Initial Drop Cap - Static for design stability */}
            <span className="text-5xl font-display text-white float-left mr-3 mt-[-8px] opacity-50">
                {text.charAt(0) || "S"}
            </span>
            
            {/* The rest of the text typed out */}
            {words.map((word, index) => {
                // Remove first char if it's the first word (since we used Drop Cap)
                const displayWord = index === 0 ? word.slice(1) : word;
                return (
                    <motion.span variants={child} key={index} className="inline-block mr-1">
                        {displayWord}
                    </motion.span>
                );
            })}
            
            {/* Blinking Cursor at end */}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 align-middle"
            />
        </motion.div>
    );
};

export const CharacterSheet: React.FC = () => {
  const { activeCharacter: character, isEditing, updateCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState<SheetTab>('main');

  if (!character) return null;

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    const newAttributes = { ...character.attributes, [key]: value };
    updateCharacter({ attributes: newAttributes });
  };

  const handleChange = <K extends keyof Character>(field: K, value: Character[K]) => {
    updateCharacter({ [field]: value });
  };

  // --- Mobile Tab Button Component ---
  const MobileTabButton = ({ id, icon: Icon, label }: { id: SheetTab, icon: React.ElementType, label: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex flex-col items-center justify-center gap-1 p-2 flex-1 transition-all ${activeTab === id ? 'text-cyan-400' : 'text-mystic-500 hover:text-white'}`}
      >
          <div className={`p-1.5 rounded-full ${activeTab === id ? 'bg-cyan-500/10' : 'bg-transparent'}`}>
            <Icon size={20} className={activeTab === id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      </button>
  );

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-12 py-6 md:py-12 pb-32 md:pb-12 space-y-6 md:space-y-10 print:py-0 print:px-0 print:max-w-none">
        
        {/* --- Header Section (Always Visible) --- */}
        <div className="relative z-10 animate-fade-in-down">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- MOBILE: Tabs Content Switcher --- */}
        {/* Only rendered on mobile via CSS display logic */}
        <div className="block md:hidden">
            {activeTab === 'main' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel rounded-3xl p-6 bg-void-900/60 shadow-glass border-white/5">
                        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                            {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                                <StatBlock 
                                    key={key}
                                    label={key} 
                                    value={character.attributes[key]} 
                                    modifier={character.modifiers[key]} 
                                    isEditing={isEditing}
                                    onUpdate={(val) => handleAttributeChange(key, val)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'combat' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="glass-panel rounded-3xl p-6 bg-gradient-to-b from-void-900/40 to-void-950/60 shadow-glass border-white/5">
                         <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                            <Swords size={16} className="text-cyan-400" /> Combate
                         </h3>
                         <CombatStats character={character} isEditing={isEditing} onChange={handleChange as any} /> 
                    </div>
                </div>
            )}

            {activeTab === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel rounded-3xl p-6 bg-void-900/40 shadow-glass border-white/5">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                            <Target size={16} className="text-gold-500" /> Perícias
                        </h3>
                        <SkillsList skills={character.skills} />
                    </div>
                </div>
            )}

             {activeTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in h-[60vh]">
                     <div className="glass-panel rounded-3xl p-6 h-full flex flex-col bg-void-900/40 shadow-glass border-white/5">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                            <Backpack size={16} className="text-white" /> Equipamento
                        </h3>
                        <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                     </div>
                </div>
            )}
        </div>

        {/* --- DESKTOP: Bento Grid Layout (Hidden on Mobile) --- */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 print:block">
            
            {/* Area 1: Atributos (Top Strip) */}
            <div className="md:col-span-12 glass-panel rounded-[2.5rem] p-10 relative overflow-hidden flex flex-wrap justify-between items-center gap-8 bg-void-900/60 shadow-glass border-white/5 print:mb-4">
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay print:hidden"></div>
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="relative z-10 flex-1 min-w-[100px]">
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
                {/* Area 2: Combat */}
                <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-8 h-full">
                    <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden h-full bg-gradient-to-b from-void-900/40 to-void-950/60 shadow-glass group border-white/5">
                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-[80px] group-hover:bg-cyan-500/10 transition-all duration-700"></div>
                         <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Swords size={16} className="text-cyan-400" /> Combate
                         </h3>
                         <CombatStats character={character} isEditing={isEditing} onChange={handleChange as any} /> 
                    </div>
                </div>

                {/* Area 3: Skills */}
                <div className="md:col-span-12 lg:col-span-5 h-full">
                    <div className="glass-panel rounded-[2.5rem] p-8 h-full relative overflow-hidden bg-void-900/40 shadow-glass border-white/5">
                        <h3 className="font-display font-bold text-mystic-400 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3 border-b border-white/5 pb-5">
                            <Target size={16} className="text-gold-500" /> Perícias
                        </h3>
                        <div className="relative z-10">
                            <SkillsList skills={character.skills} />
                        </div>
                    </div>
                </div>

                {/* Area 4: Inventory & Lore */}
                <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-8">
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
                                <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 p-1" data-lenis-prevent>
                                    <TypewriterText text={character.backstory || "Sem história definida para este personagem."} />
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* --- MOBILE NAVIGATION BAR (Fixed Bottom) --- */}
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="glass-panel rounded-2xl bg-void-950/90 backdrop-blur-xl border-white/10 shadow-2xl p-1 flex justify-around items-center">
                <MobileTabButton id="main" icon={Shield} label="Atributos" />
                <MobileTabButton id="combat" icon={Swords} label="Combate" />
                <MobileTabButton id="skills" icon={Brain} label="Perícias" />
                <MobileTabButton id="inventory" icon={Box} label="Itens" />
            </div>
        </div>

    </div>
  );
};