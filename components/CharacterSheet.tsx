import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Backpack, Swords, Scroll } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 no-print border-b border-stone-200 pb-4">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Ficha de Personagem</h2>
            
            <div className="flex items-center gap-4">
                {/* Navigation Pills */}
                <div className="flex p-1 bg-stone-100 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('combat')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'combat' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        <Swords size={16} /> <span className="hidden sm:inline">Combate & Perícias</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
                    >
                        <Backpack size={16} /> <span className="hidden sm:inline">Mochila & Notas</span>
                    </button>
                </div>
                
                <button 
                    onClick={() => window.print()}
                    className="p-2.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
                    title="Imprimir Ficha"
                >
                    <Printer size={20} />
                </button>
            </div>
        </div>

        {/* Paper Container */}
        <div className="bg-white rounded-xl shadow-soft border border-stone-200 p-8 md:p-12 relative overflow-hidden print:shadow-none print:border-0 print:p-0">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30"></div>

            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                
                {/* Left Column: Attributes (Sticky) */}
                <div className="lg:col-span-3">
                    <div className="sticky top-24 space-y-4">
                        <div className="text-center mb-2">
                             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Atributos</h3>
                        </div>
                        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
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

                {/* Right Column: Dynamic Content */}
                <div className="lg:col-span-9 min-h-[600px]">
                    {activeTab === 'combat' && (
                        <div className="animate-slide-up flex flex-col gap-10">
                            <section>
                                <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                            </section>
                            
                            <div className="w-full h-px bg-stone-100"></div>

                            <section className="h-full">
                                <SkillsList skills={character.skills} />
                            </section>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="animate-slide-up h-full">
                            <InventoryNotes 
                                character={character} 
                                classData={classData} 
                                isEditing={isEditing} 
                                onChange={handleChange} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};