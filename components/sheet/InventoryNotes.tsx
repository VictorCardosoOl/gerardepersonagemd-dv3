import React from 'react';
import { Character, DndClass } from '../../types';
import { Backpack, BookOpen, Feather } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const InventoryNotes: React.FC<Props> = ({ character, classData, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
            <div className="flex flex-col gap-8">
                {/* Equipment */}
                <div className="clean-panel p-6 flex-grow">
                    <h3 className="font-serif text-xl text-stone-800 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <Backpack size={18} className="text-emerald-600" /> Equipamento
                    </h3>
                    <ul className="space-y-3">
                        {character.equipment.map((item, idx) => (
                            <li key={idx} className="text-sm text-stone-600 flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 flex-shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Proficiencies */}
                <div className="clean-panel p-6">
                    <h3 className="font-serif text-xl text-stone-800 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                        <BookOpen size={18} className="text-emerald-600" /> Proficiências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {classData?.proficiencies.map((prof, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-stone-100 text-xs font-medium text-stone-600 border border-stone-200">
                                {prof}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Backstory / Notes */}
            <div className="clean-panel p-6 flex flex-col h-full bg-[#fdfbf7]">
                <h3 className="font-serif text-xl text-stone-800 mb-4 pb-2 border-b border-stone-200 flex items-center gap-2">
                    <Feather size={18} className="text-emerald-600" /> Histórico & Notas
                </h3>
                <div className="flex-grow">
                    {isEditing ? (
                        <textarea 
                            value={character.backstory || ''} 
                            onChange={(e) => onChange('backstory', e.target.value)}
                            className="w-full h-full bg-transparent p-2 text-stone-700 leading-relaxed focus:outline-none resize-none font-serif"
                            placeholder="Escreva a história do seu personagem aqui..."
                        />
                    ) : (
                        <div className="prose prose-stone prose-sm max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap font-serif">
                            {character.backstory || <span className="italic text-stone-400">Nenhuma nota adicionada.</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};