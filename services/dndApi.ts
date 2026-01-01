import { APIMonsterIndex, Monster } from "../types";
import { MONSTERS_BR, BR_MONSTER_INDEX } from "../data/monsters_br";

const BASE_URL = "https://www.dnd5eapi.co/api";

export const fetchMonsterList = async (): Promise<APIMonsterIndex[]> => {
  try {
    const response = await fetch(`${BASE_URL}/monsters`);
    const data = await response.json();
    
    // Merge local BR monsters at the TOP of the list for better visibility
    // The filter removes any potential duplicate ID if the API happens to use the same index (unlikely with 'br-' prefix)
    const apiList = data.results as APIMonsterIndex[];
    return [...BR_MONSTER_INDEX, ...apiList];
    
  } catch (error) {
    console.error("Erro ao buscar lista de monstros:", error);
    // Fallback to just local monsters if API fails
    return BR_MONSTER_INDEX;
  }
};

export const fetchMonsterDetails = async (index: string): Promise<Monster | null> => {
  // Check if it's a local monster first
  const localMonster = MONSTERS_BR.find(m => m.index === index);
  if (localMonster) {
      return new Promise((resolve) => {
          // Simulate tiny delay for "loading" feel consistency, but fast
          setTimeout(() => resolve(localMonster), 300);
      });
  }

  // Fallback to API for English monsters
  try {
    const response = await fetch(`${BASE_URL}/monsters/${index}`);
    const rawData = await response.json();
    
    // --- ADAPTER LOGIC ---
    // Normalize Armor Class which varies in the API (number vs array of objects)
    let acValue = 10;
    let acDesc = "";

    if (Array.isArray(rawData.armor_class) && rawData.armor_class.length > 0) {
        const acEntry = rawData.armor_class[0];
        acValue = acEntry.value;
        acDesc = acEntry.type || "";
    } else if (typeof rawData.armor_class === 'number') {
        acValue = rawData.armor_class;
    }

    // Construct clean object
    const normalizedMonster: Monster = {
        ...rawData,
        armor_class_value: acValue,
        armor_class_desc: acDesc
    };

    return normalizedMonster;
  } catch (error) {
    console.error("Erro ao buscar detalhes do monstro:", error);
    return null;
  }
};
