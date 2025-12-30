import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Shield, Save, Printer, Copy, Swords, Backpack, ScrollText } from 'lucide-react';
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

type SheetTab = 'overview' | 'inventory';

export const CharacterSheet: React.FC<Props> = ({ character, isEditing = false, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('overview');
  
  const classData = CLASSES.find(c => c.name === character.class);

  const handleAttributeChange = (key: keyof Attributes, value: number) => {
    if (!onUpdate) return;
    const newAttributes = { ...character.attributes, [key]: value };
    onUpdate({ attributes: newAttributes });
  };

  const handleChange = (field: keyof Character, value: any) => {
    if (onUpdate) onUpdate({ [field]: value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in">
        
        {/* Actions Bar (Floating or Fixed) */}
        <div className="flex justify-between items-center no-print">
             {/* Tabs */}
             <div className="flex gap-2 p-1 bg-slate-900/80 backdrop-blur rounded-lg border border-white/5">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Swords size={16} /> <span className="hidden sm:inline">Combate & Perícias</span>
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Backpack size={16} /> <span className="hidden sm:inline">Inventário & História</span>
                </button>
            </div>

            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-2 rounded hover:bg-white/5"
            >
                <Printer size={16} /> <span className="hidden sm:inline">Imprimir</span>
            </button>
        </div>

        {/* Main Sheet Container */}
        <div className="sheet-container w-full min-h-[800px] bg-slate-950 text-slate-200 relative print:bg-white print:text-black">
            
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Attributes (Always Visible) */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 sticky top-4">
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

                {/* Right Column: Tab Content */}
                <div className="lg:col-span-9">
                    {activeTab === 'overview' && (
                        <div className="animate-slide-in h-full flex flex-col gap-6">
                            <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                            <div className="flex-grow">
                                <SkillsList skills={character.skills} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="animate-slide-in h-full">
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