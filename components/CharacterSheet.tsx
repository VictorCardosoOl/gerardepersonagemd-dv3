import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Scroll, Dna, Hexagon } from 'lucide-react';
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
    <div id="character-sheet-container" className="w-full max-w-7xl mx-auto flex flex-col gap-8 pb-32 relative">
        
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-1/2 h-96 bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-screen"></div>

        {/* Action Bar */}
        <div className="flex justify-between items-center px-4 md:px-0 no-print animate-enter-up">
            <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-mystic-300">Grimório Conectado</span>
            </div>
            <button 
                onClick={() => window.print()}
                className="group flex items-center gap-2 text-mystic-400 hover:text-white transition-all duration-300 text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full border border-white/5 hover:border-white/20 hover:bg-white/5 backdrop-blur-sm"
            >
                <Printer size={14} className="group-hover:text-accent-cyan transition-colors" /> 
                <span>Materializar</span>
            </button>
        </div>

        {/* --- MAIN GLASS CONTAINER --- */}
        <div className="animate-enter-up">
            <div className="relative">
                
                {/* 1. Header Section (Cinematic) */}
                <section className="mb-12">
                    <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />
                </section>

                {/* 2. Content Grid (Bento Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print-grid">
                    
                    {/* Left Column: Stats (Monolith) */}
                    <aside className="lg:col-span-3 xl:col-span-2">
                        <div className="lg:sticky lg:top-32 space-y-4">
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <Hexagon size={14} className="text-accent-gold animate-spin-slow" />
                                <span className="text-[10px] font-bold text-mystic-400 uppercase tracking-[0.2em]">
                                    Atributos
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
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
                    <main className="lg:col-span-9 xl:col-span-10 flex flex-col min-h-[700px]">
                        
                        {/* Tab Navigation (Floating Pill) */}
                        <div className="flex items-center gap-2 mb-10 no-print sticky top-24 z-30 pointer-events-none">
                            <div className="pointer-events-auto bg-void-950/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex gap-1 shadow-2xl">
                                <button 
                                    onClick={() => setActiveTab('combat')}
                                    className={`
                                        px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-500 relative overflow-hidden group
                                        ${activeTab === 'combat' ? 'text-void-950 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-mystic-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Dna size={14} /> Combate
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('inventory')}
                                    className={`
                                        px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-500 relative overflow-hidden group
                                        ${activeTab === 'inventory' ? 'text-void-950 bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-mystic-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Scroll size={14} /> Grimório
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Content Views */}
                        <div className="flex-grow">
                            <div className={activeTab === 'combat' ? 'block' : 'hidden print:block'}>
                                <div className="space-y-8 animate-scale-in">
                                    <section>
                                        <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                                    </section>
                                    
                                    <section className="glass-panel rounded-[2rem] p-8 md:p-10 border-white/5 bg-void-900/40 relative overflow-hidden group">
                                         {/* Decorative Corner */}
                                         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>
                                         <SkillsList skills={character.skills} />
                                    </section>
                                </div>
                            </div>

                            <div className={activeTab === 'inventory' ? 'block' : 'hidden print:block'}>
                                <div className="h-full print:mt-12 animate-scale-in">
                                    <InventoryNotes 
                                        character={character} 
                                        classData={classData} 
                                        isEditing={isEditing} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
  );
};