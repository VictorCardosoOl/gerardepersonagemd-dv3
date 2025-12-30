import React, { useState, useEffect, useRef } from 'react';
import { Character, Attributes } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { Dice5, Save, Copy, History, Trash2, X, Pencil, Check, Download, Upload, User, Users } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v2';

export default function App() {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNPCMode, setIsNPCMode] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
  }, [savedCharacters]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerate = () => {
    const newChar = generateCharacter(isNPCMode);
    setCurrentCharacter(newChar);
    setIsEditing(false);
    showNotification(isNPCMode ? "Novo NPC gerado!" : "Novo aventureiro criado!");
  };

  const handleSave = () => {
    if (!currentCharacter) return;
    setIsEditing(false);
    if (savedCharacters.some(c => c.id === currentCharacter.id)) {
      setSavedCharacters(prev => prev.map(c => c.id === currentCharacter.id ? currentCharacter : c));
      showNotification("Personagem atualizado!");
    } else {
      setSavedCharacters(prev => [currentCharacter, ...prev]);
      showNotification("Salvo no grimório!");
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
        // Recalculate derivative stats ideally here (AC, Skills), but for manual edit let user control or implement deep recalc later.
        // For now, let's keep it simple.
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
            // Basic validation
            if (json.name && json.attributes) {
                setCurrentCharacter(json);
                showNotification("Ficha importada com sucesso!");
            } else {
                showNotification("Arquivo inválido.");
            }
        } catch (err) {
            console.error(err);
            showNotification("Erro ao ler arquivo.");
        }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = () => {
    if (!currentCharacter) return;
    const text = `${currentCharacter.name} - ${currentCharacter.race} ${currentCharacter.class} (Nv ${currentCharacter.level})\nHP: ${currentCharacter.hp} | CA: ${currentCharacter.ac} | PP: ${currentCharacter.passivePerception}\nFOR ${currentCharacter.attributes.Força} | DES ${currentCharacter.attributes.Destreza} | CON ${currentCharacter.attributes.Constituição} | INT ${currentCharacter.attributes.Inteligência} | SAB ${currentCharacter.attributes.Sabedoria} | CAR ${currentCharacter.attributes.Carisma}`;
    navigator.clipboard.writeText(text);
    showNotification("Resumo copiado!");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCharacters(prev => prev.filter(c => c.id !== id));
  };

  const loadCharacter = (char: Character) => {
    setCurrentCharacter(char);
    setIsSidebarOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen font-body text-stone-200 p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white">
      
      {/* Navbar / Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-wood-800 no-print">
        <div className="flex items-center gap-3">
          <Dice5 size={32} className="text-amber-500" />
          <h1 className="text-2xl md:text-4xl font-fantasy text-amber-100">Mestre da Masmorra</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors"
        >
          <History size={24} />
          <span className="hidden md:inline font-heading">Grimório ({savedCharacters.length})</span>
        </button>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-amber-600 text-white px-6 py-3 rounded shadow-lg font-bold animate-bounce no-print">
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col items-center gap-8">
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center w-full no-print">
          
          <div className="flex items-center gap-2 bg-wood-900/50 p-1 rounded-lg border border-wood-800">
             <button 
                onClick={() => setIsNPCMode(false)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${!isNPCMode ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
             >
                <User size={18} /> Herói
             </button>
             <button 
                onClick={() => setIsNPCMode(true)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${isNPCMode ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'}`}
             >
                <Users size={18} /> NPC
             </button>
          </div>

          <button 
            onClick={handleGenerate}
            className="group relative px-6 py-3 bg-wood-800 hover:bg-wood-900 border-2 border-amber-600 rounded text-amber-100 font-heading text-xl shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Dice5 className="group-hover:rotate-180 transition-transform duration-500" />
              {isNPCMode ? 'Gerar NPC' : 'Gerar Herói'}
            </span>
          </button>

          {currentCharacter && (
            <>
              <div className="h-12 w-px bg-wood-800 mx-2 hidden md:block"></div>

              <button onClick={() => setIsEditing(!isEditing)} className={`p-3 border-2 rounded transition-all ${isEditing ? 'bg-amber-700 border-amber-500' : 'bg-stone-800 border-stone-500'}`}>
                {isEditing ? <Check size={20} /> : <Pencil size={20} />}
              </button>

              <button onClick={handleSave} className="p-3 bg-green-900/50 hover:bg-green-900 border-2 border-green-600 rounded text-green-100" title="Salvar">
                <Save size={20} />
              </button>
              
              <button onClick={handleCopy} className="p-3 bg-stone-800 hover:bg-stone-700 border-2 border-stone-500 rounded text-stone-300" title="Copiar Texto">
                <Copy size={20} />
              </button>

              <button onClick={handleExportJSON} className="p-3 bg-blue-900/50 hover:bg-blue-900 border-2 border-blue-600 rounded text-blue-100" title="Exportar JSON">
                <Download size={20} />
              </button>
            </>
          )}

          <div className="relative">
             <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
             <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-purple-900/50 hover:bg-purple-900 border-2 border-purple-600 rounded text-purple-100" title="Importar JSON">
                <Upload size={20} />
             </button>
          </div>
        </div>

        {/* Character Display */}
        {currentCharacter ? (
          <div className="animate-[fadeIn_0.5s_ease-out] w-full flex justify-center">
            <CharacterSheet 
                character={currentCharacter} 
                backstoryLoading={false}
                isEditing={isEditing}
                onUpdate={handleCharacterUpdate}
            />
          </div>
        ) : (
          <div className="text-center p-12 border-2 border-dashed border-stone-800 rounded-xl bg-wood-900/30 text-stone-500">
             <Dice5 size={64} className="mx-auto mb-4 opacity-50" />
             <p className="text-xl font-fantasy">A mesa está vazia. Role os dados para começar.</p>
          </div>
        )}
      </main>

      {/* Sidebar (Saved Characters) */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm no-print" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 right-0 w-80 h-full bg-wood-900 border-l border-amber-900 z-50 p-6 overflow-y-auto custom-scrollbar shadow-2xl no-print">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-900/50">
              <h2 className="text-2xl font-fantasy text-amber-500">Grimório</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-stone-500 hover:text-red-400">
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {savedCharacters.length === 0 ? (
                <p className="text-stone-600 italic text-center mt-10">Nenhum herói salvo.</p>
              ) : (
                savedCharacters.map(char => (
                  <div 
                    key={char.id} 
                    onClick={() => loadCharacter(char)}
                    className="p-4 rounded bg-wood-800 border border-wood-800 hover:border-amber-600 cursor-pointer group transition-all relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-amber-100 group-hover:text-amber-400">
                            {char.name} {char.isNPC && <span className="text-xs text-red-400 ml-1">(NPC)</span>}
                        </h3>
                        <p className="text-xs text-stone-400">{char.race} {char.class} - Nv {char.level}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(char.id, e)}
                        className="text-stone-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-4 text-center text-stone-600 text-sm no-print">
        <p>© 2024 Mestre da Masmorra. Feito para aventureiros.</p>
        <p className="text-xs mt-1 opacity-50">Dungeons & Dragons é marca registrada da Wizards of the Coast.</p>
      </footer>
    </div>
  );
}