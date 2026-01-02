import { Character, Attributes } from "../../types";
import { getModifier } from "../dice";
import { calculateAC } from "./combat";
import { calculateMaxHp } from "./hp";
import { calculateSkills, calculatePassivePerception } from "./skills";

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
    const newMaxHp = calculateMaxHp(char.class, char.level, newMods.Constituição);
    const newHp = Math.min(char.hp, newMaxHp) || newMaxHp; // Heal to full if invalid, otherwise cap at max

    // 3. Recalculate Skills
    const newSkills = calculateSkills(char.skills, newMods, char.proficiencyBonus);

    // 4. Recalculate Passive Perception
    const newPassive = calculatePassivePerception(newSkills, newMods.Sabedoria);

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