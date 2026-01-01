import React, { useState } from 'react';
import { GUIDE_STEPS } from '../constants';
import { Compass, BookOpen, Dices, ShieldAlert, Sparkles, Sword, MessageCircle, Eye, Search, Zap, Hand } from 'lucide-react';

const GUIDE_TABS = [
    { id: 'basics', label: 'Fundamentos' },
    { id: 'combat', label: 'Combate' },
    { id: 'magic', label: 'Magia' },
    { id: 'glossary', label: 'Glossário' }
];

const GLOSSARY_ITEMS = [
    { term: "Vantagem", desc: "Jogue 2 dados d20 e fique com o MAIOR resultado. Acontece em posições favoráveis.", color: "text-green-400" },
    { term: "Desvantagem", desc: "Jogue 2 dados d20 e fique com o MENOR resultado. Acontece em posições ruins (cego, caído).", color: "text-red-400" },
    { term: "Teste de Resistência (Save)", desc: "Uma reação instintiva para evitar algo ruim (ex: esquivar de fogo ou resistir a veneno).", color: "text-purple-400" },
    { term: "Ação Bônus", desc: "Uma ação extra rápida que algumas classes podem fazer no turno, além da ação principal.", color: "text-gold-400" },
    { term: "Reação", desc: "Uma resposta instantânea a um gatilho, como o Ataque de Oportunidade quando inimigo foge.", color: "text-cyan-400" },
    { term: "Iniciativa", desc: "Teste de Destreza no início do combate para decidir quem age primeiro.", color: "text-white" },
    { term: "Classe de Armadura (CA)", desc: "O número que o inimigo precisa tirar no dado para te acertar.", color: "text-blue-400" },
];

