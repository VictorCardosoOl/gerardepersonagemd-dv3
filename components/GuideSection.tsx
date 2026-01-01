import React, { useState } from 'react';
import { GUIDE_STEPS } from '../constants';
import { Compass, BookOpen, Dices, ShieldAlert, Sparkles, Sword, Eye, Search, Zap, Hand, Footprints, Clock, Flame, Heart, Skull, Ghost, Brain, BicepsFlexed, Moon, Sun, Backpack, Hammer, Crown, Shield } from 'lucide-react';
import { SPELLS_BR, Spell } from '../data/spells_br';
import { RulesRepository } from '../services/RulesRepository';
import { motion, LayoutGroup } from 'framer-motion';

const GUIDE_TABS = [
    { id: 'basics', label: 'Fundamentos' },
    { id: 'classes', label: 'Classes' },
    { id: 'attributes', label: 'Atributos' },
    { id: 'equipment', label: 'Equipamento' },
    { id: 'combat', label: 'Combate' },
    { id: 'survival', label: 'Sobrevivência' },
    { id: 'magic', label: 'Magia' },
    { id: 'glossary', label: 'Glossário' }
];

const ATTRIBUTE_INFO = [
    { name: "Força", abbr: "FOR", icon: BicepsFlexed, color: "text-red-400", desc: "Potência física natural.", skills: ["Atletismo", "Dano Corpo-a-Corpo", "Capacidade de Carga"] },
    { name: "Destreza", abbr: "DES", icon: ActivityIcon, color: "text-cyan-400", desc: "Agilidade, reflexos e equilíbrio.", skills: ["Furtividade", "Acrobacia", "Iniciativa", "Classe de Armadura (CA)"] },
    { name: "Constituição", abbr: "CON", icon: Heart, color: "text-green-400", desc: "Saúde, vigor e força vital.", skills: ["Pontos de Vida (HP)", "Resistir a Veneno", "Concentração em Magias"] },
    { name: "Inteligência", abbr: "INT", icon: Brain, color: "text-blue-400", desc: "Acuidade mental e memória.", skills: ["Arcanismo", "Investigação", "História", "Natureza"] },
    { name: "Sabedoria", abbr: "SAB", icon: Eye, color: "text-gold-400", desc: "Percepção e intuição.", skills: ["Percepção", "Medicina", "Sobrevivência", "Intuição"] },
    { name: "Carisma", abbr: "CAR", icon: Sparkles, color: "text-purple-400", desc: "Força de personalidade.", skills: ["Persuasão", "Intimidação", "Enganação", "Atuação"] },
];

const WEAPON_TYPES = [
    { name: "Armas Simples", desc: "Clavas, adagas, maças, lanças. Quase todo mundo sabe usar.", examples: "Dano: 1d4 a 1d8" },
    { name: "Armas Marciais", desc: "Espadas, machados grandes, arcos longos. Requer treinamento militar.", examples: "Dano: 1d8 a 2d6" },
];

const ARMOR_TYPES = [
    { name: "Armadura Leve", desc: "Couro, Couro Batido. Favorita de ladinos e patrulheiros.", stat: "+ Mod. Destreza total na CA" },
    { name: "Armadura Média", desc: "Gibão de Peles, Cota de Escamas. Equilíbrio entre proteção e mobilidade.", stat: "+ Mod. Destreza (máx +2) na CA" },
    { name: "Armadura Pesada", desc: "Cota de Malha, Placas. Para guerreiros e paladinos na linha de frente.", stat: "Sem bônus de Destreza. Desvantagem em Furtividade." },
];

const CONDITIONS = [
    { name: "Caído", desc: "Você está no chão. Ataques contra você têm Vantagem se o atacante estiver perto. Seus ataques têm Desvantagem.", icon: Footprints },
    { name: "Cego", desc: "Você falha automaticamente em testes de visão. Ataques contra você têm Vantagem. Seus ataques têm Desvantagem.", icon: Eye },
    { name: "Agarrado", desc: "Seu deslocamento torna-se 0. Você não pode se mover até se soltar (Ação de Atletismo/Acrobacia).", icon: Hand },
    { name: "Envenenado", desc: "Você tem Desvantagem em jogadas de ataque e testes de habilidade.", icon: Skull },
];

