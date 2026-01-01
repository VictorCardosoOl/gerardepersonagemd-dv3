import { RulesRepository } from "../services/RulesRepository";
import { Attributes, Character, Item } from "../types";
import { getModifier } from "./dice";

// --- AC CALCULATION ---
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

// --- RECALCULATION LOGIC ---
export const recalculateCharacterStats = (char: Character): Character => {
    // 1. Recalculate Modifiers
    const newMods: Attributes = {
        Força: getModifier(char.attributes.Força),
        Destreza: getModifier(char.attributes.Destreza),
        Constituição: getModifier(char.attributes.Constituição),
        Inteligência: getModifier(char.attributes.Inteligência),
        Sabedoria: getModifier(char.attributes.Sabedoria),
        Carisma: getModifier(char.attributes.Carisma),
    };

    // 2. Recalculate Max HP
    const classData = RulesRepository.getClassByName(char.class);
    const hitDie = classData ? classData.hitDie : 8;
    const avgHitDie = (hitDie / 2) + 1;
    const conBonus = newMods.Constituição * char.level;
    const baseHp = char.level === 1 ? hitDie : hitDie + (avgHitDie * (char.level - 1));
    const newMaxHp = Math.max(1, Math.floor(baseHp + conBonus));
    const newHp = Math.min(char.hp, newMaxHp) || newMaxHp;

    // 3. Recalculate Skills
    const newSkills = char.skills.map(s => {
        const mod = newMods[s.attribute];
        return {
            ...s,
            value: mod + (s.proficient ? char.proficiencyBonus : 0)
        };
    });

    // 4. Recalculate Passive Perception
    const percSkill = newSkills.find(s => s.name === 'Percepção');
    const newPassive = 10 + (percSkill ? percSkill.value : newMods.Sabedoria);

    // 5. Recalculate AC
    const newAC = calculateAC(char.class, newMods.Destreza, newMods.Constituição, newMods.Sabedoria, char.equipment);
    
    // 6. Recalculate Initiative
    const newInit = newMods.Destreza;

    // 7. Ensure Wealth object exists
    const newWealth = char.wealth || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

    return {
        ...char,
        hp: newHp > 0 ? newHp : newMaxHp,
        maxHp: newMaxHp,
        ac: newAC,
        initiative: newInit,
        modifiers: newMods,
        skills: newSkills,
        passivePerception: newPassive,
        wealth: newWealth
    };
};