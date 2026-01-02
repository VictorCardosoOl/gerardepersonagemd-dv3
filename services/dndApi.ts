import { APIMonsterIndex, Monster } from "../features/bestiary/types";

// FETCHING FROM STATIC JSON INSTEAD OF BUNDLED TS ARRAY
// This reduces initial bundle size significantly.

export const fetchMonsterList = async (): Promise<APIMonsterIndex[]> => {
  try {
      const response = await fetch('/data/monsters.json');
      if (!response.ok) throw new Error('Failed to fetch monsters');
      
      const monsters: Monster[] = await response.json();
      
      // Map full monster objects to Index for the list view
      return monsters.map(m => ({
          index: m.index,
          name: m.name,
          url: "local"
      })).sort((a, b) => a.name.localeCompare(b.name));
      
  } catch (error) {
      console.error("Error loading monster list:", error);
      return [];
  }
};

export const fetchMonsterDetails = async (index: string): Promise<Monster | null> => {
  try {
      // In a real API we would fetch by ID. 
      // Since we have a single JSON file, we fetch all and find (simulating DB).
      // Browser caching makes this efficient after the first call.
      const response = await fetch('/data/monsters.json');
      if (!response.ok) return null;
      
      const monsters: Monster[] = await response.json();
      const monster = monsters.find(m => m.index === index);
      
      return monster || null;
  } catch (error) {
      console.error("Error loading monster details:", error);
      return null;
  }
};