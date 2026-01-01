import React, { createContext, useContext, useEffect, useState } from 'react';
import { Character } from '../types';
import { generateCharacter } from '../utils/factory';
import { recalculateCharacterStats } from '../utils/rules';

const LOCAL_STORAGE_KEY = 'dnd_saved_characters_v5';

interface CharacterContextType {
    savedCharacters: Character[];
    activeCharacterId: string | null;
    activeCharacter: Character | null;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    
    // Actions
    createCharacter: (isNPC?: boolean, raceOverride?: string) => void;
    selectCharacter: (id: string) => void;
    updateCharacter: (updates: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    importCharacter: (file: File) => void;
    
    // Helpers
    notify: (msg: string) => void;
    notification: string | null;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSavedCharacters(parsed);
            } catch (e) { console.error("Error loading characters", e); }
        }
    }, []);

    // Save on Change
    useEffect(() => {
        if (savedCharacters.length >= 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCharacters));
        }
    }, [savedCharacters]);

    const activeCharacter = savedCharacters.find(c => c.id === activeCharacterId) || null;

    const notify = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const createCharacter = (isNPC: boolean = false, raceOverride?: string) => {
        const newChar = generateCharacter(isNPC, raceOverride);
        setSavedCharacters(prev => [newChar, ...prev]);
        setActiveCharacterId(newChar.id);
        notify(isNPC ? "NPC Invocado" : "Nova Lenda Forjada");
    };

    const selectCharacter = (id: string) => {
        setActiveCharacterId(id);
        setIsEditing(false);
    };

    const updateCharacter = (updates: Partial<Character>) => {
        if (!activeCharacter) return;
        const updated = recalculateCharacterStats({ ...activeCharacter, ...updates });
        setSavedCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
    };

    const deleteCharacter = (id: string) => {
        setSavedCharacters(prev => prev.filter(c => c.id !== id));
        if (activeCharacterId === id) setActiveCharacterId(null);
        notify("Lenda esquecida");
    };

    const importCharacter = (file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const char = JSON.parse(ev.target?.result as string);
                if (char && char.id) {
                    // Regenerate ID to avoid collision if importing same char twice
                    char.id = crypto.randomUUID(); 
                    setSavedCharacters(prev => [char, ...prev]);
                    notify("Importado com sucesso");
                }
            } catch (err) { notify("Erro no arquivo"); }
        };
        reader.readAsText(file);
    };

    return (
        <CharacterContext.Provider value={{
            savedCharacters,
            activeCharacterId,
            activeCharacter,
            isEditing,
            setIsEditing,
            createCharacter,
            selectCharacter,
            updateCharacter,
            deleteCharacter,
            importCharacter,
            notify,
            notification
        }}>
            {children}
        </CharacterContext.Provider>
    );
};

export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (!context) throw new Error("useCharacter must be used within a CharacterProvider");
    return context;
};