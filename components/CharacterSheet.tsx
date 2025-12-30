import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Backpack, Swords, Info, Scroll } from 'lucide-react';
import { CLASSES } from '../constants';
import { IdentityHeader } from './sheet/IdentityHeader';
import { CombatStats } from './sheet/CombatStats';
import { SkillsList } from './sheet/SkillsList';
import { InventoryNotes } from './sheet/InventoryNotes';

interface Props {
  character: Character;
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
        
        {/* Action Bar */}
        <div className="flex justify-between items-center px-4 md:px-2 no-print">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur px-3 py-1 rounded-full border border-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sessão Ativa</span>
            </div>
            <button 
                onClick={() => window.print()}
                className="group flex items-center gap-2 text-slate-500 hover:text-void-900 transition-colors text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full hover:bg-white/50"
            >
                <Printer size={16} /> Imprimir
            </button>
        </div>

        {/* --- MAIN PAPER CONTAINER --- */}
        <div className="glass-panel rounded-[2rem] p-8 md:p-12 relative overflow-hidden transition-all duration-500 bg-white shadow-2xl border-white/60">
            {/* Top Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-300 to-transparent opacity-50"></div>

            {/* 1. Header Section */}
            <section className="mb-12 border-b border-scroll-200 pb-10 print:border-black/20">
                <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
            </section>

            {/* 2. Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print-grid">
                
                {/* Left Column: Stats (Sticky) */}
                <aside className="lg:col-span-4">
                    <div className="lg:sticky lg:top-32 space-y-6">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-scroll-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Scroll size={12}/> Atributos
                            </span>
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
                    
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 mb-10 no-print sticky top-24 bg-white/95 backdrop-blur z-20 py-2 border-b border-scroll-100">
                        <button 
                            onClick={() => setActiveTab('combat')}
                            className={`
                                px-4 py-2 rounded-lg text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300
                                ${activeTab === 'combat' 
                                    ? 'bg-void-950 text-white' 
                                    : 'text-slate-400 hover:text-void-900 hover:bg-scroll-50'}
                            `}
                        >
                            Combate
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`
                                px-4 py-2 rounded-lg text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300
                                ${activeTab === 'inventory' 
                                    ? 'bg-void-950 text-white' 
                                    : 'text-slate-400 hover:text-void-900 hover:bg-scroll-50'}
                            `}
                        >
                            Inventário & Lore
                        </button>
                    </div>

                    {/* Content Views */}
                    <div className="flex-grow">
                        <div className={`${activeTab === 'combat' ? 'block' : 'hidden print:block'} animate-enter-up space-y-12`}>
                            <section>
                                <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                            </section>
                            
                            <div className="w-full h-px bg-scroll-200 my-8 print:bg-black/20"></div>

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