export const GuideSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState('basics');
    const [glossarySearch, setGlossarySearch] = useState('');
    
    // Dice Simulator State
    const [simResult, setSimResult] = useState<{ die: number, total: number, success: boolean } | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const handleSimulateRoll = () => {
        setIsRolling(true);
        setSimResult(null);
        setTimeout(() => {
            const die = Math.floor(Math.random() * 20) + 1;
            const mod = 3;
            const total = die + mod;
            setSimResult({ die, total, success: total >= 15 });
            setIsRolling(false);
        }, 600);
    };

    const filteredGlossary = GLOSSARY_ITEMS.filter(item => 
        item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.desc.toLowerCase().includes(glossarySearch.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in pb-32">
            
            {/* Header Hero */}
            <div className="text-center mb-12 relative">
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

            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {GUIDE_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-void-950 shadow-glow-cyan' : 'bg-void-900 border border-white/10 text-mystic-500 hover:text-white'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[500px]">
                
                {/* --- BASICS TAB --- */}
                {activeTab === 'basics' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in-up">
                        
                        {/* Interactive Dice Simulator */}
                        <div className="md:col-span-7 glass-panel p-8 rounded-[2rem] relative overflow-hidden bg-void-900/80 border-cyan-500/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 h-full">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-cyan-900/30 rounded-xl text-cyan-400 border border-cyan-500/30"><Dices size={24} /></div>
                                        <h3 className="text-2xl font-display font-bold text-white">A Regra de Ouro</h3>
                                    </div>
                                    <p className="text-mystic-200 leading-relaxed mb-6">
                                        Tudo no D&D segue esta fórmula: role um <strong>d20</strong>, some seu atributo e tente superar a dificuldade (CD).
                                    </p>
                                    <div className="p-4 bg-void-950 rounded-xl border border-white/10 text-sm text-mystic-400 font-mono">
                                        <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
                                            <span>Desafio:</span>
                                            <span className="text-white">Arrombar Porta (CD 15)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Seu Atributo:</span>
                                            <span className="text-cyan-400 font-bold">+3 Força</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full flex flex-col items-center justify-center bg-void-950/50 rounded-2xl p-6 border border-white/5">
                                    <button 
                                        onClick={handleSimulateRoll}
                                        disabled={isRolling}
                                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-cyan-900/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isRolling ? <Zap className="animate-spin" /> : <Hand />} 
                                        {isRolling ? 'Rolando...' : 'Testar Força'}
                                    </button>

                                    {simResult && (
                                        <div className="mt-6 text-center animate-scale-in">
                                            <div className="text-4xl font-display font-black text-white mb-2">
                                                {simResult.total}
                                            </div>
                                            <div className="text-xs text-mystic-400 font-mono mb-3">
                                                Dado ({simResult.die}) + Mod (3)
                                            </div>
                                            <div className={`text-sm font-bold uppercase tracking-widest px-4 py-1 rounded-full ${simResult.success ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                {simResult.success ? 'Sucesso! A porta cedeu.' : 'Falha. A porta nem mexeu.'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Proficency Info */}
                        <div className="md:col-span-5 glass-panel p-8 rounded-[2rem] flex flex-col justify-center bg-void-900/40">
                            <h3 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-2">
                                <Sparkles size={20} /> Bônus de Proficiência
                            </h3>
                            <p className="text-mystic-300 text-sm leading-relaxed mb-4">
                                É o número que define o quão treinado seu herói é. Ele começa como <span className="text-white font-bold bg-white/10 px-1 rounded">+2</span> e sobe com o nível.
                            </p>
                            <p className="text-mystic-300 text-sm leading-relaxed">
                                Você soma este número em tudo que você sabe fazer bem: ataques com armas que conhece, perícias treinadas e magias.
                            </p>
                        </div>

                        {/* Creation Steps */}
                         <div className="md:col-span-12 mt-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-mystic-500 mb-6 pl-2 border-l-2 border-cyan-500">Fluxo de Criação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {GUIDE_STEPS.map((step, idx) => (
                                    <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
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
                    </div>
                )}

                {/* --- COMBAT TAB --- */}
                {activeTab === 'combat' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                         <div className="glass-panel p-6 rounded-[2rem] border-t-4 border-t-accent-rose bg-void-900/40">
                            <div className="mb-4 text-accent-rose bg-accent-rose/10 w-fit p-3 rounded-xl"><Sword size={24}/></div>
                            <h4 className="text-xl font-bold text-white mb-3">O Turno</h4>
                            <p className="text-sm text-mystic-400 leading-relaxed space-y-2">
                                <span className="block">• <strong>Movimento:</strong> Ande até seu deslocamento (9m).</span>
                                <span className="block">• <strong>Ação:</strong> Atacar, Conjurar, Disparar, Ajudar.</span>
                                <span className="block">• <strong>Ação Bônus:</strong> Algo rápido (se sua classe permitir).</span>
                            </p>
                        </div>
                        <div className="glass-panel p-6 rounded-[2rem] border-t-4 border-t-cyan-400 bg-void-900/40">
                            <div className="mb-4 text-cyan-400 bg-cyan-400/10 w-fit p-3 rounded-xl"><ShieldAlert size={24}/></div>
                            <h4 className="text-xl font-bold text-white mb-3">Defesa (CA)</h4>
                            <p className="text-sm text-mystic-400 leading-relaxed">
                                A Classe de Armadura é o número alvo. Se o ataque do inimigo for <strong>igual ou maior</strong> que sua CA, você é atingido. Armaduras e Escudos aumentam isso.
                            </p>
                        </div>
                        <div className="glass-panel p-6 rounded-[2rem] border-t-4 border-t-gold-500 bg-void-900/40">
                            <div className="mb-4 text-gold-500 bg-gold-500/10 w-fit p-3 rounded-xl"><Eye size={24}/></div>
                            <h4 className="text-xl font-bold text-white mb-3">Vida (PV)</h4>
                            <p className="text-sm text-mystic-400 leading-relaxed">
                                Seus Pontos de Vida chegam a 0? Você cai <strong>inconsciente</strong>. Você deve fazer testes contra a morte a cada turno. 3 sucessos estabilizam, 3 falhas matam.
                            </p>
                        </div>
                    </div>
                )}

                {/* --- MAGIC TAB --- */}
                {activeTab === 'magic' && (
                    <div className="glass-panel p-10 rounded-[2rem] text-center animate-fade-in-up">
                        <Sparkles size={48} className="text-purple-400 mx-auto mb-6" />
                        <h3 className="text-3xl font-display font-bold text-white mb-4">A Arte Arcana</h3>
                        <p className="text-mystic-300 max-w-2xl mx-auto mb-8">
                            Magia em D&D custa energia. Pense nos seus <strong>Espaços de Magia (Spell Slots)</strong> como munição. 
                            Você tem x balas por dia. Truques (Cantrips) são magias simples que não gastam munição (infinitas).
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                            <div className="p-4 bg-void-950 rounded-xl border border-white/10">
                                <strong className="text-purple-400 block mb-1">Truques (Nível 0)</strong>
                                <span className="text-xs text-mystic-400">Magias simples de prática. Podem ser usadas à vontade. Ex: Luz, Mãos Mágicas.</span>
                            </div>
                            <div className="p-4 bg-void-950 rounded-xl border border-white/10">
                                <strong className="text-gold-400 block mb-1">Magias Preparadas</strong>
                                <span className="text-xs text-mystic-400">Clérigos e Magos precisam escolher quais magias levarão para a batalha após acordar.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- GLOSSARY TAB --- */}
                {activeTab === 'glossary' && (
                    <div className="glass-panel p-8 rounded-[2rem] bg-void-950/80 animate-fade-in-up min-h-[500px]">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-mystic-500" />
                                <h3 className="text-xl font-display font-bold text-white">Dicionário de Regras</h3>
                            </div>
                            <div className="relative w-full md:w-64">
                                <input 
                                    type="text" 
                                    placeholder="Buscar termo..." 
                                    value={glossarySearch}
                                    onChange={(e) => setGlossarySearch(e.target.value)}
                                    className="w-full bg-void-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                />
                                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGlossary.length > 0 ? filteredGlossary.map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="mt-1"><ShieldAlert size={20} className={item.color} /></div>
                                    <div>
                                        <strong className={`${item.color} block mb-1 text-lg`}>{item.term}</strong>
                                        <p className="text-sm text-mystic-300 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center text-slate-500 py-12">Nenhum termo encontrado.</div>
                            )}
                         </div>
                    </div>
                )}

            </div>
        </div>
    );
};