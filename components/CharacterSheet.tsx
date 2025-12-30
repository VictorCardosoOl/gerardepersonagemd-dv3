import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Backpack, Swords, Scroll, Info, Share2, PenLine } from 'lucide-react';
import { CLASSES } from '../constants';
import { IdentityHeader } from './sheet/IdentityHeader';
import { CombatStats } from './sheet/CombatStats';
import { SkillsList } from './sheet/SkillsList';
import { InventoryNotes } from './sheet/InventoryNotes';

interface Props {
  character: Character;
  backstoryLoading: boolean; 
  isEditing?: boolean;
  onUpdate?: (updates: Partial<Character>) => void;
}

type SheetTab = 'combat' | 'inventory';

export const CharacterSheet: React.FC<Props> = ({ character, isEditing = false, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const classData = CLASSES.find(c => c.name === character.class);

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    if (!onUpdate) return;
    const newAttributes = { ...character.attributes, [key]: value };
    onUpdate({ attributes: newAttributes });
  };

  const handleChange = (field: keyof Character, value: any) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  return (
    <div id="character-sheet-container" className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-enter-up pb-32">
        
        {/* Action Bar (Hidden on Print) */}
        <div className="flex justify-between items-center px-4 md:px-0 no-print">
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
                <span className="text-xs font-bold text-accent-cyan uppercase tracking-[0.2em]">Live Session</span>
            </div>
            <button 
                onClick={() => window.print()}
                className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wide border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
            >
                <Printer size={16} className="group-hover:text-mystic-300"/> Imprimir Ficha
            </button>
        </div>

        {/* --- MAIN PAPER CONTAINER --- */}
        {/* On screen: Glassmorphism Dark. On Print: White Paper. */}
        <div className="glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden transition-all duration-500">
            
            {/* 1. Header Section (Identity) */}
            <section className="mb-16 border-b border-white/10 pb-12 print:border-black/20">
                <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
            </section>

            {/* 2. Content Grid (Editorial Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 print-grid">
                
                {/* Left Column: Stats (Sticky on Screen) */}
                <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2 print:border-black/20">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Atributos Principais</span>
                            <Info size={14} className="text-slate-600 no-print" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
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
                </aside>

                {/* Right Column: Dynamic Content */}
                <main className="lg:col-span-8 flex flex-col min-h-[800px]">
                    
                    {/* Tab Navigation (Hidden on Print) */}
                    <div className="flex items-center gap-4 mb-12 border-b border-white/10 no-print sticky top-24 bg-void-950/80 backdrop-blur z-20 py-4">
                        <button 
                            onClick={() => setActiveTab('combat')}
                            className={`
                                px-6 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 relative group
                                ${activeTab === 'combat' 
                                    ? 'bg-mystic-500 text-white shadow-glow' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <Swords size={18} /> Combate
                            </span>
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`
                                px-6 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 relative group
                                ${activeTab === 'inventory' 
                                    ? 'bg-mystic-500 text-white shadow-glow' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <Backpack size={18} /> Inventário & Lore
                            </span>
                        </button>
                    </div>

                    {/* Content Views */}
                    <div className="flex-grow">
                        {/* Force visible on print */}
                        <div className={`${activeTab === 'combat' ? 'block' : 'hidden print:block'} animate-enter-up space-y-16`}>
                            <section>
                                <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                            </section>
                            
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 print:bg-black/20"></div>

                            <section>
                                <SkillsList skills={character.skills} />
                            </section>
                        </div>

                        <div className={`${activeTab === 'inventory' ? 'block' : 'hidden print:block'} animate-enter-up h-full print:mt-12`}>
                            <InventoryNotes 
                                character={character} 
                                classData={classData} 
                                isEditing={isEditing} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};