
import React from 'react';
import { Character } from '../../types';
import { Crown, Swords, Scroll, Sparkles } from 'lucide-react';
import { RACE_IMAGES } from '../../constants';
import { RulesRepository } from '../../services/RulesRepository';
import { motion } from 'framer-motion';

interface Props {
    character: Character;
    isEditing: boolean;
    onChange: <K extends keyof Character>(field: K, value: Character[K]) => void;
}

export const IdentityHeader: React.FC<Props> = ({ character, isEditing, onChange }) => {
    const bgImage = RACE_IMAGES[character.race] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=60&w=600&auto=format&fit=crop';
    const races = RulesRepository.getRaces();
    const classes = RulesRepository.getClasses();

    return (
        <div className="w-full relative group rounded-[3rem] overflow-hidden bg-void-950 border border-white/10 shadow-2xl transition-all duration-1000 hover:shadow-[0_0_50px_rgba(34,211,238,0.1)]">
             
            {/* Background Layers */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[5s] ease-out group-hover:scale-105 opacity-60" 
                style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/80 to-void-950/30"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 px-6 py-16 md:py-20 flex flex-col items-center text-center">
                
                {/* Meta Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-8"
                >
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-void-950/40 border border-white/10 backdrop-blur-md shadow-lg ring-1 ring-white/5">
                        <Crown size={12} className="text-gold-400" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-gold-100">Nível {character.level}</span>
                    </div>
                    {character.isNPC && (
                        <div className="px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">NPC</span>
                        </div>
                    )}
                </motion.div>

                {isEditing ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl bg-void-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-mystic-500 font-bold text-center">Nome da Lenda</label>
                                <input 
                                    type="text" 
                                    value={character.name}
                                    onChange={(e) => onChange('name', e.target.value)}
                                    className="w-full text-center text-4xl md:text-5xl font-display font-black text-white tracking-tight p-2 bg-transparent border-b border-white/10 focus:border-cyan-500/50 transition-colors placeholder-white/10 outline-none"
                                    placeholder="Nome..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-cyan-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Scroll size={12}/> Raça</label>
                                    <div className="relative">
                                        <select 
                                            value={character.race} 
                                            onChange={(e) => onChange('race', e.target.value)} 
                                            className="w-full appearance-none bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all cursor-pointer hover:bg-white/5"
                                        >
                                            {races.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col text-left group/input">
                                    <label className="text-[10px] uppercase text-gold-400 font-bold tracking-widest mb-2 flex items-center gap-2"><Swords size={12}/> Classe</label>
                                    <div className="relative">
                                        <select 
                                            value={character.class} 
                                            onChange={(e) => onChange('class', e.target.value)} 
                                            className="w-full appearance-none bg-void-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all cursor-pointer hover:bg-white/5"
                                        >
                                            {classes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-8 relative"
                        >
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tighter leading-[0.85] drop-shadow-2xl relative z-10">
                                {character.name}
                            </h1>
                            {/* Radiance Effect */}
                            <div className="absolute inset-0 blur-3xl bg-cyan-500/10 rounded-full z-0 opacity-50 animate-pulse-slow"></div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="flex items-center gap-8 md:gap-12"
                        >
                             <div className="flex flex-col items-center gap-2 group/race cursor-default">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-mystic-500 group-hover:text-cyan-400 transition-colors">Linhagem</span>
                                <span className="font-display font-bold text-xl md:text-2xl text-mystic-200 tracking-wide group-hover:text-white transition-colors">{character.race}</span>
                             </div>
                             
                             <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                             
                             <div className="flex flex-col items-center gap-2 group/class cursor-default">
                                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-mystic-500 group-hover:text-gold-400 transition-colors">Vocação</span>
                                <span className="font-display font-bold text-xl md:text-2xl text-mystic-200 tracking-wide group-hover:text-white transition-colors">{character.class}</span>
                             </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};
