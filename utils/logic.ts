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
  if (DICTIONARY[term]) return DICTIONARY[term];
  const lower = term.toLowerCase();
  if (DICTIONARY[lower]) return DICTIONARY[lower];
  const clean = lower.replace(/[,.]/g, '');
  if (DICTIONARY[clean]) return DICTIONARY[clean];
  return term;
};

export const translateText = (text: string): string => {
  if (!text) return "";
  const parts = text.split(', ');
  const translated = parts.map(p => translateTerm(p.trim()));
  return translated.join(', ');
};

// --- STARTING EQUIPMENT KITS ---
// Retorna itens reais em vez de proficiências genéricas para garantir que a ficha seja jogável.
const getClassKit = (className: string): string[] => {
    switch (className) {
        case 'Bárbaro': return ['Machado Grande', 'Machadinha (2)', 'Pacote de Aventureiro', 'Azagaia (4)'];
        case 'Bardo': return ['Rapieira', 'Alaúde', 'Armadura de Couro', 'Adaga', 'Kit de Diplomata'];
        case 'Clérigo': return ['Maça', 'Cota de Malha', 'Escudo', 'Símbolo Sagrado', 'Pacote de Sacerdote'];
        case 'Druida': return ['Cimitarra', 'Escudo de Madeira', 'Foco Druídico', 'Armadura de Couro', 'Pacote de Explorador'];
        case 'Guerreiro': return ['Cota de Malha', 'Espada Longa', 'Escudo', 'Besta Leve', 'Virotes (20)', 'Pacote de Aventureiro'];
        case 'Monge': return ['Espada Curta', 'Dardos (10)', 'Pacote de Aventureiro']; // Monges não usam armadura
        case 'Paladino': return ['Martelo de Guerra', 'Escudo', 'Cota de Malha', 'Símbolo Sagrado', 'Pacote de Aventureiro'];
        case 'Patrulheiro': return ['Armadura de Couro Batido', 'Espada Curta (2)', 'Arco Longo', 'Flechas (20)', 'Pacote de Explorador'];
        case 'Ladino': return ['Rapieira', 'Arco Curto', 'Armadura de Couro', 'Adagas (2)', 'Ferramentas de Ladrão', 'Pacote de Assaltante'];
        case 'Feiticeiro': return ['Besta Leve', 'Foco Arcano', 'Adagas (2)', 'Pacote de Aventureiro'];
        case 'Bruxo': return ['Armadura de Couro', 'Foco Arcano', 'Adagas (2)', 'Cajado', 'Pacote de Estudioso'];
        case 'Mago': return ['Cajado', 'Foco Arcano', 'Livro de Magias', 'Bolsa de Componentes', 'Pacote de Estudioso'];
        default: return ['Mochila', 'Cantil', 'Rações de Viagem (5)', 'Corda (15m)'];
    }
};

const calculateAC = (dndClass: string, dexMod: number, conMod: number, wisMod: number, equipment: string[]): number => {
  // Base AC for no armor
  let ac = 10 + dexMod;

  // Unarmored Defense
  if (dndClass === 'Bárbaro') return 10 + dexMod + conMod;
  if (dndClass === 'Monge') return 10 + dexMod + wisMod;

  // Check Equipment Strings for Armor Logic
  const equipStr = equipment.join(' ').toLowerCase();
  
  // Heavy Armor (No Dex Mod)
  if (equipStr.includes('cota de malha')) ac = 16;
  else if (equipStr.includes('placas')) ac = 18;
  // Medium Armor (Max Dex +2)
  else if (equipStr.includes('brunea') || equipStr.includes('peitoral')) ac = 14 + Math.min(2, dexMod);
  else if (equipStr.includes('camisão de malha')) ac = 13 + Math.min(2, dexMod);
  // Light Armor (Full Dex Mod)
  else if (equipStr.includes('couro batido')) ac = 12 + dexMod;
  else if (equipStr.includes('couro') || equipStr.includes('armadura de couro')) ac = 11 + dexMod;

  // Shields
  if (equipStr.includes('escudo')) ac += 2;

  return ac;
};

// --- RECALCULATION LOGIC ---
// Recalcula todas as estatísticas derivadas com base nos atributos base
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
    const classData = CLASSES.find(c => c.name === char.class);
    const hitDie = classData ? classData.hitDie : 8;
    // HP = Max Hit Die at lvl 1 + (Avg Hit Die * (Lvl - 1)) + (CON Mod * Lvl)
    const avgHitDie = (hitDie / 2) + 1;
    const conBonus = newMods.Constituição * char.level;
    const baseHp = char.level === 1 ? hitDie : hitDie + (avgHitDie * (char.level - 1));
    const newMaxHp = Math.max(1, Math.floor(baseHp + conBonus));
    
    // Adjust current HP if it exceeds new Max (or if it was full)
    // Simple logic: If current HP is suspiciously close to old max or invalid, reset it. 
    // Otherwise clamp it.
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

    // 5. Recalculate AC (Consider Equipment + New Dex/Con/Wis)
    const newAC = calculateAC(char.class, newMods.Destreza, newMods.Constituição, newMods.Sabedoria, char.equipment);
    
    // 6. Recalculate Initiative (Base Dex Mod)
    const newInit = newMods.Destreza;

    return {
        ...char,
        hp: newHp > 0 ? newHp : newMaxHp,
        maxHp: newMaxHp,
        ac: newAC,
        initiative: newInit,
        modifiers: newMods,
        skills: newSkills,
        passivePerception: newPassive
    };
};

export const generateCharacter = (isNPC: boolean = false, raceOverride?: string): Character => {
  const raceDef: DndRace = raceOverride 
    ? RACES.find(r => r.name === raceOverride) || RACES[0]
    : RACES[Math.floor(Math.random() * RACES.length)];
    
  const dndClass: DndClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const alignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

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

  // HP Calculation
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

  // Equipment selection
  const equipment = getClassKit(dndClass.name);

  // AC
  const ac = calculateAC(dndClass.name, modifiers.Destreza, modifiers.Constituição, modifiers.Sabedoria, equipment);

  const backstory = isNPC 
    ? `"${NPC_QUOTES[Math.floor(Math.random() * NPC_QUOTES.length)]}"`
    : `Um(a) ${raceDef.name} ${dndClass.name} com um passado de ${background}.`;

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
    languages: raceDef.languages,
    senses: raceDef.senses,
    backstory,
    createdAt: Date.now(),
    isNPC
  };
};