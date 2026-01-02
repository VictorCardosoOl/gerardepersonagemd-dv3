

export type Attribute = 'Força' | 'Destreza' | 'Constituição' | 'Inteligência' | 'Sabedoria' | 'Carisma';

export type SkillName = 
  'Acrobacia' | 'Adestrar Animais' | 'Arcanismo' | 'Atletismo' | 'Atuação' | 
  'Enganação' | 'Furtividade' | 'História' | 'Intimidação' | 'Intuição' | 
  'Investigação' | 'Medicina' | 'Natureza' | 'Percepção' | 'Persuasão' | 
  'Prestidigitação' | 'Religião' | 'Sobrevivência';

export type ItemType = 'weapon' | 'armor' | 'shield' | 'gear' | 'tool' | 'instrument' | 'consumable';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  description?: string;
  // Propriedades de Regra
  acBase?: number; // Para armaduras
  acBonus?: number; // Para escudos ou itens mágicos
  dexBonusCap?: number; // Max destreza (ex: 2 para armaduras médias)
  stealthDisadvantage?: boolean;
  damage?: string; // ex: "1d8"
}

export interface Attributes {
  Força: number;
  Destreza: number;
  Constituição: number;
  Inteligência: number;
  Sabedoria: number;
  Carisma: number;
}

export interface Skill {
  name: SkillName;
  attribute: Attribute;
  proficient: boolean;
  value: number;
}

export interface Wealth {
  cp: number; // Cobre
  sp: number; // Prata
  ep: number; // Electro
  gp: number; // Ouro
  pp: number; // Platina
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  alignment: string;
  background: string;
  level: number;
  proficiencyBonus: number;
  hp: number;
  maxHp: number; 
  ac: number;
  initiative: number;
  attributes: Attributes;
  modifiers: Attributes;
  skills: Skill[];
  passivePerception: number;
  equipment: Item[]; 
  wealth: Wealth; // Novo campo
  languages: string[];
  senses: string[];
  backstory?: string;
  createdAt: number;
  isNPC?: boolean;
}

export interface DndClass {
  name: string;
  hitDie: number;
  primaryAttributes: Attribute[];
  proficiencies: string[];
  skillChoices: SkillName[];
  numSkills: number;
}

export interface DndRace {
  name: string;
  speed: number;
  bonuses: Partial<Attributes>;
  languages: string[];
  senses: string[];
  description?: string;
  traits?: string[];
}
