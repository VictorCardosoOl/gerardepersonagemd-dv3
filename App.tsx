import React, { useState, useEffect, useRef } from 'react';
import { Character, APIMonsterIndex } from './types';
import { Sanctum } from './features/sanctum/Sanctum';
import { CharacterSheet } from './features/character-sheet/CharacterSheet';
import { BestiarySection } from './components/BestiarySection';
import { DragSlider } from './components/DragSlider';
import { GuideSection } from './components/GuideSection';
import { DMPanel } from './components/DMPanel'; 
import { RulesRepository } from './services/RulesRepository'; // Replacing direct constants import
import { MoveRight, Zap, Check, Sparkles, Book, Skull, Map, Shield, Hammer, ExternalLink, Printer } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchMonsterList } from './services/dndApi';
import Lenis from 'lenis';
import { CharacterProvider, useCharacter } from './context/CharacterContext';

const TABS: { id: string; label: string; icon: React.ElementType; hidden?: boolean }[] = [
  { id: 'sanctum', label: 'Grimório', icon: Shield },
  { id: 'sheet', label: 'Ficha', icon: Zap, hidden: true },
  { id: 'codex', label: 'Códice', icon: Book },
  { id: 'bestiary', label: 'Bestiário', icon: Skull },
  { id: 'guide', label: 'Guia', icon: Map },
];

