import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, NAMES_FIRST, NAMES_LAST, SKILL_LIST, NPC_QUOTES, DICTIONARY } from "../constants";
import { Attributes, Character, DndClass, DndRace, Skill } from "../types";

export const rollDice = (sides: number): number => Math.floor(Math.random() * sides) + 1;

export const rollStat = (): number => {
  // 4d6 drop lowest
  const rolls = [rollDice(6), rollDice(6), rollDice(6), rollDice(6)];
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
};

export const getModifier = (score: number): number => Math.floor((score - 10) / 2);

export const generateRandomName = (): string => {
  const first = NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)];
  const last = NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)];
  return `${first}${last}`;
};

// --- TRANSLATION LOGIC ---
export const translateTerm = (term: string): string => {
  if (!term) return "";
  // Direct match
  if (DICTIONARY[term]) return DICTIONARY[term];
  // Case insensitive match
  const lower = term.toLowerCase();
  // Check exact keys in dictionary which might be lower case
  if (DICTIONARY[lower]) return DICTIONARY[lower];
  
  // Clean punctuation for matching (e.g., "blindsight," -> "blindsight")
  const clean = lower.replace(/[,.]/g, '');
  if (DICTIONARY[clean]) return DICTIONARY[clean];

  return term;
};

export const translateText = (text: string): string => {
  if (!text) return "";
  // Split by comma to translate lists (like "Fire, Cold, Lightning")
  const parts = text.split(', ');
  const translated = parts.map(p => translateTerm(p.trim()));
  return translated.join(', ');
};

const calculateAC = (dndClass: string, dexMod: number, conMod: number, wisMod: number, equipment: string[]): number => {
  let baseAC = 10 + dexMod;

  // Unarmored Defense
  if (dndClass === 'Bárbaro') {
    return 10 + dexMod + conMod;
  }
  if (dndClass === 'Monge') {
    return 10 + dexMod + wisMod;
  }

  // Basic Equipment assumption based on class proficiencies for AC
  // This is a simplification for the generator
  const hasHeavy = CLASSES.find(c => c.name === dndClass)?.proficiencies.includes('Todas as Armaduras');
  const hasMedium = CLASSES.find(c => c.name === dndClass)?.proficiencies.includes('Armaduras Médias');
  
  if (hasHeavy) return 16; // Chain mail
  if (hasMedium) return 14 + Math.min(2, dexMod); // Scale mail
  
  // Light armor (Leather) for others
  return 11 + dexMod;
};

export const generateCharacter = (isNPC: boolean = false): Character => {
  const race: DndRace = RACES[Math.floor(Math.random() * RACES.length)];
  const dndClass: DndClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const alignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

  // Stats
  let baseStats: Attributes;
  if (isNPC) {
    // Standard Arrayish for NPCs
    baseStats = {
      Força: 10 + rollDice(4),
      Destreza: 10 + rollDice(4),
      Constituição: 10 + rollDice(4),
      Inteligência: 10 + rollDice(4),
      Sabedoria: 10 + rollDice(4),
      Carisma: 10 + rollDice(4),
    };
  } else {
    baseStats = {
      Força: rollStat(),
      Destreza: rollStat(),
      Constituição: rollStat(),
      Inteligência: rollStat(),
      Sabedoria: rollStat(),
      Carisma: rollStat(),
    };
  }

  // Race Bonuses
  const finalStats: Attributes = { ...baseStats };
  (Object.keys(race.bonuses) as Array<keyof Attributes>).forEach((key) => {
    if (race.bonuses[key]) {
      finalStats[key] += race.bonuses[key]!;
    }
  });

  const modifiers: Attributes = {
    Força: getModifier(finalStats.Força),
    Destreza: getModifier(finalStats.Destreza),
    Constituição: getModifier(finalStats.Constituição),
    Inteligência: getModifier(finalStats.Inteligência),
    Sabedoria: getModifier(finalStats.Sabedoria),
    Carisma: getModifier(finalStats.Carisma),
  };

  // Level & Proficiency
  const level = 1;
  const proficiencyBonus = 2;

  // HP
  const maxHp = Math.max(1, dndClass.hitDie + modifiers.Constituição);

  // Skills
  // 1. Pick random skills from class list
  const chosenSkills = new Set<string>();
  const availableSkills = [...dndClass.skillChoices];
  
  while (chosenSkills.size < dndClass.numSkills && availableSkills.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableSkills.length);
    chosenSkills.add(availableSkills[randomIndex]);
    availableSkills.splice(randomIndex, 1);
  }

  // 2. Build Skill Objects
  const skills: Skill[] = SKILL_LIST.map(skillDef => {
    const isProficient = chosenSkills.has(skillDef.name);
    const mod = modifiers[skillDef.attr];
    const value = mod + (isProficient ? proficiencyBonus : 0);
    return {
      name: skillDef.name,
      attribute: skillDef.attr,
      proficient: isProficient,
      value: value
    };
  });

  // Passive Perception
  const perceptionSkill = skills.find(s => s.name === 'Percepção');
  const passivePerception = 10 + (perceptionSkill ? perceptionSkill.value : modifiers.Sabedoria);

  // Equipment selection (Simplified)
  const equipment = [...dndClass.proficiencies.slice(0, 3)];
  if (dndClass.proficiencies.includes('Escudos')) equipment.push('Escudo (se equipado +2 CA)');

  // AC
  const ac = calculateAC(dndClass.name, modifiers.Destreza, modifiers.Constituição, modifiers.Sabedoria, equipment);

  // Backstory/Quote
  const backstory = isNPC 
    ? `"${NPC_QUOTES[Math.floor(Math.random() * NPC_QUOTES.length)]}"`
    : `Um(a) ${race.name} ${dndClass.name} com um passado de ${background}.`;

  return {
    id: crypto.randomUUID(),
    name: generateRandomName(),
    race: race.name,
    class: dndClass.name,
    background,
    alignment,
    level,
    proficiencyBonus,
    hp: maxHp,
    maxHp: maxHp,
    ac,
    attributes: finalStats,
    modifiers,
    skills,
    passivePerception,
    equipment,
    languages: race.languages,
    senses: race.senses,
    backstory,
    createdAt: Date.now(),
    isNPC
  };
};