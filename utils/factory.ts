import { NAMES_FIRST, NAMES_LAST, SKILL_LIST, NPC_QUOTES } from "../constants";
import { RulesRepository } from "../services/RulesRepository";
import { Attributes, Character, DndClass, DndRace, Item, Skill, Wealth } from "../types";
import { rollDice, rollStat, getModifier } from "./dice";
import { calculateAC } from "./rules";
import { generateDeepBackstory } from "../features/generator/storyEngine";

export const generateRandomName = (): string => {
  const first = NAMES_FIRST[Math.floor(Math.random() * NAMES_FIRST.length)];
  const last = NAMES_LAST[Math.floor(Math.random() * NAMES_LAST.length)];
  return `${first}${last}`;
};

// --- WEALTH GENERATION ---
export const generateStartingWealth = (className: string): Wealth => {
    let gold = 0;
    
    switch (className) {
        case 'Bárbaro': gold = (rollDice(4) + rollDice(4)) * 10; break;
        case 'Bardo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Clérigo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Druida': gold = (rollDice(4) + rollDice(4)) * 10; break;
        case 'Guerreiro': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Monge': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)); break; 
        case 'Paladino': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Patrulheiro': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Ladino': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Feiticeiro': gold = (rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Bruxo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Mago': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        default: gold = 100;
    }

    return { cp: 0, sp: 0, ep: 0, gp: gold, pp: 0 };
};

// --- ITEM FACTORY HELPERS ---
const createItem = (name: string, type: Item['type'], props: Partial<Item> = {}): Item => ({
    id: crypto.randomUUID(),
    name,
    type,
    quantity: 1,
    ...props
});

// --- STARTING EQUIPMENT KITS ---
const getClassKit = (className: string): Item[] => {
    const pack = createItem('Pacote de Aventureiro', 'gear');
    
    switch (className) {
        case 'Bárbaro': return [
            createItem('Machado Grande', 'weapon', { damage: '1d12 cortante' }),
            createItem('Machadinha', 'weapon', { quantity: 2, damage: '1d6 cortante' }),
            createItem('Azagaia', 'weapon', { quantity: 4, damage: '1d6 perfurante' }),
            pack
        ];
        case 'Bardo': return [
            createItem('Rapieira', 'weapon', { damage: '1d8 perfurante' }),
            createItem('Alaúde', 'instrument'),
            createItem('Armadura de Couro', 'armor', { acBase: 11 }),
            createItem('Adaga', 'weapon', { damage: '1d4 perfurante' }),
            createItem('Kit de Diplomata', 'gear')
        ];
        case 'Clérigo': return [
            createItem('Maça', 'weapon', { damage: '1d6 concussão' }),
            createItem('Cota de Malha', 'armor', { acBase: 16, dexBonusCap: 0, stealthDisadvantage: true }),
            createItem('Escudo', 'shield', { acBonus: 2 }),
            createItem('Símbolo Sagrado', 'gear'),
            createItem('Pacote de Sacerdote', 'gear')
        ];
        case 'Druida': return [
            createItem('Cimitarra', 'weapon', { damage: '1d6 cortante' }),
            createItem('Escudo de Madeira', 'shield', { acBonus: 2 }),
            createItem('Foco Druídico', 'gear'),
            createItem('Armadura de Couro', 'armor', { acBase: 11 }),
            createItem('Pacote de Explorador', 'gear')
        ];
        case 'Guerreiro': return [
            createItem('Cota de Malha', 'armor', { acBase: 16, dexBonusCap: 0, stealthDisadvantage: true }),
            createItem('Espada Longa', 'weapon', { damage: '1d8 cortante' }),
            createItem('Escudo', 'shield', { acBonus: 2 }),
            createItem('Besta Leve', 'weapon', { damage: '1d8 perfurante' }),
            createItem('Virotes', 'gear', { quantity: 20 }),
            pack
        ];
        case 'Monge': return [
            createItem('Espada Curta', 'weapon', { damage: '1d6 perfurante' }),
            createItem('Dardos', 'weapon', { quantity: 10, damage: '1d4 perfurante' }),
            pack
        ];
        case 'Paladino': return [
            createItem('Martelo de Guerra', 'weapon', { damage: '1d8 concussão' }),
            createItem('Escudo', 'shield', { acBonus: 2 }),
            createItem('Cota de Malha', 'armor', { acBase: 16, dexBonusCap: 0, stealthDisadvantage: true }),
            createItem('Símbolo Sagrado', 'gear'),
            pack
        ];
        case 'Patrulheiro': return [
            createItem('Couro Batido', 'armor', { acBase: 12, dexBonusCap: 99 }), 
            createItem('Espada Curta', 'weapon', { quantity: 2, damage: '1d6 perfurante' }),
            createItem('Arco Longo', 'weapon', { damage: '1d8 perfurante' }),
            createItem('Flechas', 'gear', { quantity: 20 }),
            createItem('Pacote de Explorador', 'gear')
        ];
        case 'Ladino': return [
            createItem('Rapieira', 'weapon', { damage: '1d8 perfurante' }),
            createItem('Arco Curto', 'weapon', { damage: '1d6 perfurante' }),
            createItem('Armadura de Couro', 'armor', { acBase: 11 }),
            createItem('Adaga', 'weapon', { quantity: 2, damage: '1d4 perfurante' }),
            createItem('Ferramentas de Ladrão', 'tool'),
            createItem('Pacote de Assaltante', 'gear')
        ];
        case 'Feiticeiro': return [
            createItem('Besta Leve', 'weapon', { damage: '1d8 perfurante' }),
            createItem('Foco Arcano', 'gear'),
            createItem('Adaga', 'weapon', { quantity: 2, damage: '1d4 perfurante' }),
            pack
        ];
        case 'Bruxo': return [
            createItem('Armadura de Couro', 'armor', { acBase: 11 }),
            createItem('Foco Arcano', 'gear'),
            createItem('Adaga', 'weapon', { quantity: 2, damage: '1d4 perfurante' }),
            createItem('Cajado', 'weapon', { damage: '1d6 concussão' }),
            createItem('Pacote de Estudioso', 'gear')
        ];
        case 'Mago': return [
            createItem('Cajado', 'weapon', { damage: '1d6 concussão' }),
            createItem('Foco Arcano', 'gear'),
            createItem('Livro de Magias', 'gear'),
            createItem('Bolsa de Componentes', 'gear'),
            createItem('Pacote de Estudioso', 'gear')
        ];
        default: return [
            createItem('Mochila', 'gear'),
            createItem('Cantil', 'gear'),
            createItem('Rações', 'consumable', { quantity: 5 }),
            createItem('Corda (15m)', 'gear')
        ];
    }
};

