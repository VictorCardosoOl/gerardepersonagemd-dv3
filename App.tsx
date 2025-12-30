import React, { useState, useEffect, useRef } from 'react';
import { Character } from './types';
import { generateCharacter, recalculateCharacterStats } from './utils/logic';
import { Sanctum } from './components/Sanctum';
import { CharacterSheet } from './components/CharacterSheet';
import { BestiarySection } from './components/BestiarySection';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { RACES } from './constants';
import { MoveRight, Zap, Check, Sparkles, Book, Skull, Map, Shield } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v4';
type TabId = 'sanctum' | 'sheet' | 'codex' | 'bestiary' | 'guide';

const TABS = [
  { id: 'sanctum', label: 'Grimório', icon: Shield },
  { id: 'codex', label: 'Códice', icon: Book },
  { id: 'bestiary', label: 'Bestiário', icon: Skull },
  { id: 'guide', label: 'Guia', icon: Map },
];

export default function App() {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState<TabId>('sanctum');
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  
  // --- Tool States ---
  const [notification, setNotification] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // --- Derived State ---
  const activeCharacter = savedCharacters.find(c => c.id === activeCharacterId) || null;

  // --- Lenis Scroll ---
  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
        lenis.destroy();
    };
  }, []);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setSavedCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Storage Error", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
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
    notify("Nova Lenda Forjada");
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const handleSelectCharacter = (char: Character) => {
    setActiveCharacterId(char.id);
    setActiveTab('sheet');
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
    let updatedChar = { ...activeCharacter, ...updates };
    
    if (updates.attributes || updates.level || updates.equipment || updates.class) {
        updatedChar = recalculateCharacterStats(updatedChar);
    }

    setSavedCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
  };

  const handleExport = (char: Character) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char));
      const el = document.createElement('a');
      el.setAttribute("href", dataStr);
      el.setAttribute("download", `${char.name.replace(/ /g, '_')}_ficha.json`);
      document.body.appendChild(el);
      el.click();
      el.remove();
      notify("Arquivo Cristalizado");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
          try {
              const char = JSON.parse(ev.target?.result as string) as Character;
              if (!char.name || !char.attributes) throw new Error("Invalid Format");
              const newChar = { ...char, id: crypto.randomUUID() };
              setSavedCharacters(prev => [newChar, ...prev]);
              notify("Lenda Ressuscitada");
          } catch (err) {
              notify("Cristal Corrompido");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  // Custom Navigation Logic
  const handleTabChange = (id: string) => {
      if (id === 'sanctum') setActiveCharacterId(null);
      setActiveTab(id as TabId);
      lenisRef.current?.scrollTo(0, { immediate: true });
  };

  return (
    <div className="min-h-screen font-body text-mystic-100 selection:bg-cyan-500/30 selection:text-white transition-all bg-void-950">
      
      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      {/* --- Horizontal Navigation --- */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <nav className="glass-panel rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id || (tab.id === 'sanctum' && activeTab === 'sheet');
                const Icon = tab.icon;
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                            relative px-6 py-2.5 rounded-full text-sm font-display font-bold tracking-widest uppercase transition-all duration-300
                            ${isActive ? 'text-void-950' : 'text-mystic-400 hover:text-white'}
                        `}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-white rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                             <Icon size={14} className={isActive ? 'text-cyan-600' : ''} />
                             {tab.label}
                        </span>
                    </button>
                )
            })}
        </nav>
      </header>

      {/* --- Main Content --- */}
      <main className="w-full min-h-screen pt-32 pb-20 relative z-0">
          <AnimatePresence mode="wait">
            
            {/* View: SANCTUM (Grimório) */}
            {activeTab === 'sanctum' && (
                <motion.div 
                    key="sanctum"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <Sanctum 
                        savedCharacters={savedCharacters}
                        onSelect={handleSelectCharacter}
                        onCreate={() => handleCreateNew(false)}
                        onImport={() => fileInputRef.current?.click()}
                        onDelete={handleDelete}
                        onExport={handleExport}
                    />
                </motion.div>
            )}

            {/* View: SHEET */}
            {activeTab === 'sheet' && activeCharacter && (
                <motion.div 
                    key={`sheet-${activeCharacter.id}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <CharacterSheet 
                        character={activeCharacter} 
                        isEditing={isEditing}
                        onUpdate={handleUpdateActive}
                    />
                    
                    {/* Floating Action Button */}
                    <motion.button 
                        layoutId="fab"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-glow-cyan transition-all duration-300 ${isEditing ? 'bg-cyan-500 text-void-950' : 'bg-void-800 border border-white/10 text-cyan-400 hover:bg-void-700'}`}
                    >
                        {isEditing ? <Check size={20} /> : <Zap size={20} />}
                    </motion.button>
                </motion.div>
            )}

            {/* View: CODEX (Raças) */}
            {activeTab === 'codex' && (
                <motion.div 
                    key="codex"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center py-12"
                >
                     <div className="text-center mb-16 px-4">
                        <Sparkles className="mx-auto text-gold-500 mb-4 animate-pulse" size={32} />
                        <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-4 tracking-tight">Códice de Origens</h2>
                        <p className="text-mystic-300 font-body opacity-60 max-w-lg mx-auto leading-relaxed">Arraste os cartões para explorar as linhagens ancestrais e forjar seu novo destino.</p>
                    </div>
                    
                    <DragSlider className="max-w-[95vw]">
                        {RACES.map(race => (
                            <div key={race.name} className="min-w-[360px] glass-panel p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                                onClick={() => handleCreateNew(false, race.name)}
                            >
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h3 className="text-4xl font-display font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors">{race.name}</h3>
                                <p className="text-mystic-300 text-base leading-relaxed mb-8 border-l-2 border-white/10 pl-4">{race.description}</p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Selecionar Linhagem <MoveRight size={14}/>
                                </div>
                            </div>
                        ))}
                    </DragSlider>
                </motion.div>
            )}

             {/* View: BESTIARY */}
             {activeTab === 'bestiary' && (
                <motion.div 
                    key="bestiary"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="max-w-7xl mx-auto px-4"
                >
                    <BestiarySection />
                </motion.div>
            )}

            {/* View: GUIDE */}
            {activeTab === 'guide' && (
                <motion.div 
                    key="guide"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <GuideSection />
                </motion.div>
            )}

          </AnimatePresence>
      </main>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-void-900 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest shadow-glow-gold backdrop-blur-md"
            >
                {notification}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}