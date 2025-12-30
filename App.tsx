import React, { useState, useEffect, useRef } from 'react';
import { Character } from './types';
import { generateCharacter, recalculateCharacterStats } from './utils/logic';
import { Sanctum } from './components/Sanctum';
import { Sidebar } from './components/Sidebar';
import { CharacterSheet } from './components/CharacterSheet';
import { BestiaryOverlay } from './components/BestiaryOverlay';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { RACES } from './constants';
import { MoveRight, Zap, Check } from 'lucide-react';
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

  // --- Lenis Scroll & Cursor Logic ---
  useEffect(() => {
    // 1. Initialize Lenis (Smooth Inertia Scroll)
    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Magnetic Cursor Logic
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const cursorDot = document.querySelector('.custom-cursor-dot') as HTMLElement;
    
    const moveCursor = (e: MouseEvent) => {
        if(cursor && cursorDot) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        }
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isHoverable = target.matches('button, a, input, select, .cursor-pointer') || 
                            target.closest('button, a, input, select, .cursor-pointer');
        
        if (isHoverable) {
            cursor?.classList.add('hovered');
        } else {
            cursor?.classList.remove('hovered');
        }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
        lenis.destroy();
        window.removeEventListener('mousemove', moveCursor);
        document.removeEventListener('mouseover', handleMouseOver);
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
    // Reset scroll to top
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

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen font-body selection:bg-champagne-500/30 selection:text-white">
      
      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      {/* 1. Minimal Sidebar (Floating Dock) */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
            setCurrentView(view);
            lenisRef.current?.scrollTo(0, { immediate: true });
        }}
        activeCharacterName={activeCharacter?.name}
        isBestiaryOpen={isBestiaryOpen}
        onToggleBestiary={() => setIsBestiaryOpen(!isBestiaryOpen)}
      />

      {/* 2. Main Canvas */}
      <main className="pl-0 md:pl-24 transition-all duration-700 min-h-screen relative pb-32">
          
          <AnimatePresence mode="wait">
            {/* View: SANCTUM */}
            {currentView === 'sanctum' && (
                <motion.div 
                    key="sanctum"
                    initial="initial" animate="animate" exit="exit" variants={pageVariants}
                    className="w-full"
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
                    initial="initial" animate="animate" exit="exit" variants={pageVariants}
                    className="w-full"
                >
                    <CharacterSheet 
                        character={activeCharacter} 
                        isEditing={isEditing}
                        onUpdate={handleUpdateActive}
                    />
                    {/* Floating Edit Fab */}
                    <motion.button 
                        layoutId="edit-fab"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer backdrop-blur-md border border-white/10 ${isEditing ? 'bg-champagne-500 text-obsidian-950' : 'bg-obsidian-900/50 text-champagne-400 hover:bg-obsidian-800'}`}
                    >
                        {isEditing ? <Check size={24} /> : <Zap size={24} />}
                    </motion.button>
                </motion.div>
            )}

            {/* View: CODEX */}
            {currentView === 'codex' && (
                <motion.div 
                    key="codex"
                    initial="initial" animate="animate" exit="exit" variants={pageVariants}
                    className="w-full pt-12 px-4 flex flex-col items-center justify-center min-h-screen"
                >
                     <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display font-black text-white/5 whitespace-nowrap blur-sm select-none">ORIGEM</span>
                    </div>
                    
                    <div className="text-center mb-12 relative z-10">
                        <h2 className="text-6xl font-display font-medium text-white mb-4">Códice</h2>
                        <p className="text-champagne-200/60 font-serif italic text-xl">Linhagens antigas e seus dons.</p>
                    </div>
                    
                    <DragSlider className="max-w-[95vw]">
                        {RACES.map(race => (
                            <div key={race.name} className="min-w-[400px] bg-obsidian-900/40 border-l border-white/10 p-10 hover:bg-white/5 transition-colors duration-500 relative group cursor-pointer"
                                onClick={() => handleCreateNew(false, race.name)}
                            >
                                <h3 className="text-5xl font-display font-medium text-white mb-6 group-hover:text-champagne-400 transition-colors">{race.name}</h3>
                                <p className="text-zinc-400 mb-8 font-serif leading-relaxed text-lg">{race.description}</p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-champagne-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                                    Selecionar <MoveRight size={14}/>
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
                    initial="initial" animate="animate" exit="exit" variants={pageVariants}
                    className="w-full pt-12"
                >
                    <GuideSection />
                </motion.div>
            )}
          </AnimatePresence>
      </main>

      {/* 3. Global Overlays */}
      <BestiaryOverlay isOpen={isBestiaryOpen} onClose={() => setIsBestiaryOpen(false)} />

      {/* 4. Notification Toast */}
      <AnimatePresence>
        {notification && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-obsidian-900 text-champagne-200 px-8 py-4 rounded-full border border-white/10 font-mono text-xs uppercase tracking-widest backdrop-blur-md"
            >
                {notification}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}