const MainApp: React.FC = () => {
  const { 
    savedCharacters, 
    activeCharacter, 
    activeCharacterId, 
    selectCharacter, 
    createCharacter, 
    deleteCharacter,
    importCharacter,
    isEditing,
    setIsEditing,
    notification
  } = useCharacter();

  const [activeTab, setActiveTab] = useState<string>('sanctum');
  const [isDMPanelOpen, setIsDMPanelOpen] = useState(false); 
  const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]); 
  const lenisRef = useRef<Lenis | null>(null);

  // Load Monsters
  useEffect(() => {
    fetchMonsterList().then(list => {
      if (Array.isArray(list)) setMonsterList(list);
    });
    
    const lenis = new Lenis({ 
      duration: 1.5, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true 
    });
    
    lenisRef.current = lenis;
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handlePrint = () => window.print();

  const handlePrintCharacter = (char: Character) => {
      selectCharacter(char.id);
      setActiveTab('sheet');
      setTimeout(() => window.print(), 500);
  };

  const handleExport = (char: Character) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char));
      const el = document.createElement('a');
      el.setAttribute("href", dataStr);
      el.setAttribute("download", `${char.name}_ficha.json`);
      el.click();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -10, filter: 'blur(4px)' }
  };
  
  const races = RulesRepository.getRaces();

  return (
    <div className="min-h-screen font-body text-mystic-100 bg-void-950 flex flex-col selection:bg-cyan-500/30">
      
      {/* DMPanel still expects props for now, we can refactor it later to use context too */}
      <DMPanel 
        isOpen={isDMPanelOpen} 
        onClose={() => setIsDMPanelOpen(false)}
        savedCharacters={savedCharacters}
        onSelect={(c) => { selectCharacter(c.id); setActiveTab('sheet'); setIsDMPanelOpen(false); }}
        onDelete={deleteCharacter}
        onGenerate={createCharacter}
        onExport={handleExport}
        onImport={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if(file) importCharacter(file);
            }
            input.click();
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-center pt-8 px-4 pointer-events-none no-print">
        <nav className="glass-panel rounded-full p-2 flex items-center gap-2 shadow-2xl pointer-events-auto border-white/10 bg-void-950/80 backdrop-blur-xl">
            {TABS.filter(t => !t.hidden || (t.id === 'sheet' && activeCharacterId && activeTab === 'sheet')).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => { 
                          setActiveTab(tab.id); 
                          if (tab.id === 'sanctum') selectCharacter(''); // Clear selection on sanctum 
                          lenisRef.current?.scrollTo(0, { immediate: true });
                        }}
                        className={`relative px-6 py-2.5 rounded-full text-xs font-display font-bold tracking-[0.15em] uppercase transition-colors duration-500 ${isActive ? 'text-void-950' : 'text-mystic-500 hover:text-white'}`}
                    >
                        {isActive && (
                            <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)]" transition={{ type: "spring", stiffness: 350, damping: 25 }} />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5"><tab.icon size={14} strokeWidth={isActive ? 2.5 : 1.5} /> {tab.label}</span>
                    </button>
                )
            })}
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <button onClick={() => setIsDMPanelOpen(true)} className="p-2.5 rounded-full hover:bg-white/10 text-mystic-500 hover:text-cyan-400 transition-colors duration-300 group" title="Painel do Mestre">
                <Hammer size={16} className="group-hover:rotate-12 transition-transform" />
            </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full flex-grow pt-32 relative print:pt-0 print:bg-white">
          <AnimatePresence mode="wait">
            {activeTab === 'sanctum' && (
                <motion.div key="sanctum" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                    <Sanctum onSelect={(c) => { selectCharacter(c.id); setActiveTab('sheet'); }} onPrint={handlePrintCharacter} onExport={handleExport} />
                </motion.div>
            )}
            {activeTab === 'sheet' && activeCharacter && (
                <motion.div key={`sheet-${activeCharacter.id}`} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                    <CharacterSheet />
                    
                    {/* Floating Actions */}
                    <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-3 no-print">
                        <button onClick={handlePrint} className="w-14 h-14 rounded-full flex items-center justify-center bg-void-800 border border-white/10 text-mystic-300 hover:text-white hover:bg-void-700 hover:border-white/30 transition-all shadow-lg" title="Imprimir">
                            <Printer size={20} />
                        </button>
                        <button onClick={() => setIsEditing(!isEditing)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-glow-cyan transition-all ${isEditing ? 'bg-cyan-500 text-void-950' : 'bg-void-800 border border-white/10 text-cyan-400 hover:bg-void-700'}`} title={isEditing ? "Salvar" : "Editar"}>
                            {isEditing ? <Check size={20} /> : <Zap size={20} />}
                        </button>
                    </div>
                </motion.div>
            )}
            {activeTab === 'bestiary' && (
                <motion.div key="bestiary" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="max-w-7xl mx-auto px-4">
                    <BestiarySection preLoadedList={monsterList} />
                </motion.div>
            )}
            {activeTab === 'codex' && (
                <motion.div key="codex" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                    <div className="text-center mb-16 px-4">
                        <Sparkles className="mx-auto text-gold-500 mb-4 animate-pulse" size={32} />
                        <h2 className="text-5xl font-display font-black text-white mb-4 tracking-tight uppercase drop-shadow-lg">Códice de Origens</h2>
                    </div>
                    <DragSlider className="max-w-[95vw]">
                        {races.map(race => (
                            <div key={race.name} className="min-w-[360px] glass-panel p-10 rounded-[2rem] hover:border-cyan-500/30 transition-all cursor-pointer group relative overflow-hidden bg-void-900/40" onClick={() => createCharacter(false, race.name)}>
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
                <motion.div key="guide" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                    <GuideSection />
                </motion.div>
            )}
          </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center relative z-10 border-t border-white/5 bg-void-950/50 backdrop-blur-sm mt-auto no-print">
          <div className="flex flex-col items-center gap-2">
             <a href="https://seusite.com.br" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-cyan-400 transition-colors">
                <span>MESTRE DA MASMORRA</span>
                <span className="w-1 h-1 rounded-full bg-mystic-500/50 group-hover:bg-cyan-400"></span>
                <span>© 2024</span>
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
             </a>
          </div>
      </footer>

      <AnimatePresence>
        {notification && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-void-900 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest shadow-glow-gold backdrop-blur-md no-print">
                {String(notification)}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
    return (
        <CharacterProvider>
            <MainApp />
        </CharacterProvider>
    );
}