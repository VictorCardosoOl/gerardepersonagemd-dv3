// Domain Types for Bestiary Feature

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
  armor_class_value: number; 
  armor_class_desc: string; 
  hit_points: number;
  hit_dice: string;
  speed: { walk: string, fly?: string, swim?: string, climb?: string, burrow?: string };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: { value: number, proficiency: { name: string } }[]; // Mantido para compatibilidade
  saving_throws?: { name: string, value: number }[];
  skills?: { name: string, value: number }[];
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