const GLOSSARY_ITEMS = [
    { term: "Vantagem", desc: "Jogue 2 dados d20 e fique com o MAIOR resultado. Acontece em posições favoráveis.", color: "text-green-400" },
    { term: "Desvantagem", desc: "Jogue 2 dados d20 e fique com o MENOR resultado. Acontece em posições ruins (cego, caído).", color: "text-red-400" },
    { term: "Teste de Resistência (Save)", desc: "Uma reação instintiva para evitar algo ruim (ex: esquivar de fogo ou resistir a veneno).", color: "text-purple-400" },
    { term: "Ação Bônus", desc: "Uma ação extra rápida que algumas classes podem fazer no turno, além da ação principal.", color: "text-gold-400" },
    { term: "Reação", desc: "Uma resposta instantânea a um gatilho, como o Ataque de Oportunidade quando inimigo foge.", color: "text-cyan-400" },
    { term: "Iniciativa", desc: "Teste de Destreza no início do combate para decidir quem age primeiro.", color: "text-white" },
    { term: "Classe de Armadura (CA)", desc: "O número que o inimigo precisa tirar no dado para te acertar.", color: "text-blue-400" },
    { term: "Proficiência", desc: "Seu bônus de treinamento (+2 no nv 1). Você soma isso em tudo que seu personagem 'sabe fazer' (armas, perícias).", color: "text-orange-400" },
    { term: "Rodada vs Turno", desc: "Uma Rodada é o ciclo completo onde todos agem (aprox. 6 segundos). Turno é a vez de um personagem específico.", color: "text-mystic-300" },
];

