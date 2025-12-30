import React from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Heart, Zap, Box, Tag, Swords, Sparkles, Feather, Backpack } from 'lucide-react';
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
        <div className="mb-8 relative z-10">
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
        </div>

        {/* --- Main Bento Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            
            {/* Area 1: Atributos (Top Bar - 12 cols) */}
            <div className="md:col-span-12 glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-wrap justify-between items-center gap-6 bg-void-900/60 backdrop-blur-xl border border-white/5 shadow-glass">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {(Object.keys(character.attributes) as Array<keyof Attributes>).map((key) => (
                    <div key={key} className="relative z-10 flex-1 min-w-[80px]">
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

            {/* Area 2: Combat Vitals (Left Column - 4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-6">
                <div className="glass-panel rounded-3xl p-8 relative overflow-hidden flex-grow bg-gradient-to-b from-void-800/50 to-void-950/50 backdrop-blur-xl border border-white/10 shadow-glass">
                     {/* Decorative Glows */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px]"></div>
                     
                     <h3 className="font-display font-bold text-white/40 text-xs uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
                        <Swords size={16} className="text-white" /> Combate
                     </h3>
                     <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                </div>
            </div>

            {/* Area 3: Skills Matrix (Center - 8 cols) */}
            <div className="md:col-span-8">
                <div className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden bg-void-900/30 backdrop-blur-md border border-white/5">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-30"></div>
                    <SkillsList skills={character.skills} />
                </div>
            </div>

            {/* Area 4: Inventory & Lore (Bottom - 12 cols split) */}
            <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Inventory */}
                 <div className="glass-panel rounded-3xl p-8 min-h-[350px] relative">
                    <h3 className="font-display font-bold text-white/40 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                        <Backpack size={16} /> Equipamento
                    </h3>
                    <InventoryNotes character={character} isEditing={isEditing} onChange={handleChange} />
                 </div>
                 
                 {/* Lore */}
                 <div className="glass-panel rounded-3xl p-8 min-h-[350px] relative flex flex-col">
                    <h3 className="font-display font-bold text-white/40 text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                        <Feather size={16} /> História & Notas
                    </h3>
                    <div className="flex-grow">
                        {isEditing ? (
                            <textarea 
                                value={character.backstory || ''} 
                                onChange={(e) => handleChange('backstory', e.target.value)}
                                className="w-full h-full bg-void-950/50 rounded-xl p-6 text-mystic-300 text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 border border-white/5 resize-none font-body shadow-inner"
                                placeholder="Escreva a lenda deste herói..."
                            />
                        ) : (
                            <div className="h-full overflow-y-auto custom-scrollbar pr-4" data-lenis-prevent>
                                <p className="text-mystic-200 text-base leading-8 font-serif opacity-90">
                                    {character.backstory || "Sem história definida."}
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