import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { DragSlider } from './components/DragSlider'; // Importação do novo componente
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES, DICTIONARY } from './constants';
import { Dice5, Save, Copy, Crown, Trash2, X, Pencil, Check, Download, Upload, User, Users, Skull, Book, Search, Filter, MoveRight } from 'lucide-react';

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

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setSavedCharacters(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar do storage", e);
      }
    }
    // Initial fetch for Bestiary list (lightweight)
    fetchMonsterList().then(data => setMonsterList(data));
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
  }, [savedCharacters]);

  // Debounce for monster search & suggestion logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(monsterSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [monsterSearch]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Logic ---
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

  // --- Bestiary Logic ---
  const handleMonsterSelect = async (index: string) => {
    setIsLoadingMonsters(true);
    setMonsterSearch(''); 
    setShowSuggestions(false);
    const details = await fetchMonsterDetails(index);
    setSelectedMonster(details);
    setIsLoadingMonsters(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMonsterSearch(e.target.value);
      setShowSuggestions(true);
  };

  const handleSuggestionClick = (monster: APIMonsterIndex) => {
      setMonsterSearch(monster.name);
      setShowSuggestions(false);
      handleMonsterSelect(monster.index);
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
    
    return results;
  }, [debouncedSearch, monsterList, crFilter]);

  const suggestions = filteredMonsters.slice(0, 8);

  return (
    <div className="min-h-screen bg-paper font-sans text-stone-800 print:bg-white selection:bg-emerald-200 overflow-x-hidden">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 h-16 flex items-center justify-between px-4 md:px-8 no-print shadow-sm transition-all duration-300">
         <div className="flex items-center gap-3">
             <div className="bg-emerald-800 p-1.5 rounded shadow-lg shadow-emerald-900/10">
                 <Dice5 size={24} className="text-emerald-50" />
             </div>
             <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight hidden md:block">Mestre da Masmorra</h1>
         </div>

         {/* Center Tabs */}
         <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 shadow-inner">
            {[
                { id: 'grimoire', icon: User, label: 'Grimório' },
                { id: 'bestiary', icon: Skull, label: 'Bestiário' },
                { id: 'codex', icon: Book, label: 'Códice' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'}`}
                >
                    <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
         </div>

         {/* DM Tools Toggle */}
         <button 
            onClick={() => setIsDMPanelOpen(true)}
            className="flex items-center gap-2 text-stone-500 hover:text-emerald-800 transition-colors py-2 px-3 rounded-md hover:bg-stone-100"
         >
            <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">Ferramentas</span>
            <Crown size={20} />
         </button>
      </nav>

      {/* DM Side Panel */}
      <DMPanel 
        savedCharacters={savedCharacters}
        onSelect={loadCharacter}
        onDelete={handleDelete}
        onGenerate={(npc) => handleGenerate(npc)}
        isOpen={isDMPanelOpen}
        onClose={() => setIsDMPanelOpen(false)}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-800 text-emerald-50 px-6 py-4 rounded-lg shadow-xl font-bold animate-fade-in no-print flex items-center gap-3 border border-emerald-700">
          <Check size={20} /> {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        
        {/* GRIMOIRE (CHARACTER SHEET) */}
        {activeTab === 'grimoire' && (
            <div className="w-full">
                {currentCharacter ? (
                     <>
                        {/* Floating Action Bar */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md border border-stone-200 px-4 py-2 rounded-full shadow-hover flex items-center gap-4 no-print animate-fade-in text-stone-600">
                            <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-full transition-all ${isEditing ? 'bg-emerald-600 text-white' : 'hover:bg-stone-100 text-stone-600'}`} title="Editar"><Pencil size={20} /></button>
                            <div className="w-px h-6 bg-stone-200"></div>
                            <button onClick={handleSave} className="p-2 hover:bg-emerald-50 text-emerald-700 rounded-full transition-colors" title="Salvar"><Save size={20} /></button>
                            <button onClick={handleCopy} className="p-2 hover:bg-stone-100 text-stone-600 rounded-full transition-colors" title="Copiar"><Copy size={20} /></button>
                            <button onClick={handleExportJSON} className="p-2 hover:bg-sky-50 text-sky-700 rounded-full transition-colors" title="Exportar"><Download size={20} /></button>
                            <div className="relative">
                                <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-purple-50 text-purple-700 rounded-full transition-colors" title="Importar"><Upload size={20} /></button>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} backstoryLoading={false} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-stone-500 animate-fade-in">
                        <div className="w-24 h-24 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mb-6 shadow-soft">
                            <Dice5 size={48} className="text-stone-300" />
                        </div>
                        <h2 className="text-3xl font-serif text-stone-800 mb-3">A mesa está vazia</h2>
                        <p className="mb-8 text-stone-500 max-w-md text-center">Nenhum aventureiro foi convocado ainda. Abra o menu de ferramentas ou use o botão abaixo.</p>
                        <button onClick={() => handleGenerate(false)} className="px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-lg shadow-emerald-900/20 font-medium transition-all tracking-wide">
                            Gerar Herói Aleatório
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* BESTIARY */}
        {activeTab === 'bestiary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] animate-fade-in">
                {/* Sidebar Filter */}
                <div className="clean-panel p-6 flex flex-col h-full bg-white">
                    <h2 className="font-serif text-xl text-stone-800 mb-6 flex items-center gap-2"><Skull size={20} className="text-stone-400"/> Catálogo</h2>
                    
                    {/* Autocomplete Search */}
                    <div className="relative mb-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar criatura..." 
                                value={monsterSearch}
                                onChange={handleSearchChange}
                                onFocus={() => setShowSuggestions(true)}
                                className="w-full bg-stone-50 border-b-2 border-stone-200 rounded-t-lg p-3 pl-10 focus:outline-none focus:border-emerald-600 focus:bg-emerald-50/10 text-stone-800 placeholder-stone-400 transition-colors"
                            />
                            <Search className="absolute left-3 top-3.5 text-stone-400" size={18} />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && monsterSearch && (
                            <div className="absolute top-full left-0 w-full bg-white border border-stone-200 rounded-b-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                {suggestions.length > 0 ? (
                                    suggestions.map(m => (
                                        <button
                                            key={m.index}
                                            onClick={() => handleSuggestionClick(m)}
                                            className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-stone-700 text-sm border-b border-stone-100 last:border-0"
                                        >
                                            {m.name}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-stone-400 text-sm italic">Nenhum resultado.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CR Filter UI */}
                    <div className="flex items-center gap-3 mb-6 bg-stone-50 p-3 rounded border border-stone-100">
                        <Filter size={16} className="text-stone-400" />
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">CR:</span>
                        <select 
                            value={crFilter} 
                            onChange={(e) => setCrFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium text-stone-700 focus:outline-none flex-grow cursor-pointer"
                        >
                            <option value="">Todos</option>
                            <option value="0">0 - 1/8</option>
                            <option value="0.25">1/4</option>
                            <option value="0.5">1/2</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5+</option>
                        </select>
                    </div>

                    {/* List (Filtered) */}
                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1 pr-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className={`w-full text-left px-4 py-3 rounded-md transition-all flex justify-between items-center group ${selectedMonster?.index === m.index ? 'bg-emerald-50 text-emerald-900 font-medium' : 'hover:bg-stone-50 text-stone-600'}`}
                            >
                                <span>{m.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 flex items-start justify-center h-full overflow-hidden">
                    {isLoadingMonsters && <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10"><Dice5 className="animate-spin text-emerald-600" size={48} /></div>}
                    
                    {selectedMonster ? (
                        <div className="w-full h-full overflow-y-auto custom-scrollbar pb-10">
                            <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                        </div>
                    ) : (
                        <div className="h-full w-full clean-panel flex flex-col items-center justify-center text-stone-400 bg-stone-50/30">
                            <div className="p-8 rounded-full bg-stone-100 mb-6">
                                <Skull size={48} className="opacity-20 text-stone-600" />
                            </div>
                            <p className="font-serif text-lg">Selecione uma criatura para estudar.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* CODEX - DRAG SLIDER INTERACTION */}
        {activeTab === 'codex' && (
            <div className="flex flex-col items-center justify-center h-[80vh] animate-fade-in">
                <div className="text-center mb-10">
                     <h2 className="text-4xl font-serif text-stone-900 mb-3">Códice das Origens</h2>
                     <p className="text-stone-500 flex items-center justify-center gap-2 font-light">
                         Arraste para explorar as raças <MoveRight size={16} className="animate-bounce-x text-emerald-600" />
                     </p>
                </div>

                <DragSlider className="max-w-[95vw]">
                    {RACES.map(race => (
                        <div 
                            key={race.name} 
                            className="min-w-[340px] max-w-[340px] clean-panel p-8 flex flex-col h-full transform transition-transform duration-500 hover:-translate-y-2 bg-white"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-3xl font-serif text-stone-800">{race.name}</h2>
                                <span className="text-xs bg-stone-100 px-3 py-1 rounded-full text-stone-500 font-mono">Desl. {race.speed}m</span>
                            </div>
                            
                            <div className="flex-grow">
                                <p className="text-stone-600 italic mb-8 text-sm leading-relaxed border-l-2 border-emerald-200 pl-4">
                                    "{race.description}"
                                </p>
                                
                                <div className="space-y-4 text-sm bg-stone-50 p-5 rounded-lg border border-stone-100">
                                    <div>
                                        <strong className="text-emerald-800 block mb-2 text-xs uppercase tracking-widest font-bold">Bônus Raciais</strong>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(race.bonuses).map(([k,v]) => (
                                                <span key={k} className="px-2 py-1 bg-white text-stone-700 rounded border border-stone-200 text-xs font-mono">
                                                    {k} +{v}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {race.traits && (
                                        <div>
                                            <strong className="text-emerald-800 block mb-2 text-xs uppercase tracking-widest font-bold">Traços</strong>
                                            <p className="text-stone-500 text-xs leading-relaxed">{race.traits.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleGenerate(false, race.name)}
                                className="w-full py-4 mt-8 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors text-sm font-bold tracking-widest uppercase shadow-md hover:shadow-lg"
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