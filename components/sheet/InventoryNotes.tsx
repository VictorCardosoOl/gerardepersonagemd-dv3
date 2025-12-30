import React from 'react';
import { Character, DndClass, Item } from '../../types';
import { Backpack, Feather, ShieldCheck, Sword, Shield, Hammer, Music, Wrench, Sparkles, Box } from 'lucide-react';

interface Props {
    character: Character;
    classData?: DndClass;
    isEditing: boolean;
    onChange: (field: keyof Character, value: any) => void;
}

const getItemIcon = (type: Item['type']) => {
    switch(type) {
        case 'weapon': return <Sword size={14} />;
        case 'armor': return <ShieldCheck size={14} />;
        case 'shield': return <Shield size={14} />;
        case 'tool': return <Wrench size={14} />;
        case 'instrument': return <Music size={14} />;
        default: return <Box size={14} />;
    }
};

export const InventoryNotes: React.FC<Props> = ({ character, classData, isEditing, onChange }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* Left Column: Equipment & Tools (4 cols) */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Equipment Panel */}
                <div className="glass-panel bg-void-900/40 rounded-[2rem] p-6 border-white/5 flex flex-col h-full min-h-[400px]">
                    <h3 className="font-display text-lg text-white mb-6 flex items-center gap-2 font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                        <Backpack size={16} className="text-accent-gold" /> Inventário
                    </h3>
                    
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2">
                        {character.equipment.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="text-white bg-void-950 p-2 rounded-lg shrink-0 border border-white/10 shadow-inner">
                                        {getItemIcon(item.type)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-mystic-200 text-sm group-hover:text-white transition-colors">{item.name}</span>
                                        <div className="flex gap-2 text-[10px] text-mystic-500 font-mono uppercase">
                                            {item.damage && <span>{item.damage}</span>}
                                            {item.acBase && <span>CA {item.acBase}</span>}
                                        </div>
                                    </div>
                                </div>
                                {item.quantity > 1 && (
                                    <span className="bg-accent-gold/20 text-accent-gold text-xs font-bold px-2 py-1 rounded-md font-mono">x{item.quantity}</span>
                                )}
                            </div>
                        ))}
                        {character.equipment.length === 0 && (
                            <div className="text-center py-10 text-mystic-600 italic">Mochila vazia...</div>
                        )}
                    </div>
                </div>

                {/* Proficiencies Tags */}
                <div className="glass-panel bg-void-900/40 rounded-2xl p-5 border-white/5">
                    <h3 className="font-display text-xs text-mystic-400 mb-4 flex items-center gap-2 font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} /> Proficiências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {classData?.proficiencies.map((prof, i) => (
                            <span key={i} className="px-3 py-1.5 bg-void-950 text-mystic-300 text-xs font-bold rounded-lg border border-white/10 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors cursor-default">
                                {prof}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Lore (8 cols) */}
            <div className="lg:col-span-7 h-full">
                <div className="glass-panel bg-void-900/40 rounded-[2rem] p-8 border-white/5 h-full min-h-[600px] relative overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                        <div className="p-3 bg-accent-cyan/10 rounded-xl text-accent-cyan">
                            <Feather size={24} />
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-bold text-white tracking-wide">Crônicas do Herói</h3>
                            <p className="text-xs text-mystic-500 font-mono uppercase tracking-widest mt-1">Origem • Personalidade • Destino</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow relative z-10">
                        {isEditing ? (
                            <textarea 
                                value={character.backstory || ''} 
                                onChange={(e) => onChange('backstory', e.target.value)}
                                className="w-full h-full bg-void-950/50 rounded-xl p-6 text-mystic-200 text-lg leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent-cyan/50 resize-none font-serif border border-white/10"
                                placeholder="Escreva a lenda aqui..."
                                spellCheck={false}
                            />
                        ) : (
                            <div className="prose prose-invert prose-lg max-w-none text-mystic-200 font-serif leading-loose">
                                {character.backstory ? (
                                    <>
                                        {/* Drop Cap styling applied via standard classes */}
                                        <p className="first-letter:text-6xl first-letter:font-display first-letter:font-black first-letter:text-accent-cyan first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                                            {character.backstory}
                                        </p>
                                        <div className="mt-8 flex justify-center">
                                            <Sparkles size={16} className="text-white/20" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 text-mystic-600">
                                        <Feather size={32} className="mb-4 opacity-50" />
                                        <span className="italic">As páginas do destino estão em branco...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Decorative Background Element */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-accent-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};