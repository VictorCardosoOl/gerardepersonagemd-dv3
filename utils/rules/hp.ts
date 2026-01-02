import { RulesRepository } from "../../services/RulesRepository";

export const calculateMaxHp = (className: string, level: number, conMod: number): number => {
    const classData = RulesRepository.getClassByName(className);
    const hitDie = classData ? classData.hitDie : 8;
    const avgHitDie = (hitDie / 2) + 1;
    const conBonus = conMod * level;
    
    // Level 1 gets full hit die
    const baseHp = level === 1 ? hitDie : hitDie + (avgHitDie * (level - 1));
    
    // Ensure at least 1 HP
    return Math.max(1, Math.floor(baseHp + conBonus));
};