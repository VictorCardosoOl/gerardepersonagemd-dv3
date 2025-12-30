import React from 'react';
import { Character } from '../types';
import { User, Users, Trash2, Crown, Ghost } from 'lucide-react';

interface Props {
    savedCharacters: Character[];
    onSelect: (char: Character) => void;
    onDelete: (id: string) => void;
    onGenerate: (isNPC: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const DMPanel: React.FC<Props> = ({ savedCharacters, onSelect, onDelete, onGenerate, isOpen, onClose }) => {
    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-stone-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <Crown size={24} />
                        <h2 className="font-serif text-xl font-bold text-stone-800">Painel do Mestre</h2>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-red-500 transition-colors">✕</button>
                </div>

                {/* Generator Tools */}
                <div className="mb-8 space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-2">Gerador Rápido</h3>
                    <button 
                        onClick={() => onGenerate(false)} 
                        className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/10"
                    >
                        <User size={18} /> Novo Herói
                    </button>
                    <button 
                        onClick={() => onGenerate(true)} 
                        className="w-full py-3 px-4 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium flex items-center justify-center gap-2 transition-colors border border-stone-200"
                    >
                        <Users size={18} /> Novo NPC
                    </button>
                </div>

                {/* Saved List */}
                <div className="flex-grow overflow-hidden flex flex-col">
                    <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4 flex justify-between items-center">
                        Grimório ({savedCharacters.length})
                    </h3>
                    
                    <div className="overflow-y-auto custom-scrollbar flex-grow space-y-2 pr-2">
                        {savedCharacters.length === 0 ? (
                            <p className="text-stone-400 italic text-sm text-center mt-10">O grimório está vazio.</p>
                        ) : (
                            savedCharacters.map(char => (
                                <div 
                                    key={char.id} 
                                    onClick={() => onSelect(char)}
                                    className="p-3 rounded-lg bg-stone-50 border border-stone-100 hover:border-emerald-500/30 hover:bg-emerald-50/30 cursor-pointer group transition-all relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-stone-700 group-hover:text-emerald-700 transition-colors text-sm flex items-center gap-1">
                                                {char.isNPC && <Ghost size={12} className="text-stone-400" />}
                                                {char.name}
                                            </h4>
                                            <p className="text-xs text-stone-500 mt-1">
                                                {char.race} {char.class} <span className="text-stone-300">•</span> Nv {char.level}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                            className="text-stone-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    {char.isNPC && (
                                        <span className="absolute bottom-3 right-3 text-[10px] font-bold text-stone-400 bg-stone-200 px-1.5 rounded">NPC</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};