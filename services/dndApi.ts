import { APIMonsterIndex, Monster } from "../types";

const BASE_URL = "https://www.dnd5eapi.co/api";

export const fetchMonsterList = async (): Promise<APIMonsterIndex[]> => {
  try {
    const response = await fetch(`${BASE_URL}/monsters`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erro ao buscar lista de monstros:", error);
    return [];
  }
};

export const fetchMonsterDetails = async (index: string): Promise<Monster | null> => {
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