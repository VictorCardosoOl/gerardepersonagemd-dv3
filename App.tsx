import React, { useState, useEffect, useCallback } from 'react';
import { Character, Attributes } from './types';
import { generateCharacter, getModifier } from './utils/logic';
import { CharacterSheet } from './components/CharacterSheet';
import { Dice5, Save, Copy, History, Trash2, X, Pencil, Check } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v1';

export default function App() {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
    const newChar = generateCharacter();
    setCurrentCharacter(newChar);
    setIsEditing(false);
    showNotification("Novo aventureiro criado!");
  };



  const handleSave = () => {
    if (!currentCharacter) return;
    setIsEditing(false);
    if (savedCharacters.some(c => c.id === currentCharacter.id)) {
      // Update existing
      setSavedCharacters(prev => prev.map(c => c.id === currentCharacter.id ? currentCharacter : c));
      showNotification("Personagem atualizado!");
    } else {
      setSavedCharacters(prev => [currentCharacter, ...prev]);
      showNotification("Personagem salvo no grimório!");
    }
  };

  const handleCharacterUpdate = (updates: Partial<Character>) => {
    if (!currentCharacter) return;

    let updatedChar = { ...currentCharacter, ...updates };

    // If attributes changed, recalculate modifiers
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

  const handleCopy = () => {
    if (!currentCharacter) return;
    const text = `
Nome: ${currentCharacter.name}
Raça: ${currentCharacter.race}
Classe: ${currentCharacter.class}
Nível: 1
PV: ${currentCharacter.hp} | CA: ${currentCharacter.ac}
Atributos:
FOR: ${currentCharacter.attributes.Força} (${currentCharacter.modifiers.Força})
DES: ${currentCharacter.attributes.Destreza} (${currentCharacter.modifiers.Destreza})
CON: ${currentCharacter.attributes.Constituição} (${currentCharacter.modifiers.Constituição})
INT: ${currentCharacter.attributes.Inteligência} (${currentCharacter.modifiers.Inteligência})
SAB: ${currentCharacter.attributes.Sabedoria} (${currentCharacter.modifiers.Sabedoria})
CAR: ${currentCharacter.attributes.Carisma} (${currentCharacter.modifiers.Carisma})

Histórico: ${currentCharacter.backstory || 'N/A'}
    `;
    navigator.clipboard.writeText(text);
    showNotification("Ficha copiada para a área de transferência!");
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
    <div className="min-h-screen font-body text-stone-200 p-4 md:p-8 flex flex-col items-center">

      {/* Navbar / Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-wood-800">
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
        <div className="fixed top-4 right-4 z-50 bg-amber-600 text-white px-6 py-3 rounded shadow-lg font-bold animate-bounce">
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex flex-col items-center gap-8">

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center w-full">
          <button
            onClick={handleGenerate}
            className="group relative px-8 py-4 bg-wood-800 hover:bg-wood-900 border-2 border-amber-600 rounded text-amber-100 font-heading text-xl shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)] transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Dice5 className="group-hover:rotate-180 transition-transform duration-500" />
              Gerar Personagem
            </span>
          </button>

          {currentCharacter && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-4 border-2 rounded text-lg font-heading transition-all flex items-center gap-2 ${isEditing
                    ? 'bg-amber-700/80 hover:bg-amber-800 border-amber-500 text-amber-100'
                    : 'bg-stone-800 hover:bg-stone-700 border-stone-500 text-stone-300'
                  }`}
              >
                {isEditing ? <Check size={20} /> : <Pencil size={20} />}
                {isEditing ? 'Concluir Edição' : 'Editar'}
              </button>



              <button
                onClick={handleSave}
                className="px-6 py-4 bg-green-900/50 hover:bg-green-900 border-2 border-green-600 rounded text-green-100 font-heading text-lg transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Salvar
              </button>

              <button
                onClick={handleCopy}
                className="px-6 py-4 bg-stone-800 hover:bg-stone-700 border-2 border-stone-500 rounded text-stone-300 font-heading text-lg transition-all flex items-center gap-2"
              >
                <Copy size={20} />
                Copiar
              </button>
            </>
          )}
        </div>

        {/* Character Display */}
        {currentCharacter ? (
          <div className="animate-[fadeIn_0.5s_ease-out] w-full flex justify-center">
            <CharacterSheet
              character={currentCharacter}
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
          <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 right-0 w-80 h-full bg-wood-900 border-l border-amber-900 z-50 p-6 overflow-y-auto custom-scrollbar shadow-2xl">
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
                        <h3 className="font-bold text-amber-100 group-hover:text-amber-400">{char.name}</h3>
                        <p className="text-xs text-stone-400">{char.race} {char.class}</p>
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
      <footer className="mt-auto pt-12 pb-4 text-center text-stone-600 text-sm">
        <p>© 2024 Mestre da Masmorra. Feito para aventureiros.</p>
        <p className="text-xs mt-1 opacity-50">Dungeons & Dragons é marca registrada da Wizards of the Coast.</p>
      </footer>
    </div>
  );
}