import { DndClass, DndRace } from "./types";

export const RACES: DndRace[] = [
  { name: 'Humano', speed: 9, bonuses: { Força: 1, Destreza: 1, Constituição: 1, Inteligência: 1, Sabedoria: 1, Carisma: 1 } },
  { name: 'Elfo', speed: 9, bonuses: { Destreza: 2, Inteligência: 1 } },
  { name: 'Anão', speed: 7.5, bonuses: { Constituição: 2, Força: 2 } },
  { name: 'Halfling', speed: 7.5, bonuses: { Destreza: 2, Carisma: 1 } },
  { name: 'Draconato', speed: 9, bonuses: { Força: 2, Carisma: 1 } },
  { name: 'Gnomo', speed: 7.5, bonuses: { Inteligência: 2, Constituição: 1 } },
  { name: 'Meio-Orc', speed: 9, bonuses: { Força: 2, Constituição: 1 } },
  { name: 'Tiefling', speed: 9, bonuses: { Carisma: 2, Inteligência: 1 } },
];

export const CLASSES: DndClass[] = [
  { name: 'Bárbaro', hitDie: 12, primaryAttributes: ['Força', 'Constituição'], proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples', 'Armas Marciais'] },
  { name: 'Bardo', hitDie: 8, primaryAttributes: ['Carisma', 'Destreza'], proficiencies: ['Armaduras Leves', 'Armas Simples', 'Bestas de Mão', 'Espadas Longas'] },
  { name: 'Clérigo', hitDie: 8, primaryAttributes: ['Sabedoria', 'Constituição'], proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples'] },
  { name: 'Druida', hitDie: 8, primaryAttributes: ['Sabedoria', 'Constituição'], proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Clavas', 'Adagas'] },
  { name: 'Guerreiro', hitDie: 10, primaryAttributes: ['Força', 'Constituição'], proficiencies: ['Todas as Armaduras', 'Escudos', 'Armas Simples', 'Armas Marciais'] },
  { name: 'Monge', hitDie: 8, primaryAttributes: ['Destreza', 'Sabedoria'], proficiencies: ['Armas Simples', 'Espadas Curtas'] },
  { name: 'Paladino', hitDie: 10, primaryAttributes: ['Força', 'Carisma'], proficiencies: ['Todas as Armaduras', 'Escudos', 'Armas Simples', 'Armas Marciais'] },
  { name: 'Patrulheiro', hitDie: 10, primaryAttributes: ['Destreza', 'Sabedoria'], proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples', 'Armas Marciais'] },
  { name: 'Ladino', hitDie: 8, primaryAttributes: ['Destreza', 'Inteligência'], proficiencies: ['Armaduras Leves', 'Armas Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapieiras', 'Espadas Curtas'] },
  { name: 'Feiticeiro', hitDie: 6, primaryAttributes: ['Carisma', 'Constituição'], proficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'] },
  { name: 'Bruxo', hitDie: 8, primaryAttributes: ['Carisma', 'Constituição'], proficiencies: ['Armaduras Leves', 'Armas Simples'] },
  { name: 'Mago', hitDie: 6, primaryAttributes: ['Inteligência', 'Constituição'], proficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'] },
];

export const BACKGROUNDS = [
  'Acólito', 'Charlatão', 'Criminoso', 'Artista', 'Herói do Povo', 'Artesão da Guilda', 
  'Eremita', 'Nobre', 'Forasteiro', 'Sábio', 'Marinheiro', 'Soldado', 'Órfão'
];

export const ALIGNMENTS = [
  'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
  'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
  'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
];

export const NAMES_FIRST = [
  'Ael', 'Bar', 'Cae', 'Dor', 'Eri', 'Fael', 'Gor', 'Hul', 'Ias', 'Jan', 'Kel', 'Lor', 
  'Mor', 'Nor', 'Ori', 'Pan', 'Quil', 'Ras', 'Syl', 'Tho', 'Ulf', 'Val', 'Wyn', 'Xan', 'Yor', 'Zen'
];

export const NAMES_LAST = [
  'thos', 'bar', 'drin', 'gan', 'mar', 'lamin', 'krin', 'dor', 'las', 'ther', 'vin', 'mus', 
  'nos', 'roth', 'us', 'xar', 'zarr', 'wind', 'storm', 'fire', 'shield', 'hammer'
];