// --- HELPER ICONS ---
function ActivityIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> }

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
    
    const allClasses = RulesRepository.getClasses();

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
            <div className="flex justify-center mb-16 sticky top-28 z-30">
                <div className="flex flex-wrap justify-center gap-1.5 p-2 rounded-full bg-void-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <LayoutGroup id="guide-tabs">
                        {GUIDE_TABS.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-5 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 select-none z-10
                                    ${isActive ? 'text-void-950' : 'text-mystic-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-guide-tab"
                                            className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] -z-10"
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        />
                                    )}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </LayoutGroup>
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
                                
                                <p className="text-mystic-200 leading-relaxed mb-8 text-lg font-light text-secondary">
                                    Tudo no D&D segue esta fórmula simples: role um <strong>d20</strong>, some seu modificador e tente superar a Dificuldade (CD).
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
                            <p className="text-mystic-300 text-base leading-relaxed mb-6 text-secondary">
                                É o número que define o quão treinado seu herói é. Ele começa como <span className="text-void-950 font-bold bg-gold-400 px-2 py-0.5 rounded text-sm shadow-glow-gold mx-1">+2</span> e sobe com o nível.
                            </p>
                            <p className="text-mystic-300 text-base leading-relaxed text-secondary">
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
                                        <p className="text-xs text-mystic-400 leading-relaxed font-light text-secondary">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CLASSES TAB (NEW) --- */}
                {activeTab === 'classes' && (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-display font-bold text-white mb-4">Caminhos Heroicos</h3>
                            <p className="text-mystic-400 font-light max-w-2xl mx-auto text-secondary">Sua classe define como você luta, que magias usa e qual seu papel no grupo.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allClasses.map(cls => (
                                <div key={cls.name} className="glass-panel p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all group border border-white/5 hover:border-gold-500/30">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-display font-bold text-xl text-white group-hover:text-gold-400 transition-colors">{cls.name}</h4>
                                        <span className="text-[10px] font-bold uppercase bg-white/5 px-2 py-1 rounded text-mystic-500">d{cls.hitDie} Vida</span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-mystic-600 tracking-wider">Atributos Principais</span>
                                            <div className="flex gap-2 mt-1">
                                                {cls.primaryAttributes.map(attr => (
                                                    <span key={attr} className="text-xs text-cyan-300 font-mono bg-cyan-900/20 px-1.5 py-0.5 rounded border border-cyan-500/20">{attr.substring(0,3).toUpperCase()}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-mystic-600 tracking-wider">Proficiências</span>
                                            <p className="text-xs text-mystic-300 mt-1 leading-relaxed text-secondary">
                                                {cls.proficiencies.slice(0, 3).join(", ")}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- ATTRIBUTES TAB --- */}
                {activeTab === 'attributes' && (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-display font-bold text-white mb-4">Os 6 Pilares</h3>
                            <p className="text-mystic-400 font-light max-w-2xl mx-auto text-secondary">Cada criatura no multiverso é definida por estes seis números.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ATTRIBUTE_INFO.map(attr => (
                                <div key={attr.name} className="glass-panel p-6 rounded-[2rem] hover:border-white/20 transition-all group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-xl bg-white/5 ${attr.color}`}>
                                            <attr.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-xl text-white">{attr.name}</h4>
                                            <span className="text-xs font-bold uppercase tracking-widest text-mystic-500">{attr.abbr}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-mystic-300 font-light mb-6 border-b border-white/5 pb-4 text-secondary">{attr.desc}</p>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-mystic-600 block mb-2">Usado para:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {attr.skills.map(s => (
                                                <span key={s} className="px-2 py-1 rounded bg-white/5 text-[10px] text-mystic-200 border border-white/5">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- EQUIPMENT TAB (NEW) --- */}
                {activeTab === 'equipment' && (
                    <div className="animate-fade-in-up space-y-12">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Weapons */}
                             <div className="glass-panel p-8 rounded-[2.5rem] bg-rose-900/10 border-rose-500/20">
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                    <Sword className="text-rose-400" /> Arsenal
                                </h3>
                                <div className="space-y-6">
                                    {WEAPON_TYPES.map((wpn, i) => (
                                        <div key={i} className="bg-void-950/50 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-bold text-white">{wpn.name}</h4>
                                                <span className="text-xs text-rose-300 font-mono">{wpn.examples}</span>
                                            </div>
                                            <p className="text-sm text-mystic-400 text-secondary">{wpn.desc}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             {/* Armor */}
                             <div className="glass-panel p-8 rounded-[2.5rem] bg-blue-900/10 border-blue-500/20">
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                    <Shield className="text-blue-400" /> Proteção
                                </h3>
                                <div className="space-y-6">
                                    {ARMOR_TYPES.map((arm, i) => (
                                        <div key={i} className="bg-void-950/50 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between mb-2">
                                                <h4 className="font-bold text-white">{arm.name}</h4>
                                            </div>
                                            <p className="text-sm text-mystic-400 mb-2 text-secondary">{arm.desc}</p>
                                            <span className="text-xs text-blue-300 font-mono bg-blue-900/20 px-2 py-1 rounded">{arm.stat}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                         </div>
                    </div>
                )}

                {/* --- COMBAT TAB --- */}
                {activeTab === 'combat' && (
                    <div className="animate-fade-in-up space-y-16">
                        {/* Action Economy */}
                        <div className="space-y-8">
                            <div className="text-center">
                                 <h3 className="text-3xl font-display font-bold text-white mb-4">Economia de Ação</h3>
                                 <p className="text-mystic-400 font-light max-w-2xl mx-auto text-secondary">Em seu turno, você pode se mover e realizar <strong>uma Ação</strong>. Se sua classe permitir, você também pode ter uma <strong>Ação Bônus</strong>.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto md:h-[400px]">
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

                        {/* Conditions */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                <h3 className="text-2xl font-display font-bold text-white">Condições Comuns</h3>
                                <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase rounded border border-rose-500/20">Debuffs</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {CONDITIONS.map(cond => (
                                    <div key={cond.name} className="bg-void-950/50 border border-white/5 p-4 rounded-xl flex items-start gap-4">
                                        <cond.icon className="text-rose-400 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{cond.name}</h4>
                                            <p className="text-xs text-mystic-400 leading-relaxed text-secondary">{cond.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SURVIVAL TAB --- */}
                {activeTab === 'survival' && (
                    <div className="animate-fade-in-up space-y-8">
                        {/* Resting Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-panel p-8 rounded-[2.5rem] bg-emerald-900/10 border-emerald-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-400"><Sun size={100} /></div>
                                <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                                    <Clock className="text-emerald-400" /> Descanso Curto
                                </h3>
                                <p className="text-mystic-300 font-light mb-4 text-secondary">
                                    Uma pausa de pelo menos <strong>1 hora</strong> para enfaixar feridas e recuperar fôlego.
                                </p>
                                <ul className="space-y-2 text-sm text-mystic-200">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Você pode gastar Dados de Vida para se curar.</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Bruxo recupera magias.</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Guerreiro recupera "Retomar o Fôlego".</li>
                                </ul>
                            </div>

                            <div className="glass-panel p-8 rounded-[2.5rem] bg-indigo-900/10 border-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-400"><Moon size={100} /></div>
                                <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                                    <Moon className="text-indigo-400" /> Descanso Longo
                                </h3>
                                <p className="text-mystic-300 font-light mb-4 text-secondary">
                                    Um período de <strong>8 horas</strong> de sono e atividades leves. Só pode fazer 1 a cada 24h.
                                </p>
                                <ul className="space-y-2 text-sm text-mystic-200">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Recupera TODOS os Pontos de Vida (HP).</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Recupera metade dos Dados de Vida gastos.</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> Conjuradores recuperam todas as magias.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Death Saves Section */}
                        <div className="glass-panel p-8 md:p-12 rounded-[3rem] bg-void-950 border-rose-900/30 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <Skull size={48} className="text-rose-500 mx-auto mb-6 animate-pulse" />
                                <h3 className="text-3xl font-display font-bold text-white mb-6">Testes de Morte</h3>
                                <p className="text-mystic-300 text-lg font-light mb-8 leading-relaxed text-secondary">
                                    Quando seus Pontos de Vida chegam a <strong>0</strong>, você não morre imediatamente. Você cai inconsciente e começa a lutar pela vida.
                                </p>
                                
                                <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 mb-8">
                                    <div className="text-center">
                                        <div className="flex gap-2 justify-center mb-2">
                                            <div className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <div className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <div className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                        </div>
                                        <p className="text-sm font-bold text-green-400 uppercase tracking-widest">3 Sucessos</p>
                                        <p className="text-xs text-mystic-500 mt-1">Você estabiliza (não morre).</p>
                                    </div>
                                    <div className="w-px bg-white/10 hidden md:block"></div>
                                    <div className="text-center">
                                        <div className="flex gap-2 justify-center mb-2">
                                            <div className="w-6 h-6 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] relative flex items-center justify-center"><XMark /></div>
                                            <div className="w-6 h-6 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] relative flex items-center justify-center"><XMark /></div>
                                            <div className="w-6 h-6 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] relative flex items-center justify-center"><XMark /></div>
                                        </div>
                                        <p className="text-sm font-bold text-rose-500 uppercase tracking-widest">3 Falhas</p>
                                        <p className="text-xs text-mystic-500 mt-1">Seu personagem morre.</p>
                                    </div>
                                </div>
                                <p className="text-xs text-mystic-500 italic">
                                    * Role 1d20 no início do turno. 10 ou mais é sucesso. 1 é duas falhas. 20 você acorda com 1 PV.
                                </p>
                            </div>
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
                                        <Sparkles className="text-purple-400" /> Magia & Slots
                                    </h3>
                                    <p className="text-mystic-300 font-light max-w-xl text-secondary">
                                        Magias de Nível 1 ou superior gastam <strong>Espaços de Magia (Slots)</strong>. Pense neles como sua "munição" diária. Truques (Nível 0) são infinitos.
                                    </p>
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
                                        <p className="text-sm text-mystic-400 leading-relaxed font-light text-secondary">{item.desc}</p>
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

// Mini helper for the X mark in Death Saves
const XMark = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white opacity-80">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);