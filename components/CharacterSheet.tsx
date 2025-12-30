import React, { useState, useEffect } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Zap, Anchor } from 'lucide-react';
import { IdentityHeader } from './sheet/IdentityHeader';
import { SkillsList } from './sheet/SkillsList';
import { InventoryNotes } from './sheet/InventoryNotes';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props {
  character: Character;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

export const CharacterSheet: React.FC<Props> = ({ character, isEditing = false, onUpdate }) => {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const statsY = useTransform(scrollY, [0, 500], [0, -100]);

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    if (!onUpdate) return;
    const newAttributes = { ...character.attributes, [key]: value };
    onUpdate({ attributes: newAttributes });
  };

  const handleChange = (field: keyof Character, value: any) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-40 relative">
        
        {/* --- MASSIVE HEADER (Parallax) --- */}
        <motion.section 
            style={{ opacity: headerOpacity, scale: headerScale }}
            className="min-h-[70vh] flex flex-col justify-center items-start pt-20 mb-20 relative px-4 md:px-12"
        >
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </motion.section>

        {/* --- CORE STATS (Floating Row) --- */}
        <div className="sticky top-0 z-30 bg-gradient-to-b from-obsidian-950 via-obsidian-950/95 to-transparent backdrop-blur-sm pt-8 pb-12 px-4 md:px-12 border-b border-white/5 mb-24">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-12 max-w-6xl mx-auto">
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

        {/* --- EDITORIAL SECTIONS (Continuous Scroll) --- */}
        <div className="px-4 md:px-12 space-y-40">
            
            {/* Vitals & Combat */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="text-4xl font-display font-medium text-white mb-6 sticky top-40">Combate</h2>
                    <p className="font-serif text-zinc-500 italic text-lg leading-relaxed sticky top-52">
                        A arte da sobrevivência. Seus reflexos, sua resistência e sua capacidade de evitar a morte iminente.
                    </p>
                </div>
                <div className="md:col-span-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* AC */}
                        <div className="flex flex-col items-center justify-center p-12 border-l border-white/10 group hover:bg-white/5 transition-colors cursor-default">
                             <Shield size={24} className="text-champagne-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                             <span className="text-6xl font-mono text-white mb-2">{character.ac}</span>
                             <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Armadura</span>
                        </div>
                        {/* HP */}
                         <div className="flex flex-col items-center justify-center p-12 border-l border-white/10 group hover:bg-white/5 transition-colors cursor-default">
                             <Heart size={24} className="text-rose-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                             <span className="text-6xl font-mono text-white mb-2">{character.hp}</span>
                             <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Vida Máxima {character.maxHp}</span>
                        </div>
                        {/* INITIATIVE */}
                         <div className="flex flex-col items-center justify-center p-12 border-l border-white/10 group hover:bg-white/5 transition-colors cursor-default">
                             <Zap size={24} className="text-emerald-400 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                             <span className="text-6xl font-mono text-white mb-2">{character.initiative >= 0 ? `+${character.initiative}` : character.initiative}</span>
                             <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Iniciativa</span>
                        </div>
                     </div>
                </div>
            </section>

            {/* Skills Matrix */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="text-4xl font-display font-medium text-white mb-6 sticky top-40">Perícias</h2>
                     <p className="font-serif text-zinc-500 italic text-lg leading-relaxed sticky top-52">
                        O conhecimento acumulado e os talentos naturais que definem como você interage com o mundo.
                    </p>
                </div>
                <div className="md:col-span-8">
                    <SkillsList skills={character.skills} />
                </div>
            </section>

            {/* Inventory & Lore */}
            <section className="min-h-screen">
                 <InventoryNotes 
                    character={character} 
                    classData={undefined} 
                    isEditing={isEditing} 
                    onChange={handleChange} 
                />
            </section>

        </div>
    </div>
  );
};