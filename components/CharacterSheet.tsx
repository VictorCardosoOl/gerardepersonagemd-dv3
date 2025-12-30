import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Backpack, Swords, Scroll, Info } from 'lucide-react';
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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-20">
        
        {/* Header Section */}
        <div className="flex justify-between items-end px-2 no-print">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">Ficha de Personagem</h2>
            
            <button 
                onClick={() => window.print()}
                className="text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
                <Printer size={16} /> Imprimir
            </button>
        </div>

        {/* Main Paper Surface */}
        <div className="clean-panel p-8 md:p-12 relative overflow-hidden bg-white shadow-card">
            
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 border-t border-stone-100 pt-10">
                
                {/* Left Column: Core Attributes */}
                <div className="lg:col-span-3 border-r border-stone-100 pr-0 lg:pr-10">
                    <div className="sticky top-28 space-y-6">
                        <div className="flex items-center justify-between lg:justify-center">
                             <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-2 py-1 rounded">Atributos</h3>
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

                {/* Right Column: Interactive Content */}
                <div className="lg:col-span-9">
                    
                    {/* Internal Tabs */}
                    <div className="flex border-b border-stone-200 mb-8 no-print">
                        <button 
                            onClick={() => setActiveTab('combat')}
                            className={`pb-3 px-1 mr-6 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'combat' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <span className="flex items-center gap-2"><Swords size={18}/> Combate & Perícias</span>
                            {activeTab === 'combat' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`pb-3 px-1 mr-6 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'inventory' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <span className="flex items-center gap-2"><Backpack size={18}/> Equipamento & Notas</span>
                            {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>}
                        </button>
                    </div>

                    <div className="min-h-[500px]">
                        {activeTab === 'combat' && (
                            <div className="animate-slide-up flex flex-col gap-12">
                                <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                                <div className="w-full h-px bg-stone-100"></div>
                                <SkillsList skills={character.skills} />
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
    </div>
  );
};