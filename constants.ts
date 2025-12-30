import { DndClass, DndRace, SkillName, Attribute } from "./types";

export const RACES: DndRace[] = [
  { name: 'Humano', speed: 9, bonuses: { Força: 1, Destreza: 1, Constituição: 1, Inteligência: 1, Sabedoria: 1, Carisma: 1 }, languages: ['Comum', 'Um extra a escolha'], senses: [] },
  { name: 'Elfo', speed: 9, bonuses: { Destreza: 2, Inteligência: 1 }, languages: ['Comum', 'Élfico'], senses: ['Visão no Escuro 18m', 'Sentidos Aguçados'] },
  { name: 'Anão', speed: 7.5, bonuses: { Constituição: 2, Força: 2 }, languages: ['Comum', 'Anão'], senses: ['Visão no Escuro 18m', 'Resiliência Anã'] },
  { name: 'Halfling', speed: 7.5, bonuses: { Destreza: 2, Carisma: 1 }, languages: ['Comum', 'Halfling'], senses: ['Sortudo', 'Bravura'] },
  { name: 'Draconato', speed: 9, bonuses: { Força: 2, Carisma: 1 }, languages: ['Comum', 'Dracônico'], senses: ['Resistência a Dano'] },
  { name: 'Gnomo', speed: 7.5, bonuses: { Inteligência: 2, Constituição: 1 }, languages: ['Comum', 'Gnômico'], senses: ['Visão no Escuro 18m', 'Esperteza Gnômica'] },
  { name: 'Meio-Orc', speed: 9, bonuses: { Força: 2, Constituição: 1 }, languages: ['Comum', 'Orc'], senses: ['Visão no Escuro 18m', 'Ameaçador', 'Implacável'] },
  { name: 'Tiefling', speed: 9, bonuses: { Carisma: 2, Inteligência: 1 }, languages: ['Comum', 'Infernal'], senses: ['Visão no Escuro 18m', 'Resistência Infernal'] },
];

export const SKILL_LIST: { name: SkillName; attr: Attribute }[] = [
  { name: 'Acrobacia', attr: 'Destreza' },
  { name: 'Adestrar Animais', attr: 'Sabedoria' },
  { name: 'Arcanismo', attr: 'Inteligência' },
  { name: 'Atletismo', attr: 'Força' },
  { name: 'Atuação', attr: 'Carisma' },
  { name: 'Enganação', attr: 'Carisma' },
  { name: 'Furtividade', attr: 'Destreza' },
  { name: 'História', attr: 'Inteligência' },
  { name: 'Intimidação', attr: 'Carisma' },
  { name: 'Intuição', attr: 'Sabedoria' },
  { name: 'Investigação', attr: 'Inteligência' },
  { name: 'Medicina', attr: 'Sabedoria' },
  { name: 'Natureza', attr: 'Inteligência' },
  { name: 'Percepção', attr: 'Sabedoria' },
  { name: 'Persuasão', attr: 'Carisma' },
  { name: 'Prestidigitação', attr: 'Destreza' },
  { name: 'Religião', attr: 'Inteligência' },
  { name: 'Sobrevivência', attr: 'Sabedoria' },
];

export const CLASSES: DndClass[] = [
  { 
    name: 'Bárbaro', 
    hitDie: 12, 
    primaryAttributes: ['Força', 'Constituição'], 
    proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples', 'Armas Marciais'],
    skillChoices: ['Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência', 'Adestrar Animais'],
    numSkills: 2
  },
  { 
    name: 'Bardo', 
    hitDie: 8, 
    primaryAttributes: ['Carisma', 'Destreza'], 
    proficiencies: ['Armaduras Leves', 'Armas Simples', 'Bestas de Mão', 'Espadas Longas'],
    skillChoices: ['Atuação', 'Persuasão', 'Enganação', 'Acrobacia', 'Furtividade', 'História', 'Intuição'], // Bardos podem escolher qualquer uma, simplificado aqui
    numSkills: 3
  },
  { 
    name: 'Clérigo', 
    hitDie: 8, 
    primaryAttributes: ['Sabedoria', 'Constituição'], 
    proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples'],
    skillChoices: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
    numSkills: 2
  },
  { 
    name: 'Druida', 
    hitDie: 8, 
    primaryAttributes: ['Sabedoria', 'Constituição'], 
    proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Clavas', 'Adagas'],
    skillChoices: ['Arcanismo', 'Adestrar Animais', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência'],
    numSkills: 2
  },
  { 
    name: 'Guerreiro', 
    hitDie: 10, 
    primaryAttributes: ['Força', 'Constituição'], 
    proficiencies: ['Todas as Armaduras', 'Escudos', 'Armas Simples', 'Armas Marciais'],
    skillChoices: ['Acrobacia', 'Adestrar Animais', 'Atletismo', 'História', 'Intuição', 'Intimidação', 'Percepção', 'Sobrevivência'],
    numSkills: 2
  },
  { 
    name: 'Monge', 
    hitDie: 8, 
    primaryAttributes: ['Destreza', 'Sabedoria'], 
    proficiencies: ['Armas Simples', 'Espadas Curtas'],
    skillChoices: ['Acrobacia', 'Atletismo', 'História', 'Intuição', 'Religião', 'Furtividade'],
    numSkills: 2
  },
  { 
    name: 'Paladino', 
    hitDie: 10, 
    primaryAttributes: ['Força', 'Carisma'], 
    proficiencies: ['Todas as Armaduras', 'Escudos', 'Armas Simples', 'Armas Marciais'],
    skillChoices: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião'],
    numSkills: 2
  },
  { 
    name: 'Patrulheiro', 
    hitDie: 10, 
    primaryAttributes: ['Destreza', 'Sabedoria'], 
    proficiencies: ['Armaduras Leves', 'Armaduras Médias', 'Escudos', 'Armas Simples', 'Armas Marciais'],
    skillChoices: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência', 'Intuição'],
    numSkills: 3
  },
  { 
    name: 'Ladino', 
    hitDie: 8, 
    primaryAttributes: ['Destreza', 'Inteligência'], 
    proficiencies: ['Armaduras Leves', 'Armas Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapieiras', 'Espadas Curtas'],
    skillChoices: ['Acrobacia', 'Atletismo', 'Enganação', 'Furtividade', 'Investigação', 'Intimidação', 'Percepção', 'Prestidigitação', 'Persuasão'],
    numSkills: 4
  },
  { 
    name: 'Feiticeiro', 
    hitDie: 6, 
    primaryAttributes: ['Carisma', 'Constituição'], 
    proficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
    skillChoices: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião'],
    numSkills: 2
  },
  { 
    name: 'Bruxo', 
    hitDie: 8, 
    primaryAttributes: ['Carisma', 'Constituição'], 
    proficiencies: ['Armaduras Leves', 'Armas Simples'],
    skillChoices: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
    numSkills: 2
  },
  { 
    name: 'Mago', 
    hitDie: 6, 
    primaryAttributes: ['Inteligência', 'Constituição'], 
    proficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
    skillChoices: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'],
    numSkills: 2
  },
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

export const NPC_QUOTES = [
  "Eu costumava ser um aventureiro como você, até levar uma flechada no joelho.",
  "Mantenha sua espada afiada e sua língua mais ainda.",
  "Por um preço justo, eu vendo até minha avó. Brincadeira... ou não.",
  "Os deuses nos observam, viajante. Comporte-se.",
  "Não caia no sono na taverna do Cão Sarnento.",
  "Você viu meu gato? Ele é pequeno, preto e cospe fogo."
];