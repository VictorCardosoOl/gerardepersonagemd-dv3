import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { DragSlider } from './components/DragSlider';
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES, DICTIONARY } from './constants';
import { Dice5, Save, Copy, Crown, Pencil, Check, Download, Upload, User, Skull, Book, Search, Filter, MoveRight, Sparkles, Sword, RotateCcw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v2';

type ActiveTab = 'grimoire' | 'bestiary' | 'codex';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('grimoire');
  
  // Grimoire State
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [isDMPanelOpen, setIsDMPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bestiary State
  const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>([]);
  const [monsterSearch, setMonsterSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [isLoadingMonsters, setIsLoadingMonsters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [crFilter, setCrFilter] = useState(''); 

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

  const handleExportJSON = () => {
    if (!currentCharacter) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCharacter, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentCharacter.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target?.result as string);
            if (json.name && json.attributes) {
                setCurrentCharacter(json);
                showNotification("Ficha Importada.");
            } else {
                showNotification("Arquivo corrompido.");
            }
        } catch (err) {
            console.error(err);
            showNotification("Erro na leitura.");
        }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    const details = await fetchMonsterDetails(index);
    setSelectedMonster(details);
    setIsLoadingMonsters(false);
  };

  const filteredMonsters = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    let results = monsterList;
    if (term) {
        const potentialEnglishTerms = Object.entries(DICTIONARY)
            .filter(([_, pt]) => pt.toLowerCase().includes(term))
            .map(([eng, _]) => eng.toLowerCase());
        results = results.filter(m => {
            const lowerName = m.name.toLowerCase();
            if (lowerName.includes(term)) return true;
            if (potentialEnglishTerms.some(eng => lowerName.includes(eng))) return true;
            return false;
        });
    }
    if (crFilter !== '') {
        // This is a limitation of the shallow API list, filtering by CR works best after detail fetch
        // For this demo we keep name filter main
    }
    return results;
  }, [debouncedSearch, monsterList]);

  const suggestions = filteredMonsters.slice(0, 8);

  return (
    <div className="min-h-screen font-sans text-ink print:bg-white selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      {/* --- Top Navigation --- */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200/60 h-20 transition-all duration-300">
         <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
             
             {/* Brand / Home Reset */}
             <button 
                onClick={handleHome}
                className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
                title="Voltar ao Início / Limpar Mesa"
             >
                 <div className="bg-emerald-700 p-2.5 rounded-xl shadow-lg shadow-emerald-700/20 group-hover:bg-emerald-800 transition-all duration-300 group-hover:scale-105">
                     <Dice5 size={26} className="text-white group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                 </div>
                 <div className="flex flex-col items-start">
                    <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight leading-none group-hover:text-emerald-800 transition-colors">Mestre da Masmorra</h1>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold mt-0.5 group-hover:text-emerald-600/70 transition-colors">Grimório Digital</span>
                 </div>
             </button>

             {/* Desktop Navigation */}
             <div className="hidden md:flex items-center bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200/50">
                {[
                    { id: 'grimoire', icon: User, label: 'Ficha' },
                    { id: 'bestiary', icon: Skull, label: 'Bestiário' },
                    { id: 'codex', icon: Book, label: 'Códice' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`
                            px-5 py-2 rounded-xl flex items-center gap-2.5 text-sm font-semibold transition-all duration-300 relative
                            ${activeTab === tab.id 
                                ? 'bg-white text-emerald-800 shadow-card ring-1 ring-black/5' 
                                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'}
                        `}
                    >
                        <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-600' : 'opacity-70'} /> 
                        <span>{tab.label}</span>
                    </button>
                ))}
             </div>

             {/* DM Tools Trigger */}
             <button 
                onClick={() => setIsDMPanelOpen(true)}
                className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-200 transition-all py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md"
                title="Abrir Ferramentas do Mestre"
             >
                <Crown size={18} />
                <span className="hidden lg:inline text-xs font-bold tracking-widest uppercase">Mestre</span>
             </button>
         </div>
      </nav>

      {/* --- Mobile Navigation (Bottom) --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-8 no-print">
        {[
            { id: 'grimoire', icon: User },
            { id: 'bestiary', icon: Skull },
            { id: 'codex', icon: Book }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-emerald-600 scale-110' : 'text-stone-400'}`}
            >
                <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </button>
        ))}
        <div className="w-px h-6 bg-stone-200"></div>
        <button onClick={() => setIsDMPanelOpen(true)} className="text-amber-600">
            <Crown size={24} />
        </button>
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

      {/* --- Toast Notification --- */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-xl shadow-2xl font-medium animate-fade-in no-print flex items-center gap-3 border border-emerald-700 max-w-sm">
          <div className="bg-emerald-600/20 p-1 rounded-full"><Check size={16} className="text-emerald-400" /></div>
          {notification}
        </div>
      )}

      {/* --- Main Content Area --- */}
      <main className="pt-28 pb-32 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        
        {/* === TAB 1: GRIMOIRE === */}
        {activeTab === 'grimoire' && (
            <div className="w-full animate-fade-in">
                {currentCharacter ? (
                     <>
                        {/* Actions Toolbar */}
                        <div className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-30 flex flex-col gap-3 no-print">
                            <div className="bg-white/95 backdrop-blur p-2 rounded-2xl shadow-float border border-stone-100 flex flex-col gap-2">
                                <button onClick={() => setIsEditing(!isEditing)} className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-stone-100 text-stone-500'}`} title={isEditing ? 'Salvar Edição' : 'Editar Ficha'}>
                                    <Pencil size={20} />
                                </button>
                                <button onClick={handleSave} className="p-3 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors" title="Salvar no Grimório"><Save size={20} /></button>
                                <button onClick={handleCopy} className="p-3 hover:bg-stone-50 text-stone-500 rounded-xl transition-colors" title="Copiar Resumo"><Copy size={20} /></button>
                                <button onClick={handleExportJSON} className="p-3 hover:bg-sky-50 text-sky-600 rounded-xl transition-colors" title="Exportar JSON"><Download size={20} /></button>
                                <div className="relative group">
                                    <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-purple-50 text-purple-600 rounded-xl transition-colors" title="Importar JSON"><Upload size={20} /></button>
                                </div>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} backstoryLoading={false} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    /* HERO / EMPTY STATE */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 relative">
                        <div className="clean-panel max-w-2xl w-full p-10 md:p-16 text-center relative overflow-hidden border-stone-200/60">
                            {/* Decor */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-8 shadow-inner transform rotate-6">
                                    <Sword size={36} className="text-stone-400" />
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 tracking-tight">
                                    A Mesa Está Vazia
                                </h2>
                                <p className="text-lg text-stone-500 mb-10 leading-relaxed max-w-lg mx-auto">
                                    O pergaminho aguarda sua tinta. Invoque um novo herói ou abra as ferramentas do mestre para começar.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                    <button 
                                        onClick={() => handleGenerate(false)} 
                                        className="btn-primary"
                                    >
                                        <Sparkles size={18} />
                                        Gerar Herói Aleatório
                                    </button>
                                    <button 
                                        onClick={() => setIsDMPanelOpen(true)}
                                        className="px-6 py-3 rounded-xl bg-white border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 hover:border-emerald-200 transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Crown size={18} />
                                        Ferramentas do Mestre
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* === TAB 2: BESTIARY === */}
        {activeTab === 'bestiary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-fade-in">
                {/* Sidebar List */}
                <div className="lg:col-span-4 xl:col-span-3 clean-panel flex flex-col h-full bg-white overflow-hidden">
                    <div className="p-5 border-b border-stone-100 bg-stone-50/30">
                        <h2 className="font-serif text-lg text-stone-800 mb-4 flex items-center gap-2 font-bold">
                            <Skull size={20} className="text-emerald-700"/> Catálogo
                        </h2>
                        
                        <div className="relative mb-3">
                            <input 
                                type="text" 
                                placeholder="Buscar (ex: Goblin)..." 
                                value={monsterSearch}
                                onChange={(e) => { setMonsterSearch(e.target.value); setShowSuggestions(true); }}
                                className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                            />
                            <Search className="absolute left-3 top-3 text-stone-400" size={16} />
                        </div>

                        {showSuggestions && monsterSearch && (
                             <div className="absolute z-20 w-[90%] bg-white border border-stone-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                                {suggestions.map(m => (
                                    <button key={m.index} onClick={() => { setMonsterSearch(m.name); setShowSuggestions(false); handleMonsterSelect(m.index); }} className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm border-b border-stone-50 last:border-0">{m.name}</button>
                                ))}
                             </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-stone-400 font-medium uppercase tracking-wider mt-2">
                             <span>Resultados: {filteredMonsters.length}</span>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex justify-between items-center group ${selectedMonster?.index === m.index ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-stone-100 text-stone-600'}`}
                            >
                                <span className="font-medium text-sm truncate">{m.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main View Area */}
                <div className="lg:col-span-8 xl:col-span-9 h-full relative">
                    {isLoadingMonsters && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-xl">
                            <div className="flex flex-col items-center gap-3">
                                <Dice5 className="animate-spin text-emerald-600" size={40} />
                                <span className="text-stone-400 font-serif italic">Invocando criatura...</span>
                            </div>
                        </div>
                    )}
                    
                    {selectedMonster ? (
                        <div className="h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                            <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                        </div>
                    ) : (
                        <div className="h-full clean-panel flex flex-col items-center justify-center text-stone-400 bg-stone-50/50 border-dashed border-2 border-stone-200 shadow-none">
                            <div className="p-6 rounded-full bg-stone-100 mb-4">
                                <Book size={40} className="opacity-30 text-stone-600" />
                            </div>
                            <p className="font-serif text-lg">Selecione uma criatura para estudar seus segredos.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* === TAB 3: CODEX === */}
        {activeTab === 'codex' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
                <div className="text-center mb-12 max-w-2xl px-4">
                     <h2 className="text-5xl font-serif text-stone-900 mb-4 tracking-tight">Códice das Origens</h2>
                     <p className="text-stone-500 font-light text-lg">
                         Conheça as linhagens que moldam este mundo. Arraste as cartas para explorar.
                     </p>
                     <div className="flex justify-center mt-4 text-emerald-600/50">
                        <MoveRight size={24} className="animate-bounce-x" />
                     </div>
                </div>

                <DragSlider className="max-w-full md:max-w-[95vw] lg:max-w-[1200px]">
                    {RACES.map(race => (
                        <div 
                            key={race.name} 
                            className="min-w-[340px] max-w-[340px] clean-panel p-8 flex flex-col h-[500px] transform transition-all duration-300 hover:-translate-y-2 bg-white group border-t-4 border-t-emerald-600"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-4xl font-serif text-stone-800 group-hover:text-emerald-800 transition-colors">{race.name}</h2>
                            </div>
                            
                            <div className="flex-grow flex flex-col gap-6">
                                <div className="flex items-center gap-3 text-xs font-mono text-stone-500 uppercase tracking-widest border-b border-stone-100 pb-4">
                                    <span>Desl: {race.speed}m</span>
                                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                    <span>Médio</span>
                                </div>

                                <p className="text-stone-600 italic text-sm leading-relaxed border-l-2 border-emerald-100 pl-4">
                                    "{race.description}"
                                </p>
                                
                                <div className="space-y-3 mt-auto bg-stone-50 p-4 rounded-xl">
                                    <div>
                                        <strong className="text-emerald-700 block mb-2 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                                            <Sparkles size={10}/> Bônus
                                        </strong>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(race.bonuses).map(([k,v]) => (
                                                <span key={k} className="px-2 py-1 bg-white text-stone-700 rounded border border-stone-200 text-xs font-mono font-bold">
                                                    {k} +{v}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleGenerate(false, race.name)}
                                className="w-full py-4 mt-6 bg-stone-900 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-bold tracking-[0.15em] uppercase shadow-lg group-hover:shadow-emerald-900/20"
                            >
                                Gerar {race.name}
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