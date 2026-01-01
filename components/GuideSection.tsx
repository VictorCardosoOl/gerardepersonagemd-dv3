import React, { useState } from 'react';
import { GUIDE_STEPS } from '../constants';
import { Compass, BookOpen, Dices, ShieldAlert, Sparkles, Sword, Eye, Search, Zap, Hand } from 'lucide-react';

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
        <div className="max-w-[1440px] mx-auto py-24 px-6 md:px-12 animate-fade-in pb-40">
            
            {/* Header Hero */}
            <div className="text-center mb-24 relative">
                <div className="inline-flex items-center justify-center p-6 bg-void-900/50 rounded-[2rem] mb-8 animate-float shadow-glass border border-white/10 backdrop-blur-md">
                    <Compass size={56} className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]" strokeWidth={1.5} />
                </div>
                <h2 className="text-6xl md:text-9xl font-display font-black text-white mb-8 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    Grimório do <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Iniciante</span>
                </h2>
                <p className="text-2xl text-mystic-300 max-w-3xl mx-auto leading-relaxed font-body font-light">
                    O RPG de mesa é uma conversa onde o destino é decidido pelos dados. Aqui estão os segredos para dominar a masmorra.
                </p>
            </div>

            {/* Floating Navigation Tabs */}
            <div className="flex justify-center mb-20">
                <div className="flex flex-wrap justify-center gap-2 p-3 rounded-full bg-void-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {GUIDE_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-void-950 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-mystic-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[700px] relative">
                <div className="absolute inset-0 bg-void-900/20 blur-3xl -z-10 rounded-full opacity-50"></div>

                {/* --- BASICS TAB --- */}
                {activeTab === 'basics' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 animate-fade-in-up">
                        
                        {/* Interactive Dice Simulator */}
                        <div className="md:col-span-7 glass-panel p-12 rounded-[2.5rem] relative overflow-hidden bg-void-900/60 border-cyan-500/20 shadow-glass">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="p-4 bg-cyan-900/30 rounded-2xl text-cyan-400 border border-cyan-500/30"><Dices size={32} /></div>
                                    <h3 className="text-4xl font-display font-bold text-white">A Regra de Ouro</h3>
                                </div>
                                
                                <p className="text-mystic-200 leading-relaxed mb-10 text-xl font-light">
                                    Tudo no D&D segue esta fórmula simples: role um <strong>d20</strong>, some seu atributo e tente superar a Dificuldade (CD).
                                </p>
                                
                                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                                    <div className="p-8 bg-void-950/80 rounded-[2rem] border border-white/10 text-base text-mystic-400 font-mono space-y-4">
                                        <div className="flex justify-between border-b border-white/5 pb-3">
                                            <span>Desafio:</span>
                                            <span className="text-white font-bold">Arrombar Porta (CD 15)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Seu Atributo:</span>
                                            <span className="text-cyan-400 font-bold">+3 Força</span>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col gap-5">
                                        <button 
                                            onClick={handleSimulateRoll}
                                            disabled={isRolling}
                                            className="w-full py-5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-cyan-900/50 transition-all active:scale-95 flex items-center justify-center gap-3 border border-cyan-400/20 text-lg"
                                        >
                                            {isRolling ? <Zap className="animate-spin" /> : <Hand />} 
                                            {isRolling ? 'Rolando...' : 'Testar Força'}
                                        </button>

                                        {simResult && (
                                            <div className="text-center animate-scale-in p-4 bg-void-950/50 rounded-2xl border border-white/5">
                                                <div className="text-4xl font-display font-black text-white">
                                                    {simResult.total}
                                                </div>
                                                <div className={`text-xs font-bold uppercase tracking-widest mt-2 ${simResult.success ? 'text-green-400' : 'text-rose-400'}`}>
                                                    {simResult.success ? 'Sucesso! 🎉' : 'Falha ❌'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proficiency Info */}
                        <div className="md:col-span-5 glass-panel p-12 rounded-[2.5rem] flex flex-col justify-center bg-void-900/40 relative overflow-hidden">
                             <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                            <h3 className="text-3xl font-display font-bold text-gold-400 mb-8 flex items-center gap-4">
                                <Sparkles size={32} /> Bônus de Proficiência
                            </h3>
                            <p className="text-mystic-300 text-lg leading-relaxed mb-8 font-light">
                                É o número que define o quão treinado seu herói é. Ele começa como <span className="text-void-950 font-bold bg-gold-400 px-3 py-1 rounded-lg text-sm shadow-glow-gold mx-1">+2</span> e sobe com o nível.
                            </p>
                            <p className="text-mystic-300 text-lg leading-relaxed font-light">
                                Você soma este número em tudo que você sabe fazer bem: ataques com armas que conhece, perícias treinadas e magias.
                            </p>
                        </div>

                        {/* Creation Steps */}
                         <div className="md:col-span-12 mt-8">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-mystic-500 mb-10 pl-6 border-l-4 border-cyan-500">Fluxo de Criação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {GUIDE_STEPS.map((step, idx) => (
                                    <div key={idx} className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/5 transition-all border-white/5 hover:border-cyan-500/20">
                                        <div className="absolute -right-6 -top-6 text-9xl opacity-[0.03] font-display font-black text-white group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{step.icon}</div>
                                        <h4 className="font-bold text-white mb-4 font-display text-xl">{step.title}</h4>
                                        <p className="text-sm text-mystic-400 leading-relaxed font-light">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- COMBAT TAB --- */}
                {activeTab === 'combat' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-fade-in-up">
                         <div className="glass-panel p-10 rounded-[3rem] border-t-8 border-t-rose-500 bg-void-900/40 hover:-translate-y-2 transition-transform duration-500">
                            <div className="mb-8 text-rose-400 bg-rose-500/10 w-fit p-5 rounded-3xl"><Sword size={32}/></div>
                            <h4 className="text-3xl font-display font-bold text-white mb-6">O Turno</h4>
                            <p className="text-base text-mystic-300 leading-relaxed space-y-4 font-light">
                                <span className="block p-3 bg-white/5 rounded-2xl border border-white/5">🏃 <strong>Movimento:</strong> Ande até seu deslocamento (9m).</span>
                                <span className="block p-3 bg-white/5 rounded-2xl border border-white/5">⚔️ <strong>Ação:</strong> Atacar, Conjurar, Disparar.</span>
                                <span className="block p-3 bg-white/5 rounded-2xl border border-white/5">⚡ <strong>Ação Bônus:</strong> Algo rápido (se permitido).</span>
                            </p>
                        </div>
                        <div className="glass-panel p-10 rounded-[3rem] border-t-8 border-t-cyan-400 bg-void-900/40 hover:-translate-y-2 transition-transform duration-500">
                            <div className="mb-8 text-cyan-400 bg-cyan-400/10 w-fit p-5 rounded-3xl"><ShieldAlert size={32}/></div>
                            <h4 className="text-3xl font-display font-bold text-white mb-6">Defesa (CA)</h4>
                            <p className="text-base text-mystic-300 leading-relaxed font-light mb-8">
                                A Classe de Armadura é o número alvo. Se o ataque do inimigo for <strong>igual ou maior</strong> que sua CA, você é atingido. Armaduras e Escudos aumentam isso.
                            </p>
                            <div className="mt-6 text-center text-5xl font-mono text-white/20 font-bold">d20 ≥ CA</div>
                        </div>
                        <div className="glass-panel p-10 rounded-[3rem] border-t-8 border-t-gold-500 bg-void-900/40 hover:-translate-y-2 transition-transform duration-500">
                            <div className="mb-8 text-gold-500 bg-gold-500/10 w-fit p-5 rounded-3xl"><Eye size={32}/></div>
                            <h4 className="text-3xl font-display font-bold text-white mb-6">Vida (PV)</h4>
                            <p className="text-base text-mystic-300 leading-relaxed font-light mb-8">
                                Seus Pontos de Vida chegam a 0? Você cai <strong>inconsciente</strong>. Você deve fazer testes contra a morte a cada turno.
                            </p>
                            <div className="mt-4 flex justify-center gap-3">
                                <span className="w-4 h-4 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                <span className="w-4 h-4 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                <span className="w-4 h-4 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-sm text-white uppercase mx-3 font-bold tracking-widest">VS</span>
                                <span className="w-4 h-4 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                                <span className="w-4 h-4 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                                <span className="w-4 h-4 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MAGIC TAB --- */}
                {activeTab === 'magic' && (
                    <div className="glass-panel p-16 rounded-[4rem] text-center animate-fade-in-up bg-void-900/40 border-purple-500/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                        <Sparkles size={80} className="text-purple-400 mx-auto mb-10 drop-shadow-2xl" />
                        <h3 className="text-5xl font-display font-black text-white mb-8">A Arte Arcana</h3>
                        <p className="text-mystic-200 text-xl max-w-4xl mx-auto mb-16 leading-relaxed font-light">
                            Magia em D&D custa energia. Pense nos seus <strong>Espaços de Magia (Spell Slots)</strong> como munição recarregável. 
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
                            <div className="p-10 bg-void-950/50 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-colors group">
                                <strong className="text-purple-400 block mb-4 text-2xl font-display group-hover:text-purple-300">Truques (Nível 0)</strong>
                                <span className="text-base text-mystic-400 font-light leading-relaxed">Feitiços simples que se tornaram segunda natureza. Podem ser conjurados à vontade, infinitamente. Ex: <em>Luz, Mãos Mágicas, Rajada Mística</em>.</span>
                            </div>
                            <div className="p-10 bg-void-950/50 rounded-[3rem] border border-white/5 hover:border-gold-500/30 transition-colors group">
                                <strong className="text-gold-400 block mb-4 text-2xl font-display group-hover:text-gold-300">Magias Preparadas</strong>
                                <span className="text-base text-mystic-400 font-light leading-relaxed">Magias mais poderosas que requerem estudo diário ou oração. Você escolhe quais levar para a batalha após cada descanso longo.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- GLOSSARY TAB --- */}
                {activeTab === 'glossary' && (
                    <div className="glass-panel p-12 rounded-[3rem] bg-void-950/80 animate-fade-in-up min-h-[700px] border-white/5">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl"><BookOpen size={28} className="text-mystic-500" /></div>
                                <h3 className="text-3xl font-display font-bold text-white">Dicionário de Regras</h3>
                            </div>
                            <div className="relative w-full md:w-96 group">
                                <input 
                                    type="text" 
                                    placeholder="Buscar termo..." 
                                    value={glossarySearch}
                                    onChange={(e) => setGlossarySearch(e.target.value)}
                                    className="w-full bg-void-900 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-base text-white focus:border-cyan-500 focus:outline-none transition-all"
                                />
                                <Search size={20} className="absolute left-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredGlossary.length > 0 ? filteredGlossary.map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10 group">
                                    <div className="mt-1"><ShieldAlert size={28} className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} /></div>
                                    <div>
                                        <strong className={`${item.color} block mb-3 text-xl font-display tracking-wide`}>{item.term}</strong>
                                        <p className="text-base text-mystic-400 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center text-slate-500 py-32 flex flex-col items-center gap-6">
                                    <Search size={64} className="opacity-20" />
                                    <span className="text-lg">Nenhum termo arcano encontrado.</span>
                                </div>
                            )}
                         </div>
                    </div>
                )}

            </div>
        </div>
    );
};