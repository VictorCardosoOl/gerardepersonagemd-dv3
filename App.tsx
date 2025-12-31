import React, { useState, useEffect, useRef } from 'react';
import { Character, APIMonsterIndex } from './types';
import { generateCharacter, recalculateCharacterStats } from './utils/logic';
import { Sanctum } from './components/Sanctum';
import { CharacterSheet } from './components/CharacterSheet';
import { BestiarySection } from './components/BestiarySection';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { DMPanel } from './components/DMPanel'; // Added missing import
import { RACES } from './constants';
import { MoveRight, Zap, Check, Sparkles, Book, Skull, Map, Shield, Hammer } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchMonsterList } from './services/dndApi';
import Lenis from 'lenis';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v5';
type TabId = 'sanctum' | 'sheet' | 'codex' | 'bestiary' | 'guide';

const TABS = [
  { id: 'sanctum', label: 'Grimório', icon: Shield },
  { id: 'codex', label: 'Códice', icon: Book },
  { id: 'bestiary', label: 'Bestiário', icon: Skull },
  { id: 'guide', label: 'Guia', icon: Map },
] as const;

export default function App() {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState<TabId>('sanctum');
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  
  // --- Tool States ---
  const [isDMPanelOpen, setIsDMPanelOpen] = useState(false); // Added DMPanel state
  const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]); // Lifted State
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // --- Derived State ---
  const activeCharacter = savedCharacters.find(c => c.id === activeCharacterId) || null;

  // --- Initial Data Loading ---
  useEffect(() => {
    // Fetch Monsters once at app level
    fetchMonsterList().then(list => {
      if (Array.isArray(list)) setMonsterList(list);
    });
    
    // Load LocalStorage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedCharacters(parsed);
      } catch (e) { console.error("Erro ao carregar do LocalStorage:", e); }
    }

    // Lenis Setup
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (savedCharacters.length >= 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
    }
  }, [savedCharacters]);

  // --- Notification System ---
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Actions ---
  const handleCreateNew = (isNPC: boolean = false, raceOverride?: string) => {
    const newChar = generateCharacter(isNPC, raceOverride);
    setSavedCharacters(prev => [newChar, ...prev]);
    setActiveCharacterId(newChar.id);
    setActiveTab('sheet');
    notify(isNPC ? "NPC Invocado" : "Nova Lenda Forjada");
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const handleDelete = (id: string) => {
    setSavedCharacters(prev => prev.filter(c => c.id !== id));
    if (activeCharacterId === id) {
        setActiveCharacterId(null);
        setActiveTab('sanctum');
    }
    notify("Lenda esquecida");
  };

  const handleUpdateActive = (updates: Partial<Character>) => {
    if (!activeCharacter) return;
    const updated = recalculateCharacterStats({ ...activeCharacter, ...updates });
    setSavedCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleExport = (char: Character) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char));
      const el = document.createElement('a');
      el.setAttribute("href", dataStr);
      el.setAttribute("download", `${char.name}_ficha.json`);
      el.click();
      notify("Exportado com sucesso");
  };

  const handleImport = () => fileInputRef.current?.click();

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          try {
              const char = JSON.parse(ev.target?.result as string);
              if (char && char.id) {
                setSavedCharacters(prev => [char, ...prev]);
                notify("Importado com sucesso");
              }
          } catch (err) { notify("Erro no arquivo"); }
      };
      reader.readAsText(file);
      e.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen font-body text-mystic-100 bg-void-950">
      <input type="file" ref={fileInputRef} onChange={onImportFile} className="hidden" accept=".json" />

      {/* --- DMPanel Component (Now Rendered) --- */}
      <DMPanel 
        isOpen={isDMPanelOpen} 
        onClose={() => setIsDMPanelOpen(false)}
        savedCharacters={savedCharacters}
        onSelect={(c) => { setActiveCharacterId(c.id); setActiveTab('sheet'); setIsDMPanelOpen(false); }}
        onDelete={handleDelete}
        onGenerate={handleCreateNew}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* --- Horizontal Navigation --- */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-center pt-6 px-4 pointer-events-none">
        <nav className="glass-panel rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id || (tab.id === 'sanctum' && activeTab === 'sheet' && activeCharacterId);
                return (
                    <button
                        key={tab.id}
                        onClick={() => { 
                          setActiveTab(tab.id as TabId); 
                          if (tab.id === 'sanctum') setActiveCharacterId(null); 
                          lenisRef.current?.scrollTo(0, { immediate: true });
                        }}
                        className={`relative px-6 py-2.5 rounded-full text-[10px] font-display font-bold tracking-widest uppercase transition-all duration-300 ${isActive ? 'text-void-950' : 'text-mystic-400 hover:text-white'}`}
                    >
                        {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white rounded-full" />}
                        <span className="relative z-10 flex items-center gap-2">
                             <tab.icon size={14} /> {tab.label}
                        </span>
                    </button>
                )
            })}
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button 
                onClick={() => setIsDMPanelOpen(true)}
                className="p-2.5 rounded-full bg-void-900 border border-white/10 text-cyan-400 hover:bg-cyan-500 hover:text-void-950 transition-all"
                title="Painel do Mestre"
            >
                <Hammer size={16} />
            </button>
        </nav>
      </header>

      {/* --- Main Content --- */}
      <main className="w-full min-h-screen pt-32 pb-20 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'sanctum' && (
                <motion.div key="sanctum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Sanctum 
                      savedCharacters={savedCharacters} 
                      onSelect={(c) => { setActiveCharacterId(c.id); setActiveTab('sheet'); }} 
                      onCreate={() => handleCreateNew(false)} 
                      onImport={handleImport} 
                      onDelete={handleDelete} 
                      onExport={handleExport} 
                    />
                </motion.div>
            )}
            {activeTab === 'sheet' && activeCharacter && (
                <motion.div key={`sheet-${activeCharacter.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CharacterSheet character={activeCharacter} isEditing={isEditing} onUpdate={handleUpdateActive} />
                    <button onClick={() => setIsEditing(!isEditing)} className={`fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-glow-cyan transition-all ${isEditing ? 'bg-cyan-500 text-void-950' : 'bg-void-800 border border-white/10 text-cyan-400 hover:bg-void-700'}`}>
                        {isEditing ? <Check size={20} /> : <Zap size={20} />}
                    </button>
                </motion.div>
            )}
            {activeTab === 'bestiary' && (
                <motion.div key="bestiary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4">
                    {/* Passing lifted state to Bestiary to avoid double fetch */}
                    <BestiarySection preLoadedList={monsterList} />
                </motion.div>
            )}
            {activeTab === 'codex' && (
                <motion.div key="codex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center mb-16 px-4">
                        <Sparkles className="mx-auto text-gold-500 mb-4 animate-pulse" size={32} />
                        <h2 className="text-5xl font-display font-black text-white mb-4 tracking-tight uppercase">Códice de Origens</h2>
                    </div>
                    <DragSlider className="max-w-[95vw]">
                        {RACES.map(race => (
                            <div key={race.name} className="min-w-[360px] glass-panel p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden" onClick={() => handleCreateNew(false, race.name)}>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h3 className="text-3xl font-display font-bold text-white mb-6 group-hover:text-cyan-400">{race.name}</h3>
                                <p className="text-mystic-400 text-sm leading-relaxed mb-8">{race.description}</p>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gold-500 flex items-center gap-2">Explorar Linhagem <MoveRight size={14}/></div>
                            </div>
                        ))}
                    </DragSlider>
                </motion.div>
            )}
            {activeTab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <GuideSection />
                </motion.div>
            )}
          </AnimatePresence>
      </main>

      <AnimatePresence>
        {notification && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-void-900 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest shadow-glow-gold backdrop-blur-md">
                {String(notification)}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}