import React, { useState, useEffect, useMemo } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier, recalculateCharacterStats } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES } from './constants';
import { Dice5, Save, Copy, Crown, Pencil, Check, User, Skull, Book, Search, MoveRight, Sparkles, Sword, Map, Zap, Upload, Download, Hexagon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v4';

type ActiveTab = 'grimoire' | 'bestiary' | 'codex' | 'guide';

// --- Skeleton Component ---
const MonsterSkeleton = () => (
    <div className="glass-panel rounded-2xl p-8 max-w-4xl w-full mx-auto mt-4 animate-pulse bg-white/50 border border-mystic-100">
        <div className="border-b border-mystic-100 pb-8 mb-8">
            <div className="h-12 bg-mystic-100 rounded w-1/3 mb-4"></div>
            <div className="flex gap-3">
                <div className="h-8 bg-mystic-50 rounded w-20"></div>
                <div className="h-8 bg-mystic-50 rounded w-24"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="h-32 bg-mystic-50 rounded-xl border border-mystic-100"></div>
            <div className="h-32 bg-mystic-50 rounded-xl border border-mystic-100"></div>
            <div className="h-32 bg-mystic-50 rounded-xl border border-mystic-100"></div>
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
    const newChar = generateCharacter(isNPC, raceOverride);
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
    
    // Recalcula stats se houver mudança em atributos, nível, equipamento ou classe
    if (updates.attributes || updates.level || updates.equipment || updates.class) {
        updatedChar = recalculateCharacterStats(updatedChar);
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
    if (activeTab !== 'bestiary') return [];
    const term = debouncedSearch.toLowerCase();
    if (!term) return monsterList.slice(0, 50); 
    return monsterList.filter(m => m.name.toLowerCase().includes(term)).slice(0, 50);
  }, [debouncedSearch, monsterList, activeTab]);

  const suggestions = filteredMonsters.slice(0, 8);

  return (
    <div className="min-h-screen font-sans selection:bg-mystic-200 selection:text-mystic-900 overflow-x-hidden bg-transparent">
      
      {/* --- Top Navigation --- */}
      <nav className="fixed top-0 w-full z-40 h-20 transition-all duration-300 no-print">
         <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-mystic-100/50 shadow-sm"></div>
         <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
             
             {/* Brand */}
             <button onClick={handleHome} className="group flex items-center gap-3 focus:outline-none" title="Voltar ao Início">
                 <div className="relative">
                    <div className="absolute inset-0 bg-mystic-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <div className="bg-void-950 p-2.5 rounded-xl shadow-lg shadow-mystic-900/20 group-hover:scale-105 transition-transform border border-void-800 relative z-10">
                        <Hexagon size={24} className="text-white fill-mystic-900" strokeWidth={1.5} />
                    </div>
                 </div>
                 <div className="flex flex-col items-start">
                    <h1 className="text-lg font-display font-bold text-void-950 tracking-wide leading-none group-hover:text-mystic-700 transition-colors">Mestre da Masmorra</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-mystic-500 font-bold mt-1">Grimório Digital</span>
                 </div>
             </button>

             {/* Desktop Navigation */}
             <div className="hidden md:flex items-center bg-white/50 p-1.5 rounded-full border border-mystic-100 backdrop-blur-sm shadow-sm">
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
                            px-5 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all duration-300 uppercase tracking-widest relative overflow-hidden group
                            ${activeTab === tab.id 
                                ? 'bg-void-950 text-white shadow-lg shadow-mystic-900/10' 
                                : 'text-slate-500 hover:text-void-950 hover:bg-mystic-50'}
                        `}
                    >
                        <tab.icon size={14} className={`transition-transform duration-300 ${activeTab === tab.id ? 'text-mystic-300' : 'group-hover:scale-110 opacity-70'}`} /> 
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
             </div>

             {/* DM Tools Trigger */}
             <button 
                onClick={() => setIsDMPanelOpen(true)}
                className="flex items-center gap-2 text-slate-500 hover:text-mystic-700 hover:bg-mystic-50 border border-transparent hover:border-mystic-200 transition-all py-2 px-4 rounded-full bg-white/50 font-bold uppercase text-xs tracking-widest"
             >
                <Crown size={16} />
                <span className="hidden lg:inline">Mestre</span>
             </button>
         </div>
      </nav>

      {/* --- Mobile Navigation (Bottom) --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-xl border border-mystic-100 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 no-print w-auto ring-1 ring-mystic-900/5">
        {[
            { id: 'grimoire', icon: User },
            { id: 'guide', icon: Map },
            { id: 'bestiary', icon: Skull },
            { id: 'codex', icon: Book }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col items-center gap-1 transition-all p-3 rounded-full ${activeTab === tab.id ? 'bg-void-950 text-white shadow-lg scale-110' : 'text-slate-400'}`}
            >
                <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2 : 2} />
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
        onSaveNew={(npc) => {
            setSavedCharacters(prev => [npc, ...prev]);
            showNotification("NPC Salvo!");
        }}
      />

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-void-950 text-white px-6 py-4 rounded-xl shadow-glass font-bold animate-enter-up no-print flex items-center gap-4 border border-mystic-800 max-w-sm">
          <div className="bg-mystic-600 rounded-full p-1"><Check size={14} /></div>
          {notification}
        </div>
      )}

      {/* --- Main Content Area --- */}
      <main className="pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen relative z-10">
        <div key={activeTab} className="animate-enter-up">
        {/* === TAB 1: GRIMOIRE === */}
        {activeTab === 'grimoire' && (
            <div className="w-full" key={currentCharacter ? 'char' : 'empty'}>
                {currentCharacter ? (
                     <>
                        {/* Floating Action Toolbar */}
                        <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-30 flex flex-col gap-3 no-print animate-enter-up group">
                            <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 border-mystic-100 bg-white/90 shadow-2xl">
                                <button onClick={() => setIsEditing(!isEditing)} className={`p-4 rounded-xl transition-all ${isEditing ? 'bg-mystic-100 text-mystic-700' : 'hover:bg-mystic-50 text-slate-400'}`} title={isEditing ? 'Salvar Edição' : 'Editar Ficha'}>
                                    <Pencil size={20} />
                                </button>
                                <button onClick={handleSave} className="p-4 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors" title="Salvar no Grimório"><Save size={20} /></button>
                                <button onClick={handleCopy} className="p-4 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors" title="Copiar Resumo"><Copy size={20} /></button>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    /* HERO / EMPTY STATE */
                    <div className="flex flex-col items-center justify-center min-h-[65vh] py-12 relative text-center">
                        <div className="absolute inset-0 bg-mystic-gradient pointer-events-none -z-10"></div>
                        <div className="max-w-4xl w-full relative z-10">
                            
                            <div className="flex justify-center mb-10 animate-float">
                                <div className="relative group cursor-pointer" onClick={() => handleGenerate(false)}>
                                    <div className="absolute inset-0 bg-mystic-500 blur-[60px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                                    <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-glass border border-white group-hover:scale-105 transition-transform duration-500">
                                        <Dice5 size={64} className="text-mystic-600" strokeWidth={1} />
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-6xl md:text-8xl font-display font-bold text-void-950 mb-8 tracking-tight leading-tight">
                                Forje sua <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-600 via-indigo-600 to-mystic-600 bg-300% animate-gradient">Lenda Arcana</span>
                            </h2>
                            
                            <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-serif italic antialiased">
                                "O destino não é encontrado, ele é escrito. Invoque seu herói e comece a aventura."
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                                <button 
                                    onClick={() => handleGenerate(false)} 
                                    className="group relative px-10 py-5 rounded-full bg-void-950 text-white font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-void-900 hover:shadow-2xl shadow-mystic-900/20 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Sparkles size={16} className="text-mystic-300" /> Invocar Herói
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                </button>
                                <button 
                                    onClick={() => setIsDMPanelOpen(true)}
                                    className="px-10 py-5 rounded-full bg-white border border-mystic-100 text-void-950 font-bold text-sm tracking-[0.2em] uppercase hover:bg-mystic-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    <Crown size={16} />
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
                {/* Sidebar List */}
                <div className="lg:col-span-4 xl:col-span-3 glass-panel flex flex-col h-full overflow-hidden rounded-[2rem] border-white/60">
                    <div className="p-6 border-b border-mystic-100 bg-white/50">
                        <h2 className="font-display text-xl text-void-950 mb-4 flex items-center gap-2 font-bold tracking-widest">
                            <Skull size={20} className="text-mystic-600"/> Bestiário
                        </h2>
                        
                        <div className="relative mb-3 group">
                            <input 
                                type="text" 
                                placeholder="Buscar criatura..." 
                                value={monsterSearch}
                                onChange={(e) => { setMonsterSearch(e.target.value); setShowSuggestions(true); }}
                                className="w-full bg-white border border-mystic-100 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all text-void-900 placeholder-slate-400 font-bold shadow-sm"
                            />
                            <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-mystic-500 transition-colors" size={20} />
                        </div>

                        {showSuggestions && monsterSearch && (
                             <div className="absolute z-20 w-[90%] bg-white border border-mystic-100 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-2 p-2">
                                {suggestions.map(m => (
                                    <button key={m.index} onClick={() => { setMonsterSearch(m.name); setShowSuggestions(false); handleMonsterSelect(m.index); }} className="w-full text-left px-4 py-3 hover:bg-mystic-50 rounded-lg text-sm font-bold text-slate-600">{m.name}</button>
                                ))}
                             </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className={`w-full text-left px-5 py-4 rounded-xl transition-all flex justify-between items-center group font-bold ${selectedMonster?.index === m.index ? 'bg-mystic-600 text-white shadow-lg shadow-mystic-500/30' : 'hover:bg-white text-slate-500 hover:text-mystic-700 hover:shadow-sm'}`}
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
                        <div className="h-full glass-panel rounded-[2rem] flex flex-col items-center justify-center text-slate-400 border-dashed border-2 border-mystic-100 bg-white/20">
                            <div className="p-8 rounded-full bg-white mb-6 animate-float shadow-sm">
                                <Book size={48} className="opacity-30 text-mystic-800" />
                            </div>
                            <p className="font-display text-xl font-bold opacity-50 tracking-widest text-void-900">Selecione uma criatura</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* === TAB 4: CODEX === */}
        {activeTab === 'codex' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-16 max-w-2xl px-4">
                     <h2 className="text-5xl md:text-7xl font-display font-bold text-void-950 mb-6 tracking-tight">Códice</h2>
                     <p className="text-slate-500 text-xl font-serif italic">
                         Arraste para desvendar as linhagens ancestrais.
                     </p>
                     <div className="flex justify-center mt-6 text-mystic-400">
                        <MoveRight size={32} className="animate-pulse" />
                     </div>
                </div>

                <DragSlider className="max-w-full md:max-w-[95vw] lg:max-w-[1600px]">
                    {RACES.map(race => (
                        <div 
                            key={race.name} 
                            className="min-w-[400px] max-w-[400px] glass-panel p-10 flex flex-col h-[600px] transform transition-all duration-500 hover:-translate-y-4 hover:shadow-xl rounded-[3rem] border-t border-white relative overflow-hidden group bg-white"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mystic-600 to-indigo-500"></div>
                            
                            <div className="mb-8">
                                <h2 className="text-5xl font-display font-black text-void-900 mb-2">{race.name}</h2>
                                <div className="w-12 h-1 bg-mystic-100 rounded-full"></div>
                            </div>
                            
                            <div className="flex-grow flex flex-col gap-8 relative z-10">
                                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-6">
                                    <span className="bg-scroll-100 px-3 py-1.5 rounded-lg border border-scroll-200 text-slate-600">Desl: {race.speed}m</span>
                                    <span className="bg-scroll-100 px-3 py-1.5 rounded-lg border border-scroll-200 text-slate-600">Médio</span>
                                </div>

                                <p className="text-slate-600 text-lg leading-relaxed font-serif">
                                    "{race.description}"
                                </p>
                                
                                <div className="mt-auto">
                                    <strong className="text-mystic-500 block mb-4 text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                                        <Zap size={14}/> Bônus
                                    </strong>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(race.bonuses).map(([k,v]) => (
                                            <span key={k} className="px-4 py-2 bg-mystic-50 text-mystic-700 rounded-xl text-xs font-bold border border-mystic-100">
                                                {k} <span className="text-mystic-500">+{v}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleGenerate(false, race.name)}
                                className="w-full py-5 mt-8 bg-void-950 text-white rounded-2xl hover:bg-void-900 transition-all text-sm font-black tracking-[0.2em] uppercase shadow-lg group-hover:scale-[1.02]"
                            >
                                Escolher {race.name}
                            </button>
                        </div>
                    ))}
                    <div className="min-w-[50px]"></div>
                </DragSlider>
            </div>
        )}
        </div>
      </main>
    </div>
  );
}