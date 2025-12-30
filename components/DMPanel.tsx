import React from 'react';
import { Character } from '../types';
import { User, Users, Trash2, Crown, Plus } from 'lucide-react';

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
        <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-indigo-500/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Crown size={24} />
                        <h2 className="font-serif text-xl font-bold text-white">Painel do Mestre</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
                </div>

                {/* Generator Tools */}
                <div className="mb-8 space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Gerador Rápido</h3>
                    <button 
                        onClick={() => onGenerate(false)} 
                        className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/50"
                    >
                        <User size={18} /> Novo Herói
                    </button>
                    <button 
                        onClick={() => onGenerate(true)} 
                        className="w-full py-3 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                    >
                        <Users size={18} /> Novo NPC
                    </button>
                </div>

                {/* Saved List */}
                <div className="flex-grow overflow-hidden flex flex-col">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4 flex justify-between items-center">
                        Grimório ({savedCharacters.length})
                    </h3>
                    
                    <div className="overflow-y-auto custom-scrollbar flex-grow space-y-2 pr-2">
                        {savedCharacters.length === 0 ? (
                            <p className="text-slate-600 italic text-sm text-center mt-10">O grimório está vazio.</p>
                        ) : (
                            savedCharacters.map(char => (
                                <div 
                                    key={char.id} 
                                    onClick={() => onSelect(char)}
                                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 cursor-pointer group transition-all relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-sm">
                                                {char.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {char.race} {char.class} <span className="text-slate-600">•</span> Nv {char.level}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                            className="text-slate-600 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    {char.isNPC && (
                                        <span className="absolute bottom-3 right-3 text-[10px] font-bold text-rose-900 bg-rose-900/20 px-1.5 rounded border border-rose-900/30">NPC</span>
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