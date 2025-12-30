import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Character, Attributes, APIMonsterIndex, Monster } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { MonsterCard } from './components/MonsterCard';
import { DMPanel } from './components/DMPanel';
import { fetchMonsterList, fetchMonsterDetails } from './services/dndApi';
import { RACES, DICTIONARY } from './constants';
import { Dice5, Save, Copy, Crown, Trash2, X, Pencil, Check, Download, Upload, User, Users, Skull, Book, Menu, Settings } from 'lucide-react';

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

  // Debounce for monster search
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
    setActiveTab('grimoire'); // Force view to grimoire
    showNotification(isNPC ? "NPC Invocado!" : "Novo Herói Gerado!");
    if (window.innerWidth < 768) setIsDMPanelOpen(false); // Close mobile menu
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
    const details = await fetchMonsterDetails(index);
    setSelectedMonster(details);
    setIsLoadingMonsters(false);
  };

  const filteredMonsters = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    if (!term) return monsterList;
    const potentialEnglishTerms = Object.entries(DICTIONARY)
        .filter(([_, pt]) => pt.toLowerCase().includes(term))
        .map(([eng, _]) => eng.toLowerCase());

    return monsterList.filter(m => {
        const lowerName = m.name.toLowerCase();
        if (lowerName.includes(term)) return true;
        if (potentialEnglishTerms.some(eng => lowerName.includes(eng))) return true;
        return false;
    }).slice(0, 30);
  }, [debouncedSearch, monsterList]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 print:bg-white">
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-4 md:px-8 no-print">
         <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                 <Dice5 size={24} className="text-white" />
             </div>
             <h1 className="text-xl font-serif font-bold text-white tracking-tight hidden md:block">Mestre da Masmorra</h1>
         </div>

         {/* Center Tabs */}
         <div className="flex items-center bg-slate-900 rounded-full p-1 border border-white/5 shadow-inner">
            {[
                { id: 'grimoire', icon: User, label: 'Grimório' },
                { id: 'bestiary', icon: Skull, label: 'Bestiário' },
                { id: 'codex', icon: Book, label: 'Códice' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
         </div>

         {/* DM Tools Toggle */}
         <button 
            onClick={() => setIsDMPanelOpen(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
         >
            <span className="hidden md:inline text-sm font-bold tracking-wider">DM TOOLS</span>
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
        <div className="fixed top-20 right-8 z-50 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-2xl font-bold animate-fade-in no-print border border-indigo-400/50 flex items-center gap-2">
          <Check size={18} /> {notification}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        
        {/* GRIMOIRE (CHARACTER SHEET) */}
        {activeTab === 'grimoire' && (
            <div className="w-full">
                {currentCharacter ? (
                     <>
                        {/* Floating Action Bar for Current Character */}
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-2 no-print animate-fade-in">
                            <button onClick={() => setIsEditing(!isEditing)} className={`p-3 rounded-full transition-all ${isEditing ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-400'}`} title="Editar"><Pencil size={20} /></button>
                            <div className="w-px h-6 bg-white/10"></div>
                            <button onClick={handleSave} className="p-3 hover:bg-emerald-500/20 text-emerald-400 rounded-full transition-colors" title="Salvar"><Save size={20} /></button>
                            <button onClick={handleCopy} className="p-3 hover:bg-white/10 text-slate-300 rounded-full transition-colors" title="Copiar"><Copy size={20} /></button>
                            <button onClick={handleExportJSON} className="p-3 hover:bg-cyan-500/20 text-cyan-400 rounded-full transition-colors" title="Exportar"><Download size={20} /></button>
                            <div className="relative">
                                <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-purple-500/20 text-purple-400 rounded-full transition-colors" title="Importar"><Upload size={20} /></button>
                            </div>
                        </div>

                        <CharacterSheet character={currentCharacter} backstoryLoading={false} isEditing={isEditing} onUpdate={handleCharacterUpdate} />
                     </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600">
                        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-inner">
                            <Dice5 size={48} className="text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-400 mb-2">A mesa está vazia</h2>
                        <p className="mb-8">Abra o <strong>DM Tools</strong> ou gere um herói para começar.</p>
                        <button onClick={() => handleGenerate(false)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-900/20 font-medium transition-all">
                            Gerar Herói Aleatório
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* BESTIARY */}
        {activeTab === 'bestiary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[80vh]">
                <div className="glass-panel p-4 rounded-xl flex flex-col h-full">
                    <h2 className="font-serif text-xl text-indigo-400 mb-4 flex items-center gap-2"><Skull size={20}/> Catálogo</h2>
                    <input 
                        type="text" 
                        placeholder="Buscar criatura..." 
                        value={monsterSearch}
                        onChange={(e) => setMonsterSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 focus:outline-none focus:border-indigo-500 text-slate-300 placeholder-slate-600"
                    />
                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-1">
                         {filteredMonsters.map((m) => (
                            <button 
                                key={m.index}
                                onClick={() => handleMonsterSelect(m.index)}
                                className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex justify-between items-center group"
                            >
                                <span className="font-medium">{m.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 flex items-center justify-center glass-panel rounded-xl p-8 relative min-h-[400px]">
                    {isLoadingMonsters && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10 rounded-xl"><Dice5 className="animate-spin text-indigo-500" size={48} /></div>}
                    {selectedMonster ? (
                        <MonsterCard monster={selectedMonster} onClose={() => setSelectedMonster(null)} />
                    ) : (
                        <div className="text-center text-slate-600">
                            <Skull size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Selecione uma criatura para analisar seus atributos.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* CODEX */}
        {activeTab === 'codex' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {RACES.map(race => (
                 <div key={race.name} className="glass-panel p-6 rounded-xl hover:border-indigo-500/40 transition-all group">
                     <div className="flex justify-between items-start mb-4">
                         <h2 className="text-2xl font-serif text-white group-hover:text-cyan-400 transition-colors">{race.name}</h2>
                         <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Desl. {race.speed}m</span>
                     </div>
                     <p className="text-slate-400 italic mb-6 text-sm leading-relaxed border-l-2 border-indigo-500/20 pl-4">"{race.description}"</p>
                     
                     <div className="space-y-3 text-sm mb-6 bg-slate-950/30 p-4 rounded-lg">
                         <div>
                             <strong className="text-indigo-400 block mb-1 text-xs uppercase tracking-wider">Bônus de Atributo</strong>
                             <div className="flex flex-wrap gap-2">
                                {Object.entries(race.bonuses).map(([k,v]) => (
                                    <span key={k} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-200 rounded border border-indigo-500/20 text-xs">
                                        {k} +{v}
                                    </span>
                                ))}
                             </div>
                         </div>
                         <div>
                            <strong className="text-indigo-400 block mb-1 text-xs uppercase tracking-wider">Traços Raciais</strong>
                            <p className="text-slate-300">{race.traits?.join(', ')}</p>
                         </div>
                     </div>

                     <button 
                         onClick={() => handleGenerate(false, race.name)}
                         className="w-full py-2.5 border border-slate-700 rounded-lg text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-sm font-medium"
                     >
                         Gerar {race.name}
                     </button>
                 </div>
             ))}
         </div>
        )}
      </main>
    </div>
  );
}