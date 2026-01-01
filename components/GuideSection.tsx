import React from 'react';
import { GUIDE_STEPS } from '../constants';
import { Map, Compass, BookOpen, Dices, ShieldAlert, Sparkles, Sword, MessageCircle, Eye } from 'lucide-react';

export const GuideSection: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in pb-32">
            
            {/* Header Hero */}
            <div className="text-center mb-16 relative">
                <div className="inline-flex items-center justify-center p-4 bg-void-900/50 rounded-full mb-6 animate-float shadow-glass border border-white/10 backdrop-blur-md">
                    <Compass size={40} className="text-cyan-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    Grimório do <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Iniciante</span>
                </h2>
                <p className="text-xl text-mystic-300 max-w-2xl mx-auto leading-relaxed font-body font-light">
                    O RPG de mesa é uma conversa onde o destino é decidido pelos dados. Aqui estão os segredos para dominar a masmorra.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Section 1: The Golden Rule (D20) - Spans full width on mobile, 7 cols on desktop */}
                <div className="md:col-span-7 glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="p-4 bg-void-950 rounded-2xl border border-white/10 text-cyan-400 shadow-glow-cyan">
                            <Dices size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold text-white mb-2">A Regra de Ouro (D20)</h3>
                            <p className="text-mystic-200 leading-relaxed text-sm md:text-base">
                                Sempre que você tentar algo arriscado, o Mestre pedirá um teste. A fórmula é universal:
                            </p>
                            <div className="mt-6 flex items-center gap-4 text-center font-display font-bold text-lg md:text-xl">
                                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-white">
                                    🎲 1d20
                                </div>
                                <span className="text-mystic-500">+</span>
                                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-gold-400">
                                    Atributo
                                </div>
                                <span className="text-mystic-500">vs</span>
                                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-accent-rose">
                                    Dificuldade
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Proficência - 5 cols */}
                <div className="md:col-span-5 glass-panel p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl font-display font-bold text-gold-400 mb-3 flex items-center gap-2">
                        <Sparkles size={20} /> Bônus de Proficiência
                    </h3>
                    <p className="text-mystic-300 text-sm leading-relaxed">
                        É o número que define o quão treinado seu herói é. Ele começa como <span className="text-white font-bold">+2</span> e sobe com o nível. Você soma este número em tudo que você sabe fazer bem (armas, perícias, magias).
                    </p>
                </div>

                {/* Section 3: The 3 Pillars - 3 equal columns */}
                <div className="md:col-span-4 glass-panel p-6 rounded-[2rem] border-t-4 border-t-accent-rose bg-void-900/40 hover:bg-void-900/60 transition-colors">
                    <div className="mb-4 text-accent-rose bg-accent-rose/10 w-fit p-2 rounded-lg"><Sword size={24}/></div>
                    <h4 className="text-lg font-bold text-white mb-2">Combate</h4>
                    <p className="text-xs text-mystic-400 leading-relaxed">
                        Turnos táticos. Mova-se, ataque, use magia. Sua <strong>CA (Classe de Armadura)</strong> define o quão difícil é te acertar.
                    </p>
                </div>
                <div className="md:col-span-4 glass-panel p-6 rounded-[2rem] border-t-4 border-t-cyan-400 bg-void-900/40 hover:bg-void-900/60 transition-colors">
                    <div className="mb-4 text-cyan-400 bg-cyan-400/10 w-fit p-2 rounded-lg"><Eye size={24}/></div>
                    <h4 className="text-lg font-bold text-white mb-2">Exploração</h4>
                    <p className="text-xs text-mystic-400 leading-relaxed">
                        Descobrir o mapa, encontrar armadilhas, rastrear inimigos. Perícias como <strong>Percepção</strong> e <strong>Sobrevivência</strong> brilham aqui.
                    </p>
                </div>
                <div className="md:col-span-4 glass-panel p-6 rounded-[2rem] border-t-4 border-t-gold-500 bg-void-900/40 hover:bg-void-900/60 transition-colors">
                    <div className="mb-4 text-gold-500 bg-gold-500/10 w-fit p-2 rounded-lg"><MessageCircle size={24}/></div>
                    <h4 className="text-lg font-bold text-white mb-2">Interação</h4>
                    <p className="text-xs text-mystic-400 leading-relaxed">
                        Negociar, intimidar ou enganar. O "Roleplay". Use <strong>Carisma</strong> para mudar a mente dos NPCs sem sacar a espada.
                    </p>
                </div>

                {/* Section 4: Creation Steps Loop */}
                <div className="md:col-span-12 mt-8">
                     <h3 className="text-2xl font-display font-bold text-white mb-6 pl-4 border-l-4 border-indigo-500">Passo a Passo da Criação</h3>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {GUIDE_STEPS.map((step, idx) => (
                            <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
                                <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05] font-display font-black text-white group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </div>
                                <div className="text-2xl mb-3">{step.icon}</div>
                                <h4 className="font-bold text-white mb-2">{step.title}</h4>
                                <p className="text-xs text-mystic-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Section 5: Glossary */}
                <div className="md:col-span-12 mt-8 glass-panel p-8 rounded-[2rem] bg-void-950/80">
                     <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="text-mystic-500" />
                        <h3 className="text-xl font-display font-bold text-white">Glossário Rápido</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="mt-1"><ShieldAlert size={20} className="text-green-400" /></div>
                            <div>
                                <strong className="text-green-400 block mb-1">Vantagem</strong>
                                <p className="text-sm text-mystic-400">Jogue 2 dados d20 e fique com o <strong>maior</strong> resultado. Acontece quando você está em uma posição favorável.</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <div className="mt-1"><ShieldAlert size={20} className="text-red-400" /></div>
                            <div>
                                <strong className="text-red-400 block mb-1">Desvantagem</strong>
                                <p className="text-sm text-mystic-400">Jogue 2 dados d20 e fique com o <strong>menor</strong> resultado. Acontece quando você está cego, caído ou atrapalhado.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><ShieldAlert size={20} className="text-purple-400" /></div>
                            <div>
                                <strong className="text-purple-400 block mb-1">Teste de Resistência (Save)</strong>
                                <p className="text-sm text-mystic-400">Uma reação instintiva para evitar algo ruim (ex: esquivar de uma bola de fogo ou resistir a veneno).</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1"><ShieldAlert size={20} className="text-gold-400" /></div>
                            <div>
                                <strong className="text-gold-400 block mb-1">Ação Bônus</strong>
                                <p className="text-sm text-mystic-400">Uma ação extra e rápida que algumas classes podem fazer no turno, além da ação principal.</p>
                            </div>
                        </div>
                     </div>
                </div>

            </div>
        </div>
    );
};