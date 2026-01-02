import { Attributes, Skill } from "../../types";

export const calculateSkills = (skills: Skill[], modifiers: Attributes, proficiencyBonus: number): Skill[] => {
    return skills.map(s => {
        const mod = modifiers[s.attribute];
        return {
            ...s,
            value: mod + (s.proficient ? proficiencyBonus : 0)
        };
    });
};

export const calculatePassivePerception = (skills: Skill[], wisMod: number): number => {
    const percSkill = skills.find(s => s.name === 'Percepção');
    return 10 + (percSkill ? percSkill.value : wisMod);
};