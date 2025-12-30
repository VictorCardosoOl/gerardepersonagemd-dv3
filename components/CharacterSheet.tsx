import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Zap, Box, Tag, Swords, Sparkles } from 'lucide-react';
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
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 py-8 space-y-8">
        
        {/* --- Header Section (Full Width) --- */}
        <div className="mb-12 relative z-10">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- Main Bento Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            
            {/* Row 1: Attributes (12 cols) */}
            <div className="md:col-span-12 glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-wrap justify-around items-center gap-4 bg-void-900/40 backdrop-blur-xl border border-white/5">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="relative z-10">
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

            {/* Row 2: Combat & Skills */}
            
            {/* Combat Vitals (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-6 h-full">
                <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex-grow bg-void-950/60 backdrop-blur-xl border border-white/10 shadow-glass">
                     {/* Decorative Glows */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-cyan/10 rounded-full blur-[60px]"></div>
                     <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-gold/5 rounded-full blur-[40px]"></div>

                     <h3 className="font-display text-white/50 text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2 border-b border-white/5 pb-2">
                        <Swords size={14} className="text-accent-rose" /> Status de Combate
                     </h3>
                     <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                </div>
            </div>

            {/* Skills Matrix (8 cols) */}
            <div className="md:col-span-8 h-full">
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden h-full bg-void-900/40 backdrop-blur-xl border border-white/5">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50"></div>
                    <SkillsList skills={character.skills} />
                </div>
            </div>

            {/* Row 3: Inventory & Lore (12 cols) */}
            <div className="md:col-span-12">
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