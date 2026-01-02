
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Character } from './types';
import { APIMonsterIndex } from './features/bestiary/types';
import { DMPanel } from './components/DMPanel'; 
import { Zap, Book, Skull, Map, Shield, Hammer, ExternalLink, Printer, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { fetchMonsterList } from './services/dndApi';
import Lenis from 'lenis';
import { CharacterProvider, useCharacter } from './context/CharacterContext';

const Sanctum = React.lazy(() => import('./features/sanctum/Sanctum').then(module => ({ default: module.Sanctum })));
const CharacterSheet = React.lazy(() => import('./features/character-sheet/CharacterSheet').then(module => ({ default: module.CharacterSheet })));
const BestiarySection = React.lazy(() => import('./features/bestiary/BestiarySection').then(module => ({ default: module.BestiarySection })));
const GuideSection = React.lazy(() => import('./features/guide/GuideSection').then(module => ({ default: module.GuideSection })));
const Codex = React.lazy(() => import('./features/codex/Codex').then(module => ({ default: module.Codex })));

const TABS: { id: string; label: string; icon: React.ElementType; hidden?: boolean }[] = [
  { id: 'sanctum', label: 'Grimório', icon: Shield },
  { id: 'sheet', label: 'Ficha', icon: Zap, hidden: true },
  { id: 'codex', label: 'Códice', icon: Book },
  { id: 'bestiary', label: 'Bestiário', icon: Skull },
  { id: 'guide', label: 'Guia', icon: Map },
];

const LoadingScreen = () => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="w-full h-[60vh] flex flex-col items-center justify-center gap-6"
    >
        <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
            <Loader2 className="animate-spin text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" size={48} />
        </div>
        <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-mystic-400 animate-pulse">
            Carregando Arcanos...
        </span>
    </motion.div>
);

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

  useEffect(() => {
    fetchMonsterList().then(list => {
      if (Array.isArray(list)) setMonsterList(list);
    });
    
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      if (tabId === 'sanctum') selectCharacter(''); 
      lenisRef.current?.scrollTo(0, { immediate: true });
  };

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
    initial: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
    animate: { 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } 
    },
    exit: { 
        opacity: 0, 
        scale: 1.02, 
        filter: 'blur(4px)',
        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } 
    }
  };
  
  return (
    <div className="min-h-screen font-body text-mystic-200 bg-void-950 flex flex-col selection:bg-cyan-500/20 overflow-hidden">
      
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

      <header className="fixed top-6 left-0 right-0 z-40 flex justify-center pointer-events-none no-print px-4">
        <LayoutGroup id="main-nav">
            <nav 
                className="glass-panel p-1.5 rounded-full flex items-center gap-1 bg-void-950/80 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto overflow-x-auto no-scrollbar max-w-full will-change-transform"
                data-lenis-prevent
            >
                {TABS.filter(t => !t.hidden || (t.id === 'sheet' && activeCharacterId && activeTab === 'sheet')).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                relative px-5 py-2.5 rounded-full text-xs font-display font-bold tracking-[0.15em] uppercase transition-all duration-300 outline-none select-none flex items-center gap-2 whitespace-nowrap
                                ${isActive ? 'text-white' : 'text-mystic-500 hover:text-mystic-200 hover:bg-white/5'}
                            `}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon size={14} className={isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} strokeWidth={isActive ? 2 : 1.5} /> 
                            {tab.label}
                        </button>
                    )
                })}

                <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
                
                <button 
                    onClick={() => setIsDMPanelOpen(true)} 
                    className="p-2.5 rounded-full hover:bg-white/10 text-mystic-500 hover:text-gold-400 transition-colors duration-300 group relative" 
                    title="Painel do Mestre"
                >
                    <Hammer size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
            </nav>
        </LayoutGroup>
      </header>

      <main className="w-full flex-grow pt-32 md:pt-40 relative print:pt-0 print:bg-white">
          <Suspense fallback={<LoadingScreen />}>
              <AnimatePresence mode="wait">
                {activeTab === 'sanctum' && (
                    <motion.div key="sanctum" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">
                        <Sanctum onSelect={(c) => { selectCharacter(c.id); setActiveTab('sheet'); }} onPrint={handlePrintCharacter} onExport={handleExport} />
                    </motion.div>
                )}
                {activeTab === 'sheet' && activeCharacter && (
                    <motion.div key={`sheet-${activeCharacter.id}`} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">
                        <CharacterSheet />
                        <div className="fixed bottom-10 right-10 z-40 flex flex-col gap-4 no-print">
                            <button onClick={handlePrint} className="w-14 h-14 rounded-full flex items-center justify-center bg-void-900/80 backdrop-blur-xl border border-white/10 text-mystic-300 hover:text-white hover:border-white/30 transition-all shadow-glass active:scale-95 group" title="Imprimir">
                                <Printer size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button onClick={() => setIsEditing(!isEditing)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 border backdrop-blur-xl ${isEditing ? 'bg-cyan-500 border-cyan-400 text-void-950 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'bg-void-900/80 border-white/10 text-cyan-400 hover:border-cyan-500/50'}`} title={isEditing ? "Salvar" : "Editar"}>
                                {isEditing ? <Check size={20} /> : <Zap size={20} />}
                            </button>
                        </div>
                    </motion.div>
                )}
                {activeTab === 'bestiary' && (
                    <motion.div key="bestiary" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">
                        <BestiarySection preLoadedList={monsterList} />
                    </motion.div>
                )}
                {activeTab === 'codex' && (
                    <motion.div key="codex" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">
                        <Codex />
                    </motion.div>
                )}
                {activeTab === 'guide' && (
                    <motion.div key="guide" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="will-change-transform">
                        <GuideSection />
                    </motion.div>
                )}
              </AnimatePresence>
          </Suspense>
      </main>

      <footer className="w-full py-10 text-center relative z-10 border-t border-white/5 bg-void-950/30 backdrop-blur-sm mt-auto no-print">
          <div className="flex flex-col items-center gap-2">
             <a href="#" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-mystic-500 hover:text-cyan-400 transition-colors">
                <span>MESTRE DA MASMORRA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mystic-500/20 group-hover:bg-cyan-400 transition-colors"></span>
                <span>© 2024</span>
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
             </a>
          </div>
      </footer>

      <AnimatePresence>
        {notification && (
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="fixed bottom-10 left-0 right-0 mx-auto w-fit z-50 px-8 py-3 rounded-full bg-void-900/90 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-[0.15em] shadow-glow-gold backdrop-blur-xl no-print text-center flex items-center gap-3"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></div>
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
