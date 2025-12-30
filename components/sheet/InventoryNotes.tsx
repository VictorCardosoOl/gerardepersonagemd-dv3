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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            
            {/* Left Column: Equipment & Proficiencies */}
            <div className="space-y-6">
                <div className="bg-stone-50/50 rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-serif text-lg text-emerald-900 mb-4 flex items-center gap-2 font-bold">
                        <Backpack size={18} className="text-emerald-600" /> Equipamento Inicial
                    </h3>
                    <ul className="space-y-3">
                        {character.equipment.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-stone-700 bg-white p-3 rounded-lg border border-stone-100 shadow-sm">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-stone-50/50 rounded-2xl p-6 border border-stone-100">
                    <h3 className="font-serif text-lg text-emerald-900 mb-4 flex items-center gap-2 font-bold">
                        <ShieldCheck size={18} className="text-emerald-600" /> Proficiências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {classData?.proficiencies.map((prof, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white text-stone-600 text-xs font-semibold rounded-md border border-stone-200 shadow-sm">
                                {prof}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Journal/Backstory */}
            <div className="bg-[#fefdfa] border border-stone-200 rounded-2xl p-8 shadow-inner relative flex flex-col h-full min-h-[400px]">
                {/* Journal Decoration */}
                <div className="absolute top-0 left-8 bottom-0 w-px bg-rose-100/50"></div>
                <div className="absolute top-0 left-9 bottom-0 w-px bg-rose-100/50"></div>

                <h3 className="font-serif text-2xl text-stone-800 mb-6 flex items-center gap-2 pl-6 relative z-10">
                    <Feather size={20} className="text-stone-400" /> Histórico
                </h3>

                <div className="flex-grow pl-6 relative z-10">
                    {isEditing ? (
                        <textarea 
                            value={character.backstory || ''} 
                            onChange={(e) => onChange('backstory', e.target.value)}
                            className="w-full h-full bg-transparent text-stone-700 text-lg leading-loose focus:outline-none resize-none font-serif placeholder-stone-300"
                            placeholder="Escreva a lenda do seu personagem aqui..."
                            style={{ backgroundImage: 'linear-gradient(transparent 95%, #e7e5e4 95%)', backgroundSize: '100% 2rem', lineHeight: '2rem' }}
                        />
                    ) : (
                        <div 
                            className="prose prose-stone max-w-none text-stone-700 text-lg font-serif"
                            style={{ lineHeight: '2rem' }}
                        >
                            {character.backstory ? (
                                <p className="whitespace-pre-wrap">{character.backstory}</p>
                            ) : (
                                <span className="italic text-stone-300">As páginas deste diário ainda estão em branco...</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};