import React, { useState, useEffect, useRef } from 'react';
import { Character } from './types';
import { generateCharacter, recalculateCharacterStats } from './utils/logic';
import { Sanctum } from './components/Sanctum';
import { CharacterSheet } from './components/CharacterSheet';
import { BestiaryOverlay } from './components/BestiaryOverlay';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { RACES } from './constants';
import { MoveRight, Zap, Check, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v4';
type ViewState = 'sanctum' | 'sheet' | 'codex' | 'guide';

export default function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<ViewState>('sanctum');
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  
  // --- Tool States ---
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
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
    setCurrentView('sheet');
    notify("Nova Lenda Forjada");
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const handleSelectCharacter = (char: Character) => {
    setActiveCharacterId(char.id);
    setCurrentView('sheet');
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const handleDelete = (id: string) => {
    setSavedCharacters(prev => prev.filter(c => c.id !== id));
    if (activeCharacterId === id) {
        setActiveCharacterId(null);
        setCurrentView('sanctum');
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

  const tabs = [
    { id: 'sanctum', label: 'Grimório' },
    { id: 'sheet', label: activeCharacter ? activeCharacter.name.split(' ')[0] : 'Herói' },
    { id: 'codex', label: 'Códice' },
    { id: 'guide', label: 'Guia' },
  ];

  return (
    <div className="min-h-screen font-body text-mystic-100 selection:bg-cyan-500/30 selection:text-white">
      
      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      {/* --- Horizontal Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 px-4 pointer-events-none">
        <div className="bg-void-950/80 backdrop-blur-xl border border-white/5 rounded-full px-2 py-2 flex gap-1 pointer-events-auto shadow-2xl">
          {tabs.map((tab) => {
            const isActive = currentView === tab.id;
            // Disable 'sheet' tab if no active character
            if (tab.id === 'sheet' && !activeCharacter) return null;

            return (
              <button
                key={tab.id}
                onClick={() => {
                    setCurrentView(tab.id as ViewState);
                    lenisRef.current?.scrollTo(0, { immediate: true });
                }}
                className={`
                  relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300
                  ${isActive ? 'text-void-950' : 'text-mystic-300 hover:text-white hover:bg-white/5'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-mystic-100 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
          
          <div className="w-px h-6 bg-white/10 mx-2 self-center"></div>

          <button
            onClick={() => setIsBestiaryOpen(true)}
             className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-mystic-300 hover:text-white hover:bg-white/5 transition-all"
          >
             Bestiário
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="w-full min-h-screen pt-32 pb-20 relative z-0">
          <AnimatePresence mode="wait">
            
            {/* View: SANCTUM */}
            {currentView === 'sanctum' && (
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
            {currentView === 'sheet' && activeCharacter && (
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

            {/* View: CODEX */}
            {currentView === 'codex' && (
                <motion.div 
                    key="codex"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center py-12"
                >
                     <div className="text-center mb-16">
                        <Sparkles className="mx-auto text-gold-500 mb-4" size={32} />
                        <h2 className="text-5xl font-display font-bold text-white mb-2">Códice de Origens</h2>
                        <p className="text-mystic-300 font-body opacity-60">Arraste para explorar as linhagens.</p>
                    </div>
                    
                    <DragSlider className="max-w-[95vw]">
                        {RACES.map(race => (
                            <div key={race.name} className="min-w-[360px] glass-panel p-8 rounded-2xl hover:border-cyan-500/30 transition-all duration-500 cursor-pointer group"
                                onClick={() => handleCreateNew(false, race.name)}
                            >
                                <h3 className="text-3xl font-display text-white mb-4 group-hover:text-cyan-400 transition-colors">{race.name}</h3>
                                <p className="text-mystic-300 text-sm leading-relaxed mb-8">{race.description}</p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Escolher <MoveRight size={14}/>
                                </div>
                            </div>
                        ))}
                    </DragSlider>
                </motion.div>
            )}

            {/* View: GUIDE */}
            {currentView === 'guide' && (
                <motion.div 
                    key="guide"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <GuideSection />
                </motion.div>
            )}

          </AnimatePresence>
      </main>

      {/* Global Overlays */}
      <BestiaryOverlay isOpen={isBestiaryOpen} onClose={() => setIsBestiaryOpen(false)} />

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