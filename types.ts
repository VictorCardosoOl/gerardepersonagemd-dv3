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
  maxHp: number; // Added for tracking current vs max
  ac: number;
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
}