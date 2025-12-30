import React, { useState } from 'react';
import { Character, Attributes } from '../types';
import { StatBlock } from './StatBlock';
import { Printer, Backpack, Swords, Scroll, Info, Share2 } from 'lucide-react';
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
        
        {/* Actions Bar */}
        <div className="flex justify-between items-center px-4 no-print">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Online</span>
            </div>
            <button 
                onClick={() => window.print()}
                className="group flex items-center gap-2 text-stone-400 hover:text-emerald-700 transition-colors text-sm font-medium"
            >
                <Printer size={16} className="group-hover:scale-110 transition-transform"/> Imprimir Ficha
            </button>
        </div>

        {/* Main Sheet Container */}
        <div className="bg-white rounded-3xl shadow-soft border border-stone-100 p-8 md:p-12 relative overflow-hidden">
            
            {/* Top Identity Section */}
            <IdentityHeader character={character} isEditing={isEditing} onChange={handleChange} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 border-t border-stone-100 pt-10">
                
                {/* Left Column: Attributes (Sticky) */}
                <div className="lg:col-span-3">
                    <div className="sticky top-28">
                        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] text-center mb-6">Atributos Principais</h3>
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

                {/* Right Column: Dynamic Content Tabs */}
                <div className="lg:col-span-9 min-h-[600px]">
                    
                    {/* Modern Tabs */}
                    <div className="flex items-center gap-8 mb-10 border-b border-stone-100 no-print">
                        <button 
                            onClick={() => setActiveTab('combat')}
                            className={`pb-4 px-2 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'combat' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <span className="flex items-center gap-2"><Swords size={18}/> Combate & Habilidades</span>
                            {activeTab === 'combat' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></span>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`pb-4 px-2 text-sm font-bold tracking-wide transition-all relative ${activeTab === 'inventory' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <span className="flex items-center gap-2"><Backpack size={18}/> Inventário & Diário</span>
                            {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></span>}
                        </button>
                    </div>

                    {/* Content Area with smooth transitions */}
                    <div className="relative">
                        {activeTab === 'combat' && (
                            <div className="animate-slide-up space-y-12">
                                <section>
                                    <h4 className="sr-only">Estatísticas de Combate</h4>
                                    <CombatStats character={character} isEditing={isEditing} onChange={handleChange} />
                                </section>
                                
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-50"></div>

                                <section>
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
    </div>
  );
};