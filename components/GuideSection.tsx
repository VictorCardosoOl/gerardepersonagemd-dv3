import React, { useState } from 'react';
import { GUIDE_STEPS } from '../constants';
import { Compass, BookOpen, Dices, ShieldAlert, Sparkles, Sword, Eye, Search, Zap, Hand, Footprints, Clock, Flame, Droplets, Skull, Ghost, Heart } from 'lucide-react';
import { SPELLS_BR, Spell } from '../data/spells_br';

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

// --- SUB-COMPONENTS ---

const CombatActionCard: React.FC<{ 
    title: string; 
    icon: React.ElementType; 
    color: string; 
    desc: string; 
    examples: string[] 
}> = ({ title, icon: Icon, color, desc, examples }) => (
    <div className="glass-panel p-6 rounded-[2rem] hover:bg-white/5 transition-all group border border-white/5 hover:border-white/20 h-full flex flex-col">
        <div className={`w-12 h-12 rounded-2xl ${color.replace('text-', 'bg-')}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon size={24} className={color} />
        </div>
        <h4 className={`text-xl font-display font-bold text-white mb-2`}>{title}</h4>
        <p className="text-sm text-mystic-300 font-light leading-relaxed mb-4">{desc}</p>
        <div className="mt-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-500 block mb-2">Exemplos:</span>
            <div className="flex flex-wrap gap-2">
                {examples.map(ex => (
                    <span key={ex} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-mystic-200">{ex}</span>
                ))}
            </div>
        </div>
    </div>
);

const SpellCard: React.FC<{ spell: Spell }> = ({ spell }) => {
    let SchoolIcon = Sparkles;
    let schoolColor = "text-white";
    
    switch(spell.school) {
        case 'Evocação': SchoolIcon = Flame; schoolColor = "text-orange-400"; break;
        case 'Cura': SchoolIcon = Heart; schoolColor = "text-rose-400"; break;
        case 'Necromancia': SchoolIcon = Skull; schoolColor = "text-emerald-400"; break;
        case 'Ilusão': SchoolIcon = Ghost; schoolColor = "text-purple-400"; break;
        case 'Abjuracao': SchoolIcon = ShieldAlert; schoolColor = "text-blue-400"; break;
    }

    return (
        <div className="glass-panel p-5 rounded-2xl hover:bg-white/5 transition-all group border border-white/5 hover:border-cyan-500/30 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <SchoolIcon size={14} className={schoolColor} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${schoolColor}`}>{spell.school}</span>
                </div>
                <span className="text-[10px] font-mono text-mystic-500 bg-void-950/50 px-1.5 py-0.5 rounded">
                    {spell.level === 0 ? "Truque" : `Nível ${spell.level}`}
                </span>
            </div>
            
            <h4 className="font-display font-bold text-lg text-white mb-2 group-hover:text-cyan-200 transition-colors">{spell.name}</h4>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] text-mystic-400 mb-3 font-mono">
                <span className="flex items-center gap-1"><Clock size={10}/> {spell.castingTime}</span>
                <span className="flex items-center gap-1"><Footprints size={10}/> {spell.range}</span>
            </div>

            <p className="text-xs text-mystic-300 font-light leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                {spell.desc}
            </p>
        </div>
    );
};

