import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, NAMES_FIRST, NAMES_LAST } from "../constants";
import { Attributes, Character, DndClass, DndRace } from "../types";

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

export const generateCharacter = (): Character => {
  const race: DndRace = RACES[Math.floor(Math.random() * RACES.length)];
  const dndClass: DndClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const alignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

  const baseStats: Attributes = {
    Força: rollStat(),
    Destreza: rollStat(),
    Constituição: rollStat(),
    Inteligência: rollStat(),
    Sabedoria: rollStat(),
    Carisma: rollStat(),
  };

  // Apply Race Bonuses
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

  // HP Calculation: Max Hit Die + Con Mod (Level 1)
  const hp = Math.max(1, dndClass.hitDie + modifiers.Constituição);
  
  // Simple AC Calculation
  let ac = 10 + modifiers.Destreza;
  // Adjust for Barbarian/Monk unarmored defense logic simplified
  if (dndClass.name === 'Bárbaro') ac += modifiers.Constituição;
  if (dndClass.name === 'Monge') ac += modifiers.Sabedoria;

  return {
    id: crypto.randomUUID(),
    name: generateRandomName(),
    race: race.name,
    class: dndClass.name,
    background,
    alignment,
    level: 1,
    hp,
    ac,
    attributes: finalStats,
    modifiers,
    equipment: dndClass.proficiencies.slice(0, 3), // Grab a few standard proficiencies as "gear" for simplicity
    createdAt: Date.now(),
  };
};