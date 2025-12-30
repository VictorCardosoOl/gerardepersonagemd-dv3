export type Attribute = 'Força' | 'Destreza' | 'Constituição' | 'Inteligência' | 'Sabedoria' | 'Carisma';

export type SkillName = 
  'Acrobacia' | 'Adestrar Animais' | 'Arcanismo' | 'Atletismo' | 'Atuação' | 
  'Enganação' | 'Furtividade' | 'História' | 'Intimidação' | 'Intuição' | 
  'Investigação' | 'Medicina' | 'Natureza' | 'Percepção' | 'Persuasão' | 
  'Prestidigitação' | 'Religião' | 'Sobrevivência';

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
  initiative: number; // Added field for manual override
  attributes: Attributes;
  modifiers: Attributes;
  skills: Skill[];
  passivePerception: number;
  equipment: string[];
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

// API Types for Bestiary
export interface MonsterAction {
  name: string;
  desc: string;
  attack_bonus?: number;
}

// Normalized Monster interface for the View
export interface Monster {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class_value: number; // Normalized
  armor_class_desc: string; // Normalized
  hit_points: number;
  hit_dice: string;
  speed: { walk: string, fly?: string, swim?: string };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: { value: number, proficiency: { name: string } }[];
  damage_vulnerabilities: string[];
  damage_resistances: string[];
  damage_immunities: string[];
  condition_immunities: { name: string }[];
  senses: Record<string, string | number>;
  languages: string;
  challenge_rating: number;
  xp: number;
  special_abilities?: MonsterAction[];
  actions?: MonsterAction[];
  legendary_actions?: MonsterAction[];
}

export interface APIMonsterIndex {
  index: string;
  name: string;
  url: string;
}