
import { CLASSES, RACES, BACKGROUNDS, ALIGNMENTS, NAMES_FIRST, NAMES_LAST, SKILL_LIST, NPC_QUOTES, DICTIONARY } from "../constants";
import { Attributes, Character, DndClass, DndRace, Item, Skill, Wealth } from "../types";

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

// --- STORY ENGINE ---
interface StoryTemplateStructure {
    origins: string[];
    incidents: Record<string, string>;
    motivations: string[];
}

const STORY_TEMPLATES: StoryTemplateStructure = {
    origins: [
        "Nascido sob uma lua de sangue,",
        "Criado nas ruas labirínticas da capital,",
        "Único sobrevivente de um vilarejo esquecido,",
        "Treinado desde a infância em um monastério isolado,",
        "Filho bastardo de um nobre decadente,",
        "Encontrado ainda bebê flutuando em uma cesta no rio,",
        "Forjado nas chamas de uma guerra antiga,",
        "Amaldiçoado por uma bruxa vingativa ao nascer,",
        "Exilado de seu clã por um crime que não cometeu,",
        "Perdido em uma floresta feérica por uma década,"
    ],
    incidents: {
        'Acólito': "encontrou textos proibidos que revelavam uma verdade terrível sobre sua ordem.",
        'Charlatão': "aplicou o golpe errado na pessoa errada e agora foge de uma guilda de assassinos.",
        'Criminoso': "foi traído por seu parceiro durante o maior roubo de sua vida.",
        'Soldado': "viu seu batalhão ser dizimado por uma magia que não deveria existir.",
        'Sábio': "descobriu um mapa estelar que aponta para o fim dos tempos.",
        'Nobre': "foi deserdado após recusar um casamento arranjado com uma entidade sombria.",
        'Herói do Povo': "liderou uma revolta contra um tirano local usando apenas ferramentas agrícolas.",
        'Gladiador': "ganhou sua liberdade na arena, mas perdeu sua humanidade.",
        'Cavaleiro': "falhou em proteger seu senhor e agora busca redenção.",
        'Pirata': "sobreviveu a um motim e foi deixado em uma ilha deserta.",
        'Caçador de Recompensas': "perseguiu um alvo que acabou se tornando seu único amigo.",
        'generic': "decidiu que o destino não seria escrito pelos outros, mas por sua própria lâmina."
    },
    motivations: [
        "Agora busca poder suficiente para desafiar os deuses.",
        "Viaja para pagar uma dívida de sangue que jamais poderá ser quitada.",
        "Procura o ingrediente final para uma cura impossível.",
        "Deseja apenas esquecer os horrores que testemunhou.",
        "Quer escrever seu nome nas estrelas, custe o que custar.",
        "Caça a criatura de seis olhos que assombra seus pesadelos.",
        "Busca restaurar a honra de sua família caída.",
        "Deseja acumular ouro suficiente para comprar seu próprio reino.",
        "Procura a chave para destrancar os portões do submundo."
    ]
};

const generateBackstory = (background: string, dndClass: string, race: string): string => {
    const origin = STORY_TEMPLATES.origins[Math.floor(Math.random() * STORY_TEMPLATES.origins.length)];
    const foundKey = Object.keys(STORY_TEMPLATES.incidents).find(k => background.includes(k));
    const incidentKey = foundKey || 'generic';
    const incident = STORY_TEMPLATES.incidents[incidentKey];
    const motivation = STORY_TEMPLATES.motivations[Math.floor(Math.random() * STORY_TEMPLATES.motivations.length)];

    return `${origin} este ${race} ${dndClass} ${incident} ${motivation}`;
};

// --- WEALTH GENERATION ---
const generateStartingWealth = (className: string): Wealth => {
    // Basic Standard Starting Gold logic (simplified average of 5e rules)
    // Multiplied by 10 for Gold Piece value in calculation, stored as GP
    let gold = 0;
    
    switch (className) {
        case 'Bárbaro': gold = (rollDice(4) + rollDice(4)) * 10; break;
        case 'Bardo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Clérigo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Druida': gold = (rollDice(4) + rollDice(4)) * 10; break;
        case 'Guerreiro': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Monge': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)); break; // 5d4 gp (low wealth)
        case 'Paladino': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Patrulheiro': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Ladino': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Feiticeiro': gold = (rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Bruxo': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        case 'Mago': gold = (rollDice(4) + rollDice(4) + rollDice(4) + rollDice(4)) * 10; break;
        default: gold = 100;
    }

    return {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: gold,
        pp: 0
    };
};

// --- ITEM FACTORY HELPERS ---
const createItem = (name: string, type: Item['type'], props: Partial<Item> = {}): Item => ({
    id: crypto.randomUUID(),
    name,
    type,
    quantity: 1,
    ...props
});

// --- STARTING EQUIPMENT KITS (Typed) ---
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

// --- AC CALCULATION ---
const calculateAC = (dndClass: string, dexMod: number, conMod: number, wisMod: number, equipment: Item[]): number => {
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

  // 3. Add Shield Bonus (applies to standard, armored, and Barbarian unarmored)
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
    const classData = CLASSES.find(c => c.name === char.class);
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

    // 7. Ensure Wealth object exists (for old saves)
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

  // Story
  const backstory = isNPC 
    ? `"${NPC_QUOTES[Math.floor(Math.random() * NPC_QUOTES.length)]}"`
    : generateBackstory(background, dndClass.name, raceDef.name);

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
