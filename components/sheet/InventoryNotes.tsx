import React from 'react';
import { Character, DndClass } from '../../types';
import { Backpack, Book, Feather, ShieldCheck } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const InventoryNotes: React.FC<Props> = ({ character, classData, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
            
            {/* Left Column: Structural Lists */}
            <div className="space-y-8">
                {/* Equipment */}
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                    <h3 className="font-serif text-xl text-emerald-900 mb-6 flex items-center gap-2 font-bold relative z-10">
                        <Backpack size={20} className="text-emerald-600" /> Equipamento
                    </h3>
                    <ul className="space-y-3 relative z-10">
                        {character.equipment.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-stone-700 bg-white px-4 py-3 rounded-xl border border-stone-200 shadow-sm transition-transform hover:translate-x-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                                {item}
                            </li>
                        ))}
                        {character.equipment.length === 0 && <li className="text-stone-400 italic text-sm">Mochila vazia...</li>}
                    </ul>
                </div>

                {/* Proficiencies */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h3 className="font-serif text-lg text-stone-800 mb-4 flex items-center gap-2 font-bold">
                        <ShieldCheck size={18} className="text-stone-400" /> Proficiências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {classData?.proficiencies.map((prof, i) => (
                            <span key={i} className="px-3 py-1.5 bg-stone-50 text-stone-600 text-xs font-bold rounded-lg border border-stone-200">
                                {prof}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Journal / Backstory */}
            <div className="flex flex-col h-full min-h-[500px] bg-white border border-stone-200 rounded-2xl shadow-sm relative overflow-hidden">
                {/* Header */}
                <div className="bg-stone-50 px-8 py-5 border-b border-stone-200 flex items-center gap-3">
                    <Feather size={20} className="text-emerald-600" />
                    <h3 className="font-serif text-xl font-bold text-stone-800">Diário & Histórico</h3>
                </div>

                {/* Lined Paper Area */}
                <div className="flex-grow relative bg-white">
                    {/* CSS Lined Paper Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-50" 
                         style={{ 
                             backgroundImage: 'linear-gradient(#e7e5e4 1px, transparent 1px)', 
                             backgroundSize: '100% 2.5rem',
                             marginTop: '2.4rem' 
                         }}>
                    </div>
                    
                    {/* Red Margin Line */}
                    <div className="absolute top-0 bottom-0 left-12 w-px bg-rose-200 pointer-events-none"></div>

                    <div className="relative z-10 h-full p-8 pl-16">
                        {isEditing ? (
                            <textarea 
                                value={character.backstory || ''} 
                                onChange={(e) => onChange('backstory', e.target.value)}
                                className="w-full h-full bg-transparent text-stone-700 text-lg leading-[2.5rem] focus:outline-none resize-none font-serif placeholder-stone-300 -mt-1"
                                placeholder="Escreva a lenda do seu personagem..."
                                spellCheck={false}
                            />
                        ) : (
                            <div className="prose prose-stone max-w-none text-stone-700 text-lg font-serif leading-[2.5rem] -mt-1">
                                {character.backstory ? (
                                    <p className="whitespace-pre-wrap">{character.backstory}</p>
                                ) : (
                                    <span className="italic text-stone-300">As páginas ainda estão em branco...</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};