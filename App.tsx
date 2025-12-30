import React, { useState, useEffect, useMemo } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES } from './constants';
import { Dice5, Save, Copy, Crown, Pencil, Check, User, Skull, Book, Search, MoveRight, Sparkles, Sword, Map, Zap, Upload, Download } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v4';

type ActiveTab = 'grimoire' | 'bestiary' | 'codex' | 'guide';

// --- Skeleton Component ---
const MonsterSkeleton = () => (
    <div className="glass-panel rounded-2xl p-8 max-w-4xl w-full mx-auto mt-4 animate-pulse bg-white/50 border border-royal-100">
        <div className="border-b border-royal-100 pb-8 mb-8">
            <div className="h-12 bg-royal-100 rounded w-1/3 mb-4"></div>
            <div className="flex gap-3">
                <div className="h-8 bg-royal-50 rounded w-20"></div>
                <div className="h-8 bg-royal-50 rounded w-24"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="h-32 bg-royal-50 rounded-xl border border-royal-100"></div>
            <div className="h-32 bg-royal-50 rounded-xl border border-royal-100"></div>
            <div className="h-32 bg-royal-50 rounded-xl border border-royal-100"></div>
        </div>
    </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('grimoire');
  
  // Grimoire State
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [isDMPanelOpen, setIsDMPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Bestiary State
  const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]);
  const [monsterSearch, setMonsterSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isLoadingMonsters, setIsLoadingMonsters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setSavedCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar do storage", e);
      }
    }
    fetchMonsterList().then(data => setMonsterList(data));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
  }, [savedCharacters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(monsterSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [monsterSearch]);

  // --- Handlers ---
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleHome = () => {
      setActiveTab('grimoire');
      setCurrentCharacter(null);
      setIsDMPanelOpen(false);
  };

  const handleGenerate = (isNPC: boolean = false, raceOverride?: string) => {
    const newChar = generateCharacter(isNPC);
    if (raceOverride) newChar.race = raceOverride;
    
    setCurrentCharacter(newChar);
    setIsEditing(false);
    setActiveTab('grimoire'); 
    showNotification(isNPC ? "NPC Invocado!" : "Novo Herói Gerado!");
    if (window.innerWidth < 768) setIsDMPanelOpen(false); 
  };

  const handleSave = () => {
    if (!currentCharacter) return;
    setIsEditing(false);
    if (savedCharacters.some(c => c.id === currentCharacter.id)) {
      setSavedCharacters(prev => prev.map(c => c.id === currentCharacter.id ? currentCharacter : c));
      showNotification("Grimório Atualizado!");
    } else {
      setSavedCharacters(prev => [currentCharacter, ...prev]);
      showNotification("Salvo no Grimório!");
    }
  };

  const handleCharacterUpdate = (updates: Partial<Character>) => {
    if (!currentCharacter) return;
    let updatedChar = { ...currentCharacter, ...updates };
    if (updates.attributes) {
        const newModifiers: Attributes = {
            Força: getModifier(updatedChar.attributes.Força),
            Destreza: getModifier(updatedChar.attributes.Destreza),
            Constituição: getModifier(updatedChar.attributes.Constituição),
            Inteligência: getModifier(updatedChar.attributes.Inteligência),
            Sabedoria: getModifier(updatedChar.attributes.Sabedoria),
            Carisma: getModifier(updatedChar.attributes.Carisma),
        };
        updatedChar.modifiers = newModifiers;
    }
    setCurrentCharacter(updatedChar);
  };

  const handleCopy = () => {
    if (!currentCharacter) return;
    const text = `${currentCharacter.name} | ${currentCharacter.race} ${currentCharacter.class} | Nv ${currentCharacter.level}\nHP: ${currentCharacter.hp} AC: ${currentCharacter.ac}`;
    navigator.clipboard.writeText(text);
    showNotification("Resumo Copiado.");
  };

  const handleDelete = (id: string) => {
    setSavedCharacters(prev => prev.filter(c => c.id !== id));
  };

  const loadCharacter = (char: Character) => {
    setCurrentCharacter(char);
    setActiveTab('grimoire');
    setIsDMPanelOpen(false);
    setIsEditing(false);
  };

  // --- Bestiary Handlers ---
  const handleMonsterSelect = async (index: string) => {
    setIsLoadingMonsters(true);
    setMonsterSearch(''); 
    setShowSuggestions(false);
    setSelectedMonster(null);
    const details = await fetchMonsterDetails(index);
    setSelectedMonster(details);
    setIsLoadingMonsters(false);
  };

  const filteredMonsters = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    let results = monsterList;
    if (term) {
        results = results.filter(m => m.name.toLowerCase().includes(term));
    }
    return results;
  }, [debouncedSearch, monsterList]);

  const suggestions = filteredMonsters.slice(0, 8);

  return (
    <div className="min-h-screen font-sans selection:bg-royal-200 selection:text-royal-900 overflow-x-hidden bg-canvas-50">
      
      {/* --- Top Navigation --- */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-royal-100 h-20 transition-all duration-300 no-print shadow-sm">
         <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
             
             {/* Brand */}
             <button onClick={handleHome} className="group flex items-center gap-3 focus:outline-none" title="Voltar ao Início">
                 <div className="bg-royal-900 p-2.5 rounded-xl shadow-lg shadow-royal-900/20 group-hover:bg-royal-800 transition-colors">
                     <Dice5 size={24} className="text-white" />
                 </div>
                 <div className="flex flex-col items-start">
                    <h1 className="text-xl font-display font-black text-royal-950 tracking-wide leading-none group-hover:text-royal-700 transition-colors">Mestre da Masmorra</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-royal-400 font-bold mt-1">Grimório Digital</span>
                 </div>
             </button>

             {/* Desktop Navigation (Horizontal Tabs) */}
             <div className="hidden md:flex items-center bg-canvas-100 p-1.5 rounded-full border border-canvas-200 shadow-inner">
                {[
                    { id: 'grimoire', icon: User, label: 'Ficha' },
                    { id: 'guide', icon: Map, label: 'Guia' },
                    { id: 'bestiary', icon: Skull, label: 'Bestiário' },
                    { id: 'codex', icon: Book, label: 'Códice' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`
                            px-6 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all duration-300 uppercase tracking-widest relative overflow-hidden
                            ${activeTab === tab.id 
                                ? 'bg-white text-royal-700 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-400 hover:text-royal-600 hover:bg-white/50'}
                        `}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-royal-600' : 'opacity-50'} /> 
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
             </div>

             {/* DM Tools Trigger */}
             <button 
                onClick={() => setIsDMPanelOpen(true)}
                className="flex items-center gap-2 text-slate-500 hover:text-royal-700 hover:bg-royal-50 border border-canvas-200 hover:border-royal-200 transition-all py-2.5 px-5 rounded-full shadow-sm hover:shadow-md bg-white font-bold uppercase text-xs tracking-widest"
             >
                <Crown size={16} />
                <span className="hidden lg:inline">Mestre</span>
             </button>
         </div>
      </nav>

      {/* --- Mobile Navigation (Bottom) --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xl border border-royal-100 shadow-2xl rounded-3xl px-6 py-4 flex items-center gap-8 no-print w-auto">
        {[
            { id: 'grimoire', icon: User },
            { id: 'guide', icon: Map },
            { id: 'bestiary', icon: Skull },
            { id: 'codex', icon: Book }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-royal-600 scale-110' : 'text-slate-400'}`}
            >
                <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </button>
        ))}
      </div>

      {/* --- DM Side Panel --- */}
      <DMPanel 
        savedCharacters={savedCharacters}
        onSelect={loadCharacter}
        onDelete={handleDelete}
        onGenerate={(npc) => handleGenerate(npc)}
        isOpen={isDMPanelOpen}
        onClose={() => setIsDMPanelOpen(false)}
      />

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-royal-900 text-white px-6 py-4 rounded-xl shadow-glass font-bold animate-enter-up no-print flex items-center gap-4 border border-royal-700 max-w-sm">
          <div className="bg-royal-600 rounded-full p-1"><Check size={16} /></div>
          {notification}
        </div>
      )}

      {/* --- Main Content Area --- */}
      <main className="pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
        
        {/* === TAB 1: GRIMOIRE === */}
        {activeTab === 'grimoire' && (
            <div className="w-full animate-scale-in" key={currentCharacter ? 'char' : 'empty'}>
                {currentCharacter ? (
                     <>
                        {/* Floating Action Toolbar */}
                        <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-30 flex flex-col gap-3 no-print animate-enter-up group">
                            <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 border-royal-100 bg-white/80">
                                <button onClick={() => setIsEditing(!isEditing)} className={`p-4 rounded-xl transition-all ${isEditing ? 'bg-royal-100 text-royal-700' : 'hover:bg-canvas-50 text-slate-400'}`} title={isEditing ? 'Salvar Edição' : 'Editar Ficha'}>
                                    <Pencil size={20} />
                                </button>
                                <button onClick={handleSave} className="p-4 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors" title="Salvar no Grimório"><Save size={20} /></button>
                                <button onClick={handleCopy} className="p-4 hover:bg-canvas-50 text-slate-500 rounded-xl transition-colors" title="Copiar Resumo"><Copy size={20} /></button>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} backstoryLoading={false} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    /* HERO / EMPTY STATE (Royal Blue Theme) */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 relative animate-scale-in text-center">
                        <div className="max-w-4xl w-full relative z-10">
                            
                            <div className="flex justify-center mb-8 animate-float">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-royal-200 blur-[50px] opacity-60 rounded-full"></div>
                                    <div className="relative z-10 bg-white p-6 rounded-3xl shadow-glow border border-white">
                                        <Sword size={48} className="text-royal-600" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-6xl md:text-8xl font-display font-black text-royal-950 mb-6 tracking-tight leading-tight">
                                Crie sua <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-600 to-indigo-600">Própria Lenda</span>
                            </h2>
                            
                            <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-serif italic">
                                "O destino não é encontrado, ele é forjado. Invoque seu herói e comece a aventura."
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                                <button 
                                    onClick={() => handleGenerate(false)} 
                                    className="group relative px-8 py-5 rounded-full bg-royal-900 text-white font-bold text-lg tracking-widest uppercase transition-all hover:bg-royal-800 hover:shadow-lg shadow-royal-900/20"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Sparkles size={20} className="text-royal-200" /> Inovar Herói
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setIsDMPanelOpen(true)}
                                    className="px-8 py-5 rounded-full bg-white border border-royal-100 text-royal-700 font-bold text-lg tracking-widest uppercase hover:bg-royal-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    <Crown size={20} />
                                    Painel do Mestre
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* === TAB 2: GUIDE === */}
        {activeTab === 'guide' && <GuideSection />}

        {/* === TAB 3: BESTIARY === */}
        {activeTab === 'bestiary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] animate-enter-up">
                {/* Sidebar List */}
                <div className="lg:col-span-4 xl:col-span-3 glass-panel flex flex-col h-full overflow-hidden rounded-[2rem] border-white/60 bg-white/60">
                    <div className="p-6 border-b border-royal-100 bg-canvas-50/80">
                        <h2 className="font-display text-xl text-royal-900 mb-4 flex items-center gap-2 font-black tracking-widest">
                            <Skull size={20} className="text-royal-600"/> Bestiário
                        </h2>
                        
                        <div className="relative mb-3 group">
                            <input 
                                type="text" 
                                placeholder="Buscar criatura..." 
                                value={monsterSearch}
                                onChange={(e) => { setMonsterSearch(e.target.value); setShowSuggestions(true); }}
                                className="w-full bg-white border border-royal-100 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-royal-400 focus:ring-1 focus:ring-royal-400 transition-all text-royal-900 placeholder-slate-400 font-bold shadow-sm"
                            />
                            <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-royal-500 transition-colors" size={20} />
                        </div>

                        {showSuggestions && monsterSearch && (
                             <div className="absolute z-20 w-[90%] bg-white border border-royal-100 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-2 p-2">
                                {suggestions.map(m => (
                                    <button key={m.index} onClick={() => { setMonsterSearch(m.name); setShowSuggestions(false); handleMonsterSelect(m.index); }} className="w-full text-left px-4 py-3 hover:bg-royal-50 rounded-lg text-sm font-bold text-slate-600">{m.name}</button>
                                ))}
                             </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className={`w-full text-left px-5 py-4 rounded-xl transition-all flex justify-between items-center group font-bold ${selectedMonster?.index === m.index ? 'bg-royal-600 text-white shadow-lg shadow-royal-500/30' : 'hover:bg-white text-slate-500 hover:text-royal-700 hover:shadow-sm'}`}
                            >
                                <span className="truncate tracking-wide">{m.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main View Area */}
                <div className="lg:col-span-8 xl:col-span-9 h-full relative">
                    {isLoadingMonsters ? (
                        <div className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                            <MonsterSkeleton />
                        </div>
                    ) : selectedMonster ? (
                        <div className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                            <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                        </div>
                    ) : (
                        <div className="h-full glass-panel rounded-[2rem] flex flex-col items-center justify-center text-slate-400 border-dashed border-2 border-royal-100 bg-white/40">
                            <div className="p-8 rounded-full bg-white mb-6 animate-float shadow-sm">
                                <Book size={48} className="opacity-30 text-royal-800" />
                            </div>
                            <p className="font-display text-xl font-bold opacity-50 tracking-widest text-royal-900">Selecione uma criatura</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* === TAB 4: CODEX === */}
        {activeTab === 'codex' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] animate-enter-up">
                <div className="text-center mb-16 max-w-2xl px-4">
                     <h2 className="text-5xl md:text-7xl font-display font-black text-royal-950 mb-6 tracking-tight">Códice</h2>
                     <p className="text-slate-500 text-xl font-serif italic">
                         Arraste para desvendar as linhagens ancestrais.
                     </p>
                     <div className="flex justify-center mt-6 text-royal-400">
                        <MoveRight size={32} className="animate-pulse" />
                     </div>
                </div>

                <DragSlider className="max-w-full md:max-w-[95vw] lg:max-w-[1600px]">
                    {RACES.map(race => (
                        <div 
                            key={race.name} 
                            className="min-w-[400px] max-w-[400px] glass-panel p-10 flex flex-col h-[600px] transform transition-all duration-500 hover:-translate-y-4 hover:shadow-xl rounded-[3rem] border-t border-white relative overflow-hidden group bg-white"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-royal-600 to-indigo-500"></div>
                            
                            <div className="mb-8">
                                <h2 className="text-5xl font-display font-black text-royal-900 mb-2">{race.name}</h2>
                                <div className="w-12 h-1 bg-royal-100 rounded-full"></div>
                            </div>
                            
                            <div className="flex-grow flex flex-col gap-8 relative z-10">
                                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-6">
                                    <span className="bg-canvas-100 px-3 py-1.5 rounded-lg border border-canvas-200 text-slate-600">Desl: {race.speed}m</span>
                                    <span className="bg-canvas-100 px-3 py-1.5 rounded-lg border border-canvas-200 text-slate-600">Médio</span>
                                </div>

                                <p className="text-slate-600 text-lg leading-relaxed font-serif">
                                    "{race.description}"
                                </p>
                                
                                <div className="mt-auto">
                                    <strong className="text-royal-500 block mb-4 text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                                        <Zap size={14}/> Bônus
                                    </strong>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(race.bonuses).map(([k,v]) => (
                                            <span key={k} className="px-4 py-2 bg-royal-50 text-royal-700 rounded-xl text-xs font-bold border border-royal-100">
                                                {k} <span className="text-royal-500">+{v}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleGenerate(false, race.name)}
                                className="w-full py-5 mt-8 bg-royal-900 text-white rounded-2xl hover:bg-royal-800 transition-all text-sm font-black tracking-[0.2em] uppercase shadow-lg group-hover:scale-[1.02]"
                            >
                                Escolher {race.name}
                            </button>
                        </div>
                    ))}
                    <div className="min-w-[50px]"></div>
                </DragSlider>
            </div>
        )}
      </main>
    </div>
  );
}