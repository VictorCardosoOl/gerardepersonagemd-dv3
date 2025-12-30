import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Zap, Box, Tag } from 'lucide-react';
import { IdentityHeader } from './sheet/IdentityHeader';
import { SkillsList } from './sheet/SkillsList';
import { InventoryNotes } from './sheet/InventoryNotes';
import { CombatStats } from './sheet/CombatStats';
import { motion } from 'framer-motion';

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

  const handleChange = (field: keyof Character, value: any) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* --- Header Section (Full Width) --- */}
        <div className="mb-12">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- Main Bento Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. Core Stats Row (12 cols on desktop) */}
            <div className="md:col-span-12 glass-panel rounded-3xl p-6 md:p-8 flex flex-wrap md:flex-nowrap justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="flex-1 min-w-[100px] flex justify-center">
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

            {/* 2. Combat Vitals (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-6">
                {/* Vitals Container */}
                <div className="glass-panel rounded-3xl p-6 relative overflow-hidden h-full">
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                     <h3 className="font-display text-white/50 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap size={14} /> Combate
                     </h3>
                     <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                </div>
            </div>

            {/* 3. Skills Matrix (8 cols) */}
            <div className="md:col-span-8">
                <div className="glass-panel rounded-3xl p-6 h-full relative overflow-hidden">
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl"></div>
                    <SkillsList skills={character.skills} />
                </div>
            </div>

            {/* 4. Inventory & Lore (12 cols split internally) */}
            <div className="md:col-span-12 mt-4">
                 <InventoryNotes 
                    character={character} 
                    isEditing={isEditing} 
                    onChange={handleChange} 
                />
            </div>

        </div>
    </div>
  );
};