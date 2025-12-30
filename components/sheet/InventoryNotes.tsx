import React from 'react';
import { Character, DndClass } from '../../types';
import { Backpack, BookOpen, MessageSquare } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

export const InventoryNotes: React.FC<Props> = ({ character, classData, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-6">
                {/* Equipment */}
                <div className="glass-panel p-5 rounded-xl flex-grow">
                    <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                        <Backpack size={18} className="text-indigo-400" /> Equipamento
                    </h3>
                    <ul className="space-y-2">
                        {character.equipment.map((item, idx) => (
                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Proficiencies */}
                <div className="glass-panel p-5 rounded-xl">
                    <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-400" /> Proficiências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {classData?.proficiencies.map((prof, i) => (
                            <span key={i} className="px-2 py-1 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700">
                                {prof}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Backstory / Notes */}
            <div className="glass-panel p-5 rounded-xl flex flex-col h-full">
                <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <MessageSquare size={18} className="text-indigo-400" /> Histórico & Notas
                </h3>
                <div className="flex-grow">
                    {isEditing ? (
                        <textarea 
                            value={character.backstory || ''} 
                            onChange={(e) => onChange('backstory', e.target.value)}
                            className="w-full h-full bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                            placeholder="Escreva a história do seu personagem aqui..."
                        />
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {character.backstory || <span className="italic text-slate-600">Nenhuma nota adicionada.</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};