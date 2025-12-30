import React, { useState } from 'react';
import { Character } from '../types';
import { User, Users, Trash2, Crown, Ghost, Plus, Save, X, RefreshCw } from 'lucide-react';
import { generateCharacter } from '../utils/logic';

interface Props {
    savedCharacters: Character[];
    onSelect: (char: Character) => void;
    onDelete: (id: string) => void;
    onGenerate: (isNPC: boolean) => void;
    onSaveNew?: (npc: Character) => void; // New callback for streamlined UX
    isOpen: boolean;
    onClose: () => void;
}

export const DMPanel: React.FC<Props> = ({ savedCharacters, onSelect, onDelete, onGenerate, onSaveNew, isOpen, onClose }) => {
    const [quickNPC, setQuickNPC] = useState<Character | null>(null);

    const handleQuickGenerate = () => {
        const npc = generateCharacter(true);
        setQuickNPC(npc);
    };

    const handleSaveAndClose = () => {
        if (quickNPC) {
            onSelect(quickNPC);
            setQuickNPC(null);
            onClose();
        }
    };

    const handleSaveAndNew = () => {
        if (quickNPC && onSaveNew) {
            onSaveNew(quickNPC);
            handleQuickGenerate(); // Roll next immediately
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-royal-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 h-full flex flex-col bg-canvas-50">
                <div className="flex justify-between items-center mb-6 border-b border-royal-100 pb-4">
                    <div className="flex items-center gap-2 text-royal-800">
                        <Crown size={24} />
                        <h2 className="font-display text-xl font-bold">Painel do Mestre</h2>
                    </div>
                    <button onClick={onClose} className="text-royal-300 hover:text-royal-600 transition-colors bg-white rounded-full p-1 hover:bg-royal-50">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-8 pr-1">
                    
                    {/* --- QUICK NPC SECTION --- */}
                    <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xs uppercase tracking-widest text-royal-400 font-bold">NPC Rápido</h3>
                         </div>
                         
                         {!quickNPC ? (
                             <button 
                                onClick={handleQuickGenerate}
                                className="w-full py-4 border-2 border-dashed border-royal-200 rounded-xl text-royal-500 font-bold hover:bg-white hover:border-royal-400 hover:text-royal-700 transition-all flex flex-col items-center gap-2 bg-royal-50/50"
                             >
                                <Users size={24} />
                                <span>Gerar NPC Instantâneo</span>
                             </button>
                         ) : (
                             <div className="bg-white rounded-xl shadow-card border border-royal-100 p-4 animate-scale-in">
                                 <div className="flex justify-between items-start mb-2">
                                     <div>
                                         <h4 className="font-display font-bold text-royal-900 text-lg leading-tight">{quickNPC.name}</h4>
                                         <p className="text-xs text-royal-500 font-medium">{quickNPC.race} {quickNPC.class}</p>
                                     </div>
                                     <span className="bg-royal-100 text-royal-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">NPC</span>
                                 </div>
                                 
                                 <p className="text-sm text-slate-600 italic mb-4 border-l-2 border-royal-200 pl-2 leading-relaxed">
                                     {quickNPC.backstory?.slice(0, 80)}...
                                 </p>

                                 <div className="grid grid-cols-2 gap-2 mb-4">
                                     <div className="bg-canvas-50 p-2 rounded text-center border border-canvas-200">
                                         <span className="block text-[10px] text-slate-400 uppercase font-bold">HP</span>
                                         <span className="font-mono font-bold text-royal-800">{quickNPC.hp}</span>
                                     </div>
                                     <div className="bg-canvas-50 p-2 rounded text-center border border-canvas-200">
                                         <span className="block text-[10px] text-slate-400 uppercase font-bold">AC</span>
                                         <span className="font-mono font-bold text-royal-800">{quickNPC.ac}</span>
                                     </div>
                                 </div>

                                 <div className="flex gap-2 mb-2">
                                     <button 
                                        onClick={handleQuickGenerate}
                                        className="flex-1 py-2 bg-canvas-100 hover:bg-canvas-200 text-slate-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                                        title="Gerar Outro"
                                     >
                                         <RefreshCw size={14} /> Re-rolar
                                     </button>
                                     <button 
                                        onClick={handleSaveAndClose}
                                        className="flex-[2] py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-md shadow-royal-200"
                                     >
                                         <Save size={14} /> Abrir
                                     </button>
                                 </div>
                                 <button 
                                     onClick={handleSaveAndNew}
                                     className="w-full py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-emerald-100"
                                 >
                                     <Plus size={14} /> Salvar e Gerar Novo
                                 </button>
                             </div>
                         )}
                    </div>

                    <div className="w-full h-px bg-royal-100"></div>

                    {/* --- MAIN GENERATOR --- */}
                    <div className="space-y-3">
                        <h3 className="text-xs uppercase tracking-widest text-royal-400 font-bold">Gerador Principal</h3>
                        <button 
                            onClick={() => onGenerate(false)} 
                            className="w-full py-3 px-4 rounded-xl bg-royal-900 hover:bg-royal-800 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-royal-900/10 group"
                        >
                            <User size={18} className="group-hover:scale-110 transition-transform" /> Criar Herói Completo
                        </button>
                    </div>

                    <div className="w-full h-px bg-royal-100"></div>

                    {/* --- GRIMOIRE LIST --- */}
                    <div className="flex flex-col">
                        <h3 className="text-xs uppercase tracking-widest text-royal-400 font-bold mb-3 flex justify-between items-center">
                            Grimório Salvo <span className="bg-royal-100 text-royal-600 px-1.5 rounded-full text-[10px]">{savedCharacters.length}</span>
                        </h3>
                        
                        <div className="space-y-2">
                            {savedCharacters.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-canvas-200 rounded-xl">
                                    <Ghost size={24} className="mx-auto text-canvas-300 mb-2" />
                                    <p className="text-canvas-400 text-sm font-medium">Nenhum herói salvo.</p>
                                </div>
                            ) : (
                                savedCharacters.map(char => (
                                    <div 
                                        key={char.id} 
                                        onClick={() => onSelect(char)}
                                        className="p-3 rounded-xl bg-white border border-canvas-200 hover:border-royal-400 hover:shadow-md cursor-pointer group transition-all relative"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-royal-900 group-hover:text-royal-600 transition-colors text-sm flex items-center gap-1.5">
                                                    {char.name}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                                    {char.race} {char.class} <span className="text-royal-200">•</span> Nv {char.level}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                                className="text-canvas-300 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {char.isNPC && (
                                            <span className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-400 bg-canvas-100 px-1.5 rounded border border-canvas-200">NPC</span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};