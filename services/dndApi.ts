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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do monstro:", error);
    return null;
  }
};