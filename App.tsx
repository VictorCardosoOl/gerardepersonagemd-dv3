import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier, recalculateCharacterStats } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { InteractiveHero } from './components/InteractiveHero';
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES } from './constants';
import { Save, Copy, Crown, Pencil, Check, User, Skull, Book, Search, MoveRight, Sparkles, Sword, Map, Zap, Upload, Download, Hexagon } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v4';

type ActiveTab = 'grimoire' | 'bestiary' | 'codex' | 'guide';

// --- Skeleton Component ---
const MonsterSkeleton = () => (
    <div className="glass-panel rounded-2xl p-8 max-w-4xl w-full mx-auto mt-4 animate-pulse bg-white/5 border border-white/10">
        <div className="border-b border-white/10 pb-8 mb-8">
            <div className="h-12 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="flex gap-3">
                <div className="h-8 bg-white/5 rounded w-20"></div>
                <div className="h-8 bg-white/5 rounded w-24"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
            <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
            <div className="h-32 bg-white/5 rounded-xl border border-white/5"></div>
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
  
  // File Input Ref for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // --- Export / Import Handlers ---
  const handleExportCharacter = (char: Character) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${char.name.replace(/ /g, '_')}_ficha.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      showNotification("Alma Cristalizada (Download)");
  };

  const triggerImport = () => {
      fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const content = e.target?.result as string;
              const parsedChar = JSON.parse(content) as Character;
              
              // Simple validation
              if (!parsedChar.name || !parsedChar.attributes) {
                  throw new Error("Formato inválido");
              }
              
              // Avoid ID collisions if importing same character
              const newChar = { ...parsedChar, id: crypto.randomUUID() };
              
              setSavedCharacters(prev => [newChar, ...prev]);
              setCurrentCharacter(newChar);
              setActiveTab('grimoire');
              showNotification("Lenda Ressuscitada!");
          } catch (err) {
              console.error(err);
              showNotification("O cristal está corrompido (Erro no JSON).");
          }
      };
      reader.readAsText(file);
      // Reset input
      event.target.value = '';
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
    <div className="min-h-screen font-sans selection:bg-accent-cyan selection:text-void-950 overflow-x-hidden bg-transparent">
      
      {/* Hidden Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json" 
        className="hidden" 
      />

      {/* --- Organic Background Blobs --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-mystic-900 rounded-full blur-[120px] opacity-40 animate-morph mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-900 rounded-full blur-[100px] opacity-30 animate-morph animation-delay-2000 mix-blend-screen"></div>
          <div className="absolute top-[30%] left-[60%] w-[20vw] h-[20vw] bg-accent-cyan/10 rounded-full blur-[80px] animate-float"></div>
      </div>

      {/* --- Top Navigation --- */}
      <nav className="fixed top-0 w-full z-40 h-24 transition-all duration-300 no-print">
         <div className="absolute inset-0 bg-gradient-to-b from-void-950/80 to-transparent backdrop-blur-[2px]"></div>
         <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative z-10">
             
             {/* Brand */}
             <button onClick={handleHome} className="group flex items-center gap-4 focus:outline-none" title="Voltar ao Início">
                 <div className="relative">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md group-hover:bg-white/20 transition-all">
                        <Hexagon size={24} className="text-white" strokeWidth={1.5} />
                    </div>
                 </div>
                 <div className="flex flex-col items-start">
                    <h1 className="text-xl font-display font-bold text-white tracking-wide leading-none group-hover:text-accent-cyan transition-colors drop-shadow-lg">Mestre da Masmorra</h1>
                 </div>
             </button>

             {/* Desktop Navigation */}
             <div className="hidden md:flex items-center bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl">
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
                                ? 'bg-white text-void-950 shadow-neon scale-105' 
                                : 'text-mystic-200 hover:text-white hover:bg-white/10'}
                        `}
                    >
                        <tab.icon size={14} /> 
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
             </div>

             {/* DM Tools Trigger */}
             <button 
                onClick={() => setIsDMPanelOpen(true)}
                className="flex items-center gap-2 text-mystic-200 hover:text-white border border-white/10 hover:border-white/40 transition-all py-2.5 px-6 rounded-full bg-white/5 backdrop-blur-md font-bold uppercase text-xs tracking-widest hover:shadow-glow"
             >
                <Crown size={16} />
                <span className="hidden lg:inline">Mestre</span>
             </button>
         </div>
      </nav>

      {/* --- Mobile Navigation (Bottom) --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-void-950/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 no-print w-auto">
        {[
            { id: 'grimoire', icon: User },
            { id: 'guide', icon: Map },
            { id: 'bestiary', icon: Skull },
            { id: 'codex', icon: Book }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col items-center gap-1 transition-all p-3 rounded-full ${activeTab === tab.id ? 'bg-white text-void-950 shadow-neon scale-110' : 'text-white/50'}`}
            >
                <tab.icon size={20} />
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
        onExport={handleExportCharacter}
        onImport={triggerImport}
      />

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed top-28 right-6 z-50 bg-white/10 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-glass font-bold animate-enter-up no-print flex items-center gap-4 border border-white/20 max-w-sm">
          <div className="bg-accent-cyan rounded-full p-1 text-void-950"><Check size={14} strokeWidth={3} /></div>
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
                            <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 border-white/20 bg-void-950/80 shadow-2xl backdrop-blur-xl">
                                <button onClick={() => setIsEditing(!isEditing)} className={`p-4 rounded-xl transition-all ${isEditing ? 'bg-accent-cyan text-void-950' : 'hover:bg-white/10 text-slate-300'}`} title={isEditing ? 'Salvar Edição' : 'Editar Ficha'}>
                                    <Pencil size={20} />
                                </button>
                                <button onClick={handleSave} className="p-4 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors" title="Salvar no Grimório"><Save size={20} /></button>
                                <button onClick={() => handleExportCharacter(currentCharacter)} className="p-4 hover:bg-white/10 text-accent-gold rounded-xl transition-colors" title="Download do Herói"><Download size={20} /></button>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    /* HERO / EMPTY STATE */
                    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 relative text-center">
                        <div className="max-w-5xl w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            
                            {/* Left Text */}
                            <div className="text-left space-y-8 order-2 md:order-1">
                                <h2 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                                    Forje sua <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-mystic-400">Lenda.</span>
                                </h2>
                                
                                <p className="text-xl text-mystic-200 leading-relaxed font-serif italic max-w-md border-l-2 border-accent-gold/50 pl-6">
                                    "Onde números viram destino e dados contam histórias. Invoque seu herói do vazio."
                                </p>

                                <div className="flex gap-4 pt-4">
                                     <button 
                                        onClick={() => handleGenerate(false)} 
                                        className="px-8 py-4 bg-white text-void-950 rounded-lg font-black uppercase tracking-[0.2em] hover:bg-accent-cyan transition-colors shadow-glow"
                                    >
                                        Gerar Agora
                                    </button>
                                    <button 
                                        onClick={triggerImport}
                                        className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={18} /> Carregar
                                    </button>
                                </div>
                            </div>

                            {/* Right Interactive Artifact */}
                            <div className="order-1 md:order-2 flex justify-center perspective-1000">
                                <InteractiveHero onClick={() => handleGenerate(false)} />
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
                <div className="lg:col-span-4 xl:col-span-3 glass-panel flex flex-col h-full overflow-hidden rounded-[2rem] border-white/10 bg-void-950/40">
                    <div className="p-6 border-b border-white/10 bg-white/5">
                        <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2 font-bold tracking-widest">
                            <Skull size={20} className="text-accent-rose"/> Bestiário
                        </h2>
                        
                        <div className="relative mb-3 group">
                            <input 
                                type="text" 
                                placeholder="Buscar criatura..." 
                                value={monsterSearch}
                                onChange={(e) => { setMonsterSearch(e.target.value); setShowSuggestions(true); }}
                                className="w-full bg-void-900/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-accent-rose/50 focus:ring-1 focus:ring-accent-rose/50 transition-all text-white placeholder-white/30 font-bold shadow-inner"
                            />
                            <Search className="absolute left-4 top-4 text-white/30 group-focus-within:text-accent-rose transition-colors" size={20} />
                        </div>

                        {showSuggestions && monsterSearch && (
                             <div className="absolute z-20 w-[90%] bg-void-900 border border-white/20 rounded-xl shadow-2xl max-h-60 overflow-y-auto mt-2 p-2">
                                {suggestions.map(m => (
                                    <button key={m.index} onClick={() => { setMonsterSearch(m.name); setShowSuggestions(false); handleMonsterSelect(m.index); }} className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg text-sm font-bold text-mystic-200">{m.name}</button>
                                ))}
                             </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className={`w-full text-left px-5 py-4 rounded-xl transition-all flex justify-between items-center group font-bold ${selectedMonster?.index === m.index ? 'bg-mystic-600 text-white shadow-neon' : 'hover:bg-white/5 text-mystic-300 hover:text-white'}`}
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
                        <div className="h-full glass-panel rounded-[2rem] flex flex-col items-center justify-center text-white/30 border-dashed border-2 border-white/10 bg-void-950/20">
                            <div className="p-8 rounded-full bg-white/5 mb-6 animate-float shadow-glass backdrop-blur-sm">
                                <Book size={48} className="opacity-50 text-white" />
                            </div>
                            <p className="font-display text-xl font-bold opacity-50 tracking-widest text-white">Selecione uma criatura</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* === TAB 4: CODEX === */}
        {activeTab === 'codex' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="text-center mb-16 max-w-2xl px-4">
                     <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-lg">Códice</h2>
                     <p className="text-mystic-200 text-xl font-serif italic">
                         Arraste para desvendar as linhagens ancestrais.
                     </p>
                     <div className="flex justify-center mt-6 text-accent-cyan">
                        <MoveRight size={32} className="animate-pulse" />
                     </div>
                </div>

                <DragSlider className="max-w-full md:max-w-[95vw] lg:max-w-[1600px]">
                    {RACES.map(race => (
                        <div 
                            key={race.name} 
                            className="min-w-[400px] max-w-[400px] glass-panel p-10 flex flex-col h-[600px] transform transition-all duration-500 hover:-translate-y-4 rounded-[3rem] border-t border-white/20 relative overflow-hidden group bg-void-900/50 backdrop-blur-md"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mystic-600 to-accent-cyan"></div>
                            
                            <div className="mb-8 relative z-10">
                                <h2 className="text-5xl font-display font-black text-white mb-2">{race.name}</h2>
                                <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                            </div>
                            
                            <div className="flex-grow flex flex-col gap-8 relative z-10">
                                <div className="flex items-center gap-4 text-xs font-mono text-mystic-300 uppercase tracking-widest border-b border-white/10 pb-6">
                                    <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">Desl: {race.speed}m</span>
                                    <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">Médio</span>
                                </div>

                                <p className="text-mystic-100 text-lg leading-relaxed font-serif opacity-90">
                                    "{race.description}"
                                </p>
                                
                                <div className="mt-auto">
                                    <strong className="text-accent-gold block mb-4 text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                                        <Zap size={14}/> Bônus
                                    </strong>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(race.bonuses).map(([k,v]) => (
                                            <span key={k} className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/5">
                                                {k} <span className="text-accent-cyan">+{v}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleGenerate(false, race.name)}
                                className="w-full py-5 mt-8 bg-white text-void-950 rounded-2xl hover:bg-accent-cyan transition-all text-sm font-black tracking-[0.2em] uppercase shadow-lg group-hover:scale-[1.02] relative z-10"
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