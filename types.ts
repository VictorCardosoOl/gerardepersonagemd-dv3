export type Attribute = 'Força' | 'Destreza' | 'Constituição' | 'Inteligência' | 'Sabedoria' | 'Carisma';

export interface Attributes {
  Força: number;
  Destreza: number;
  Constituição: number;
  Inteligência: number;
  Sabedoria: number;
  Carisma: number;
}

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  alignment: string;
  background: string;
  level: number;
  hp: number;
  ac: number;
  attributes: Attributes;
  modifiers: Attributes;
  equipment: string[];
  backstory?: string;
  createdAt: number;
}

export interface DndClass {
  name: string;
  hitDie: number;
  primaryAttributes: Attribute[];
  proficiencies: string[];
}

export interface DndRace {
  name: string;
  speed: number;
  bonuses: Partial<Attributes>;
}