export const generateCharacter = (isNPC: boolean = false, raceOverride?: string): Character => {
  const races = RulesRepository.getRaces();
  const classes = RulesRepository.getClasses();
  const backgrounds = RulesRepository.getBackgrounds();
  const alignments = RulesRepository.getAlignments();

  const raceDef: DndRace = raceOverride 
    ? races.find(r => r.name === raceOverride) || races[0]
    : races[Math.floor(Math.random() * races.length)];
    
  const dndClass: DndClass = classes[Math.floor(Math.random() * classes.length)];
  const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const alignment = alignments[Math.floor(Math.random() * alignments.length)];

  // Stats
  let baseStats: Attributes;
  if (isNPC) {
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
  (Object.keys(raceDef.bonuses) as Array<keyof Attributes>).forEach((key) => {
    if (raceDef.bonuses[key]) {
      finalStats[key] += raceDef.bonuses[key]!;
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

  const level = 1;
  const proficiencyBonus = 2;

  // HP
  const maxHp = Math.max(1, dndClass.hitDie + modifiers.Constituição);

  // Skills
  const chosenSkills = new Set<string>();
  const availableSkills = [...dndClass.skillChoices];
  
  while (chosenSkills.size < dndClass.numSkills && availableSkills.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableSkills.length);
    chosenSkills.add(availableSkills[randomIndex]);
    availableSkills.splice(randomIndex, 1);
  }

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

  const perceptionSkill = skills.find(s => s.name === 'Percepção');
  const passivePerception = 10 + (perceptionSkill ? perceptionSkill.value : modifiers.Sabedoria);

  // Equipment
  const equipment = getClassKit(dndClass.name);

  // Wealth
  const wealth = generateStartingWealth(dndClass.name);

  // AC
  const ac = calculateAC(dndClass.name, modifiers.Destreza, modifiers.Constituição, modifiers.Sabedoria, equipment);

  // Story (New Deep Engine)
  const backstory = isNPC 
    ? `"${NPC_QUOTES[Math.floor(Math.random() * NPC_QUOTES.length)]}"`
    : generateDeepBackstory(background, dndClass.name, raceDef.name, finalStats);

  return {
    id: crypto.randomUUID(),
    name: generateRandomName(),
    race: raceDef.name,
    class: dndClass.name,
    background,
    alignment,
    level,
    proficiencyBonus,
    hp: maxHp,
    maxHp: maxHp,
    ac,
    initiative: modifiers.Destreza,
    attributes: finalStats,
    modifiers,
    skills,
    passivePerception,
    equipment,
    wealth,
    languages: raceDef.languages,
    senses: raceDef.senses,
    backstory,
    createdAt: Date.now(),
    isNPC
  };
};