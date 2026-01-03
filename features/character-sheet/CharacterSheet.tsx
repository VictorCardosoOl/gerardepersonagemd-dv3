
import React, { useState } from 'react';
import { Attributes, Character } from '../../types';
import { StatBlock } from '../../components/StatBlock';
import { Swords, Target, Backpack, Feather, Shield, Brain, Box, ScrollText } from 'lucide-react';
import { IdentityHeader } from './IdentityHeader';
import { SkillsList } from './SkillsList'; 
import { InventoryNotes } from './InventoryNotes';
import { CombatStats } from './CombatStats'; 
import { useCharacter } from '../../context/CharacterContext';
import { motion, AnimatePresence } from 'framer-motion';

type SheetTab = 'main' | 'combat' | 'skills' | 'inventory';

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.01, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 5,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-mystic-300/90 text-sm leading-7 font-body font-light text-justify tracking-wide"
        >
            <span className="text-5xl font-display text-white float-left mr-3 mt-[-8px] opacity-80 drop-shadow-md">
                {text.charAt(0) || "S"}
            </span>
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="inline-block mr-1">
                    {index === 0 ? word.slice(1) : word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const SectionHeader: React.FC<{ icon: React.ElementType, title: string, color?: string }> = ({ icon: Icon, title, color = "text-white" }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 select-none">
        <div className={`p-2 rounded-xl bg-white/[0.03] border border-white/5 ${color.replace('text-', 'text-opacity-80 ')}`}>
            <Icon size={18} className={color} />
        </div>
        <h3 className="font-display font-bold text-xs uppercase tracking-[0.25em] text-mystic-400">{title}</h3>
    </div>
);

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

  const MobileTabButton = ({ id, icon: Icon, label }: { id: SheetTab, icon: React.ElementType, label: string }) => {
      const isActive = activeTab === id;
      return (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center gap-1 p-2 flex-1 transition-all duration-300 relative ${isActive ? 'text-cyan-400' : 'text-mystic-600 hover:text-mystic-300'}`}
        >
            {isActive && (
                <motion.div layoutId="mobile-tab-glow" className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full" />
            )}
            <div className={`p-2 rounded-full relative z-10 ${isActive ? 'bg-cyan-950/50 border border-cyan-500/30' : 'bg-transparent border border-transparent'}`}>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider relative z-10">{label}</span>
        </button>
      );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 py-6 md:py-10 pb-32 md:pb-12 space-y-8 print:py-0 print:px-0 print:max-w-none">
        
        {/* --- Header Section (Always Visible) --- */}
        <div className="relative z-20 animate-fade-in-down">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- MOBILE VIEW: Tabs Layout --- */}
        <div className="block lg:hidden relative z-10 min-h-[60vh]">
            <AnimatePresence mode="wait">
                {activeTab === 'main' && (
                    <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="glass-panel rounded-[2rem] p-6 bg-void-950/40 shadow-glass border-white/5">
                            <SectionHeader icon={Shield} title="Atributos Principais" color="text-cyan-400" />
                            <div className="grid grid-cols-2 gap-4">
                                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key, i) => (
                                    <div key={key} className="h-44">
                                        <StatBlock 
                                            label={key} 
                                            value={character.attributes[key]} 
                                            modifier={character.modifiers[key]} 
                                            isEditing={isEditing}
                                            onUpdate={(val) => handleAttributeChange(key, val)}
                                            delay={i * 0.05}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'combat' && (
                    <motion.div key="combat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                         <div className="glass-panel rounded-[2rem] p-6 bg-gradient-to-b from-void-950/60 to-void-900/40 shadow-glass border-white/5">
                             <SectionHeader icon={Swords} title="Combate & Vitalidade" color="text-rose-400" />
                             <CombatStats character={character} isEditing={isEditing} onChange={handleChange as any} /> 
                        </div>
                    </motion.div>
                )}

                {activeTab === 'skills' && (
                    <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="glass-panel rounded-[2rem] p-6 bg-void-950/40 shadow-glass border-white/5">
                            <SectionHeader icon={Target} title="Perícias & Talentos" color="text-gold-400" />
                            <SkillsList skills={character.skills} />
                        </div>
                    </motion.div>
                )}

                 {activeTab === 'inventory' && (
                    <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 h-full">
                         <div className="glass-panel rounded-[2rem] p-6 min-h-[60vh] flex flex-col bg-void-950/40 shadow-glass border-white/5">
                            <SectionHeader icon={Backpack} title="Inventário" color="text-emerald-400" />
                            <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* --- DESKTOP VIEW: Bento Grid Layout --- */}
        <div className="hidden lg:grid grid-cols-12 gap-6 relative z-10 print:block">
            
            {/* Row 1: Attributes (Full Width Pillars) */}
            <div className="col-span-12 flex justify-between gap-4 mb-2">
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key, i) => (
                    <div key={key} className="flex-1 h-48">
                        <StatBlock 
                            label={key} 
                            value={character.attributes[key]} 
                            modifier={character.modifiers[key]} 
                            isEditing={isEditing}
                            onUpdate={(val) => handleAttributeChange(key, val)}
                            delay={i * 0.08}
                        />
                    </div>
                ))}
            </div>

            {/* Row 2: Main Modules */}
            
            {/* Col 1: Combat & Vitals (3 cols) */}
            <div className="col-span-3 flex flex-col gap-6 h-full">
                <div className="glass-panel rounded-[2.5rem] p-8 h-full bg-void-950/30 border-white/5 hover:border-white/10 transition-colors shadow-glass relative overflow-hidden group">
                     {/* Ambient Glow */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-rose-500/10 transition-colors duration-700"></div>
                     
                     <SectionHeader icon={Swords} title="Combate" color="text-rose-400" />
                     <CombatStats character={character} isEditing={isEditing} onChange={handleChange as any} /> 
                </div>
            </div>

            {/* Col 2: Skills (4 cols) */}
            <div className="col-span-5 h-full">
                <div className="glass-panel rounded-[2.5rem] p-8 h-full bg-void-950/30 border-white/5 hover:border-white/10 transition-colors shadow-glass relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-gold-500/10 transition-colors duration-700"></div>
                    
                    <SectionHeader icon={Target} title="Perícias" color="text-gold-400" />
                    <div className="relative z-10 h-[550px]">
                        <SkillsList skills={character.skills} />
                    </div>
                </div>
            </div>

            {/* Col 3: Inventory & Lore (5 cols) */}
            <div className="col-span-4 flex flex-col gap-6">
                 {/* Inventory Module */}
                 <div className="glass-panel rounded-[2.5rem] p-8 flex-grow min-h-[350px] flex flex-col bg-void-950/30 border-white/5 hover:border-white/10 transition-colors shadow-glass relative group overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                    <SectionHeader icon={Backpack} title="Inventário" color="text-emerald-400" />
                    <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                 </div>
                 
                 {/* Lore Module */}
                 <div className="glass-panel rounded-[2.5rem] p-8 min-h-[300px] flex flex-col bg-void-950/30 border-white/5 hover:border-white/10 transition-colors shadow-glass relative">
                    <SectionHeader icon={ScrollText} title="Lenda" color="text-indigo-400" />
                    <div className="flex-grow relative overflow-hidden">
                         {isEditing ? (
                            <textarea 
                                value={character.backstory || ''} 
                                onChange={(e) => handleChange('backstory', e.target.value)}
                                className="w-full h-full bg-void-950/50 rounded-xl p-4 text-mystic-200 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/30 border border-white/5 resize-none font-body shadow-inner tracking-wide custom-scrollbar"
                                placeholder="Escreva a lenda deste herói..."
                            />
                        ) : (
                            <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-3" data-lenis-prevent>
                                <TypewriterText text={character.backstory || "As páginas da história deste herói ainda estão em branco..."} />
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </div>

        {/* --- MOBILE NAVIGATION BAR --- */}
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
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