export const GuideSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState('basics');
    const [glossarySearch, setGlossarySearch] = useState('');
    const [spellLevelFilter, setSpellLevelFilter] = useState<'all' | number>('all');
    
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

    const filteredSpells = SPELLS_BR.filter(s => spellLevelFilter === 'all' ? true : s.level === spellLevelFilter);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 animate-fade-in pb-32">
            
            {/* Header Hero */}
            <div className="text-center mb-16 relative">
                <div className="inline-flex items-center justify-center p-5 bg-void-900/50 rounded-[2rem] mb-6 animate-float shadow-glass border border-white/10 backdrop-blur-md">
                    <Compass size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-8xl font-display font-black text-white mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    Grimório do <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Iniciante</span>
                </h2>
                <p className="text-xl text-mystic-300 max-w-2xl mx-auto leading-relaxed font-body font-light">
                    O RPG de mesa é uma conversa onde o destino é decidido pelos dados. Aqui estão os segredos para dominar a masmorra.
                </p>
            </div>

            {/* Floating Navigation Tabs */}
            <div className="flex justify-center mb-16">
                <div className="flex flex-wrap justify-center gap-2 p-2 rounded-full bg-void-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                    {GUIDE_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-void-950 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-mystic-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[600px] relative">
                <div className="absolute inset-0 bg-void-900/20 blur-3xl -z-10 rounded-full opacity-50"></div>

                {/* --- BASICS TAB --- */}
                {activeTab === 'basics' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in-up">
                        
                        {/* Interactive Dice Simulator */}
                        <div className="md:col-span-7 glass-panel p-10 rounded-[2.5rem] relative overflow-hidden bg-void-900/60 border-cyan-500/20 shadow-glass">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-cyan-900/30 rounded-2xl text-cyan-400 border border-cyan-500/30"><Dices size={28} /></div>
                                    <h3 className="text-3xl font-display font-bold text-white">A Regra de Ouro</h3>
                                </div>
                                
                                <p className="text-mystic-200 leading-relaxed mb-8 text-lg font-light">
                                    Tudo no D&D segue esta fórmula simples: role um <strong>d20</strong>, some seu atributo e tente superar a Dificuldade (CD).
                                </p>
                                
                                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                                    <div className="p-6 bg-void-950/80 rounded-2xl border border-white/10 text-sm text-mystic-400 font-mono space-y-3">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Desafio:</span>
                                            <span className="text-white font-bold">Arrombar Porta (CD 15)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Seu Atributo:</span>
                                            <span className="text-cyan-400 font-bold">+3 Força</span>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col gap-4">
                                        <button 
                                            onClick={handleSimulateRoll}
                                            disabled={isRolling}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-cyan-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-400/20"
                                        >
                                            {isRolling ? <Zap className="animate-spin" /> : <Hand />} 
                                            {isRolling ? 'Rolando...' : 'Testar Força'}
                                        </button>

                                        {simResult && (
                                            <div className="text-center animate-scale-in p-3 bg-void-950/50 rounded-xl border border-white/5">
                                                <div className="text-3xl font-display font-black text-white">
                                                    {simResult.total}
                                                </div>
                                                <div className={`text-xs font-bold uppercase tracking-widest mt-1 ${simResult.success ? 'text-green-400' : 'text-rose-400'}`}>
                                                    {simResult.success ? 'Sucesso! 🎉' : 'Falha ❌'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proficiency Info */}
                        <div className="md:col-span-5 glass-panel p-10 rounded-[2.5rem] flex flex-col justify-center bg-void-900/40 relative overflow-hidden">
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                            <h3 className="text-2xl font-display font-bold text-gold-400 mb-6 flex items-center gap-3">
                                <Sparkles size={24} /> Bônus de Proficiência
                            </h3>
                            <p className="text-mystic-300 text-base leading-relaxed mb-6">
                                É o número que define o quão treinado seu herói é. Ele começa como <span className="text-void-950 font-bold bg-gold-400 px-2 py-0.5 rounded text-sm shadow-glow-gold mx-1">+2</span> e sobe com o nível.
                            </p>
                            <p className="text-mystic-300 text-base leading-relaxed">
                                Você soma este número em tudo que você sabe fazer bem: ataques com armas que conhece, perícias treinadas e magias.
                            </p>
                        </div>

                        {/* Creation Steps */}
                         <div className="md:col-span-12 mt-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-mystic-500 mb-8 pl-4 border-l-2 border-cyan-500">Fluxo de Criação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {GUIDE_STEPS.map((step, idx) => (
                                    <div key={idx} className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group hover:bg-white/5 transition-all border-white/5 hover:border-cyan-500/20">
                                        <div className="absolute -right-6 -top-6 text-8xl opacity-[0.03] font-display font-black text-white group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{step.icon}</div>
                                        <h4 className="font-bold text-white mb-3 font-display text-lg">{step.title}</h4>
                                        <p className="text-xs text-mystic-400 leading-relaxed font-light">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- COMBAT TAB --- */}
                {activeTab === 'combat' && (
                    <div className="animate-fade-in-up space-y-10">
                        <div className="text-center mb-8">
                             <h3 className="text-3xl font-display font-bold text-white mb-4">Economia de Ação</h3>
                             <p className="text-mystic-400 font-light max-w-2xl mx-auto">Em seu turno, você pode se mover e realizar <strong>uma Ação</strong>. Se sua classe permitir, você também pode ter uma <strong>Ação Bônus</strong>.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[400px]">
                            <CombatActionCard 
                                title="Ação"
                                icon={Sword}
                                color="text-rose-400"
                                desc="A principal coisa que você faz. Atacar, lançar uma magia poderosa ou tentar algo arriscado."
                                examples={["Atacar", "Conjurar Magia", "Disparada", "Desengajar", "Ajudar", "Esconder"]}
                            />
                            <CombatActionCard 
                                title="Ação Bônus"
                                icon={Sparkles}
                                color="text-gold-400"
                                desc="Uma ação extra, muito rápida. Nem todo mundo tem. Depende da sua Classe ou Feitiços."
                                examples={["Ataque com 2ª arma", "Fúria (Bárbaro)", "Inspiração (Bardo)", "Passo Nebuloso"]}
                            />
                            <CombatActionCard 
                                title="Movimento"
                                icon={Footprints}
                                color="text-emerald-400"
                                desc="Você pode se mover até seu deslocamento máximo (geralmente 9m). Pode quebrar o movimento antes e depois da ação."
                                examples={["Andar", "Subir escadas", "Levantar-se (gasta metade)", "Saltar"]}
                            />
                            <CombatActionCard 
                                title="Reação"
                                icon={Clock}
                                color="text-cyan-400"
                                desc="Uma resposta instantânea a algo que acontece fora do seu turno. Você só tem UMA por rodada."
                                examples={["Ataque de Oportunidade", "Magia 'Escudo Arcano'", "Magia 'Contra-Mágica'"]}
                            />
                        </div>
                    </div>
                )}

                {/* --- MAGIC TAB (SPELLBOOK) --- */}
                {activeTab === 'magic' && (
                    <div className="animate-fade-in-up">
                        <div className="glass-panel p-8 rounded-[3rem] bg-void-900/40 border-purple-500/20 relative overflow-hidden mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none"></div>
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                                <div>
                                    <h3 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
                                        <Sparkles className="text-purple-400" /> Grimório do Iniciante
                                    </h3>
                                    <p className="text-mystic-300 font-light">Uma seleção de magias essenciais para começar sua jornada arcana.</p>
                                </div>
                                <div className="flex bg-void-950/50 p-1 rounded-xl border border-white/10">
                                    <button onClick={() => setSpellLevelFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${spellLevelFilter === 'all' ? 'bg-white text-void-950' : 'text-mystic-500 hover:text-white'}`}>Todas</button>
                                    <button onClick={() => setSpellLevelFilter(0)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${spellLevelFilter === 0 ? 'bg-purple-500 text-white' : 'text-mystic-500 hover:text-purple-400'}`}>Truques</button>
                                    <button onClick={() => setSpellLevelFilter(1)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${spellLevelFilter === 1 ? 'bg-gold-500 text-white' : 'text-mystic-500 hover:text-gold-400'}`}>Nível 1</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSpells.map(spell => (
                                <SpellCard key={spell.id} spell={spell} />
                            ))}
                        </div>
                    </div>
                )}

                {/* --- GLOSSARY TAB --- */}
                {activeTab === 'glossary' && (
                    <div className="glass-panel p-10 rounded-[2.5rem] bg-void-950/80 animate-fade-in-up min-h-[600px] border-white/5">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl"><BookOpen className="text-mystic-500" /></div>
                                <h3 className="text-2xl font-display font-bold text-white">Dicionário de Regras</h3>
                            </div>
                            <div className="relative w-full md:w-80 group">
                                <input 
                                    type="text" 
                                    placeholder="Buscar termo..." 
                                    value={glossarySearch}
                                    onChange={(e) => setGlossarySearch(e.target.value)}
                                    className="w-full bg-void-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-all"
                                />
                                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredGlossary.length > 0 ? filteredGlossary.map((item, i) => (
                                <div key={i} className="flex gap-5 p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10 group">
                                    <div className="mt-1"><ShieldAlert size={24} className={`${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} /></div>
                                    <div>
                                        <strong className={`${item.color} block mb-2 text-lg font-display tracking-wide`}>{item.term}</strong>
                                        <p className="text-sm text-mystic-400 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center text-slate-500 py-20 flex flex-col items-center gap-4">
                                    <Search size={40} className="opacity-20" />
                                    <span>Nenhum termo arcano encontrado.</span>
                                </div>
                            )}
                         </div>
                    </div>
                )}

            </div>
        </div>
    );
};
