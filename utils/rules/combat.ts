import { Item } from "../../types";

export const calculateAC = (dndClass: string, dexMod: number, conMod: number, wisMod: number, equipment: Item[]): number => {
  const armor = equipment.find(i => i.type === 'armor');
  const shield = equipment.find(i => i.type === 'shield');

  let baseAC = 10 + dexMod;

  if (armor && armor.acBase) {
      // 1. Armored Calculation
      let dexBonus = dexMod;
      if (armor.dexBonusCap !== undefined) {
          dexBonus = Math.min(dexMod, armor.dexBonusCap);
      }
      baseAC = armor.acBase + dexBonus;
  } else {
      // 2. Unarmored Defense Logic
      if (dndClass === 'Bárbaro') {
          // Barbarian: 10 + Dex + Con (Shield is allowed)
          baseAC = 10 + dexMod + conMod;
      } else if (dndClass === 'Monge') {
          // Monk: 10 + Dex + Wis.
          // Rule Requirement: NO Armor AND NO Shield.
          if (!shield) {
            baseAC = 10 + dexMod + wisMod;
          } else {
             // If monk holds shield (and no armor), they lose Wis bonus.
             baseAC = 10 + dexMod;
          }
      }
  }

  // 3. Add Shield Bonus
  if (shield && shield.acBonus) {
      baseAC += shield.acBonus;
  }

  return baseAC;
};