import { APIMonsterIndex, Monster } from "../types";
import { MONSTERS_BR, BR_MONSTER_INDEX } from "../data/monsters_br";

// REMOVED EXTERNAL API DEPENDENCY TO ENSURE FULL PORTUGUESE CONTENT

export const fetchMonsterList = async (): Promise<APIMonsterIndex[]> => {
  // Simulate async behavior for consistent UI loading states
  return new Promise((resolve) => {
      setTimeout(() => resolve(BR_MONSTER_INDEX), 300);
  });
};

export const fetchMonsterDetails = async (index: string): Promise<Monster | null> => {
  const localMonster = MONSTERS_BR.find(m => m.index === index);
  return new Promise((resolve) => {
      setTimeout(() => resolve(localMonster || null), 200);
  });
};
