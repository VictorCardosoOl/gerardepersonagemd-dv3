
import { DndClass, DndRace, SkillName, Attribute } from "./types";

// --- ATTRIBUTE DESCRIPTIONS (TOOLTIPS) ---
export const ATTRIBUTE_DESCRIPTIONS: Record<string, string> = {
    "Força": "Mede sua potência física natural, capacidade atlética e o quanto você pode carregar. Importante para Bárbaros e Guerreiros.",
    "Destreza": "Mede agilidade, reflexos e equilíbrio. Afeta sua Classe de Armadura (CA) e ataques à distância ou com armas leves.",
    "Constituição": "Mede saúde, vigor e força vital. Determina seus Pontos de Vida (HP). Essencial para todos os aventureiros sobreviverem.",
    "Inteligência": "Mede acuidade mental, memória e raciocínio lógico. Usada para conjuração de Magos e perícias de conhecimento.",
    "Sabedoria": "Mede percepção, intuição e força de vontade. Usada para Clérigos, Druidas e para perceber o mundo ao redor.",
    "Carisma": "Mede força de personalidade, eloquência e liderança. Usada por Bardos, Paladinos, Feiticeiros e Bruxos para magia e interação social."
};

export const GUIDE_STEPS = [
    {
        title: "1. Escolha sua Raça",
        desc: "A raça define sua biologia, aparência e talentos naturais. Um Elfo é ágil e mágico, enquanto um Anão é resistente e forte.",
        icon: "🧬"
    },
    {
        title: "2. Escolha sua Classe",
        desc: "A classe é sua profissão e como você luta. Guerreiros usam armas, Magos usam feitiços, Ladinos usam astúcia.",
        icon: "⚔️"
    },
    {
        title: "3. Entenda os Atributos",
        desc: "Seus 6 números principais definem o que você faz bem. O Modificador (ex: +3) é o número que você realmente soma nos dados.",
        icon: "📊"
    },
    {
        title: "4. Interpretação",
        desc: "O D&D é sobre contar histórias. Use o campo 'Antecedente' para dar vida ao personagem. Quem ele era antes de se tornar herói?",
        icon: "🎭"
    }
];

// --- SYSTEM OF TRANSLATION ---
export const DICTIONARY: Record<string, string> = {
  // Sizes
  "Tiny": "Minúsculo",
  "Small": "Pequeno",
  "Medium": "Médio",
  "Large": "Grande",
  "Huge": "Enorme",
  "Gargantuan": "Imenso",
  
  // Types
  "aberration": "Aberração",
  "beast": "Besta",
  "celestial": "Celestial",
  "construct": "Constructo",
  "dragon": "Dragão",
  "elemental": "Elemental",
  "fey": "Fada",
  "fiend": "Corruptor",
  "giant": "Gigante",
  "humanoid": "Humanoide",
  "monstrosity": "Monstruosidade",
  "ooze": "Limo",
  "plant": "Planta",
  "undead": "Morto-vivo",
  "swarm of Tiny beasts": "Enxame de bestas minúsculas",
  
  // Alignments
  "unaligned": "Imparcial",
  "lawful good": "Leal e Bom",
  "neutral good": "Neutro e Bom",
  "chaotic good": "Caótico e Bom",
  "lawful neutral": "Leal e Neutro",
  "neutral": "Neutro",
  "chaotic neutral": "Caótico e Neutro",
  "lawful evil": "Leal e Mau",
  "neutral evil": "Neutro e Mau",
  "chaotic evil": "Caótico e Mau",
  "any alignment": "Qualquer alinhamento",
  "any non-good alignment": "Qualquer não-bom",
  "any non-lawful alignment": "Qualquer não-leal",

  // Stats (English to PT Abbr)
  "strength": "FOR",
  "dexterity": "DES",
  "constitution": "CON",
  "intelligence": "INT",
  "wisdom": "SAB",
  "charisma": "CAR",

  // Stats (PT Full to PT Abbr - For UI Consistency)
  "Força": "FOR",
  "Destreza": "DES",
  "Constituição": "CON",
  "Inteligência": "INT",
  "Sabedoria": "SAB",
  "Carisma": "CAR",

  // Skills
  "acrobatics": "Acrobacia",
  "animal handling": "Adestrar Animais",
  "arcana": "Arcanismo",
  "athletics": "Atletismo",
  "deception": "Enganação",
  "history": "História",
  "insight": "Intuição",
  "intimidation": "Intimidação",
  "investigation": "Investigação",
  "medicine": "Medicina",
  "nature": "Natureza",
  "perception": "Percepção",
  "performance": "Atuação",
  "persuasion": "Persuasão",
  "religion": "Religião",
  "sleight of hand": "Prestidigitação",
  "stealth": "Furtividade",
  "survival": "Sobrevivência",

  // Senses & Speeds
  "darkvision": "Visão no Escuro",
  "blindsight": "Visão às Cegas",
  "tremorsense": "Sentido Sísmico",
  "truesight": "Visão Verdadeira",
  "passive Perception": "Percepção Passiva",
  "walk": "Desl.",
  "fly": "Voo",
  "swim": "Natação",
  "climb": "Escalada",
  "burrow": "Escavação",
  "hover": "(flutuar)",

  // Damage Types
  "acid": "Ácido",
  "bludgeoning": "Concussão",
  "cold": "Frio",
  "fire": "Fogo",
  "force": "Energia",
  "lightning": "Elétrico",
  "necrotic": "Necrótico",
  "piercing": "Perfurante",
  "poison": "Veneno",
  "psychic": "Psíquico",
  "radiant": "Radiante",
  "slashing": "Cortante",
  "thunder": "Trovejante",
  "nonmagical": "não-mágico",
  "adamantine": "adamantina",
  "silvered": "prateado",

  // Conditions
  "blinded": "Cego",
  "charmed": "Enfeitiçado",
  "deafened": "Surdo",
  "frightened": "Amedrontado",
  "grappled": "Agarrado",
  "incapacitated": "Incapacitado",
  "invisible": "Invisível",
  "paralyzed": "Paralisado",
  "petrified": "Petrificado",
  "poisoned": "Envenenado",
  "prone": "Caído",
  "restrained": "Impedido",
  "stunned": "Atordoado",
  "unconscious": "Inconsciente",
  "exhaustion": "Exaustão",

  // Common Name Words (Simple Heuristics)
  "Adult": "Adulto",
  "Ancient": "Antigo",
  "Young": "Jovem",
  "Blue": "Azul",
  "Red": "Vermelho",
  "Green": "Verde",
  "Black": "Preto",
  "White": "Branco",
  "Gold": "Dourado",
  "Silver": "Prateado",
  "Bronze": "Bronze",
  "Copper": "Cobre",
  "Brass": "Latão",
  "Werewolf": "Lobisomem",
  "Orc": "Orc",
  "Goblin": "Goblin",
  "Ghost": "Fantasma",
  "Zombie": "Zumbi",
  "Skeleton": "Esqueleto",
  "Vampire": "Vampiro",
  "Commoner": "Plebeu",
  "Cultist": "Cultista",
  "Bandit": "Bandido",
  "Mage": "Mago",
  "Druid": "Druida",
  "Spy": "Espião",
  "Knight": "Cavaleiro",
  "Veteran": "Veterano"
};

// --- VISUAL ASSETS (RACE IMAGES) ---
// High-quality, moody, dark fantasy images for the Ethereal Theme
export const RACE_IMAGES: Record<string, string> = {
    'Humano': 'https://images.unsplash.com/photo-1542259681-d3d63b82a0d7?q=80&w=1000&auto=format&fit=crop', // Dark Warrior
    'Elfo': 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop', // Mystic Dark
    'Anão': 'https://images.unsplash.com/photo-1506422748879-887454f9cdff?q=80&w=1000&auto=format&fit=crop', // Forge Sparks/Texture
    'Halfling': 'https://images.unsplash.com/photo-1502477612301-44703a557b77?q=80&w=1000&auto=format&fit=crop', // Forest Floor/Small
    'Draconato': 'https://images.unsplash.com/photo-1535581652167-3d6b9353a90b?q=80&w=1000&auto=format&fit=crop', // Reptile Eye/Scale
    'Gnomo': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop', // Magical Crystals
    'Meio-Orc': 'https://images.unsplash.com/photo-1599789197514-dd7273dc766f?q=80&w=1000&auto=format&fit=crop', // Brutalist Armor
    'Tiefling': 'https://images.unsplash.com/photo-1634918737676-e8d12cc49942?q=80&w=1000&auto=format&fit=crop', // Horned/Demonic Vibe
};

export const RACES: DndRace[] = [
  { 
    name: 'Humano', 
    speed: 9, 
    bonuses: { Força: 1, Destreza: 1, Constituição: 1, Inteligência: 1, Sabedoria: 1, Carisma: 1 }, 
    languages: ['Comum', 'Um extra a escolha'], 
    senses: [],
    description: "Humanos são a mais adaptável e comum das raças comuns. Sua ambição e ímpeto de realizar algo levam-nos a abandonar suas terras natais e explorar o mundo.",
    traits: ["Versatilidade Humana"]
  },
  { 
    name: 'Elfo', 
    speed: 9, 
    bonuses: { Destreza: 2, Inteligência: 1 }, 
    languages: ['Comum', 'Élfico'], 
    senses: ['Visão no Escuro 18m', 'Sentidos Aguçados'],
    description: "Elfos são um povo mágico de graça sobrenatural, vivendo no mundo sem fazer parte inteiramente dele. Eles amam a natureza e a magia, a arte e a música.",
    traits: ["Ancestralidade Feérica", "Transe", "Sentidos Aguçados"]
  },
  { 
    name: 'Anão', 
    speed: 7.5, 
    bonuses: { Constituição: 2, Força: 2 }, 
    languages: ['Comum', 'Anão'], 
    senses: ['Visão no Escuro 18m', 'Resiliência Anã'],
    description: "Reinos ricos de grandeza antiga, salões escavados nas raízes das montanhas, o eco de picaretas e martelos em minas profundas e forjas ardentes.",
    traits: ["Resiliência Anã", "Treinamento em Combate Anão", "Conhecimento de Pedra"]
  },
  { 
    name: 'Halfling', 
    speed: 7.5, 
    bonuses: { Destreza: 2, Carisma: 1 }, 
    languages: ['Comum', 'Halfling'], 
    senses: ['Sortudo', 'Bravura'],
    description: "O conforto de um lar é o objetivo da maioria dos halflings: um lugar para se estabelecer em paz e sossego, longe de monstros saqueadores.",
    traits: ["Sortudo", "Bravura", "Agilidade Halfling"]
  },
  { 
    name: 'Draconato', 
    speed: 9, 
    bonuses: { Força: 2, Carisma: 1 }, 
    languages: ['Comum', 'Dracônico'], 
    senses: ['Resistência a Dano'],
    description: "Nascidos de dragões, como seu nome proclama, os draconatos caminham orgulhosamente pelo mundo que os saúda com um temor incompreensível.",
    traits: ["Ancestralidade Dracônica", "Ataque de Sopro", "Resistência a Dano"]
  },
  { 
    name: 'Gnomo', 
    speed: 7.5, 
    bonuses: { Inteligência: 2, Constituição: 1 }, 
    languages: ['Comum', 'Gnômico'], 
    senses: ['Visão no Escuro 18m', 'Esperteza Gnômica'],
    description: "Um zumbido constante de atividade permeia os lares onde os gnomos formam suas comunidades muito unidas. Eles vivem intensamente.",
    traits: ["Esperteza Gnômica", "Ilusionista Nato (Gnomo da Floresta)", "Engenhoqueiro (Gnomo das Rochas)"]
  },
  { 
    name: 'Meio-Orc', 
    speed: 9, 
    bonuses: { Força: 2, Constituição: 1 }, 
    languages: ['Comum', 'Orc'], 
    senses: ['Visão no Escuro 18m', 'Ameaçador', 'Implacável'],
    description: "Meio-orcs contam com força bruta e vigor para superar seus desafios. Muitos buscam uma vida de aventuras, onde sua força marcial é valorizada.",
    traits: ["Ameaçador", "Resistência Implacável", "Ataques Selvagens"]
  },
  { 
    name: 'Tiefling', 
    speed: 9, 
    bonuses: { Carisma: 2, Inteligência: 1 }, 
    languages: ['Comum', 'Infernal'], 
    senses: ['Visão no Escuro 18m', 'Resistência Infernal'],
    description: "Ser recebido com olhares e sussurros, sofrer violência e insultos na rua, ver a desconfiança e o medo em cada olhar: esse é o fardo do tiefling.",
    traits: ["Legado Infernal", "Resistência Infernal"]
  },
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
  'Eremita', 'Nobre', 'Forasteiro', 'Sábio', 'Marinheiro', 'Soldado', 'Órfão',
  'Gladiador', 'Cavaleiro', 'Pirata', 'Caçador de Recompensas', 'Mercador de Clã',
  'Erudito Enclausurado', 'Assombrado', 'Veterano Mercenário', 'Vigilante Urbano',
  'Herdeiro Disputado', 'Arqueólogo', 'Antropólogo'
];

export const ALIGNMENTS = [
  'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
  'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
  'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
];

export const NAMES_FIRST = [
  'Ael', 'Bar', 'Cae', 'Dor', 'Eri', 'Fael', 'Gor', 'Hul', 'Ias', 'Jan', 'Kel', 'Lor', 
  'Mor', 'Nor', 'Ori', 'Pan', 'Quil', 'Ras', 'Syl', 'Tho', 'Ulf', 'Val', 'Wyn', 'Xan', 'Yor', 'Zen',
  'Arin', 'Bael', 'Cor', 'Dian', 'Elas', 'Fian', 'Gael', 'Hael', 'Ion', 'Jor', 'Kael', 'Lian',
  'Mael', 'Nael', 'Olin', 'Pian', 'Qor', 'Rian', 'Sian', 'Tian', 'Ulan', 'Vian', 'Wael', 'Xor',
  'Yian', 'Zaer', 'Bram', 'Cade', 'Dorn', 'Ewan', 'Finn', 'Grom', 'Hark', 'Ivor', 'Jace', 'Kian'
];

export const NAMES_LAST = [
  'thos', 'bar', 'drin', 'gan', 'mar', 'lamin', 'krin', 'dor', 'las', 'ther', 'vin', 'mus', 
  'nos', 'roth', 'us', 'xar', 'zarr', 'wind', 'storm', 'fire', 'shield', 'hammer',
  'forge', 'blade', 'song', 'shade', 'light', 'dark', 'moon', 'star', 'sun', 'sky',
  'sea', 'stone', 'wood', 'iron', 'steel', 'gold', 'silver', 'blood', 'bone', 'fist',
  'foot', 'hand', 'eye', 'heart', 'mind', 'soul', 'spirit', 'breath', 'walker', 'runner'
];

export const NPC_QUOTES = [
  "Eu costumava ser um aventureiro como você, até levar uma flechada no joelho.",
  "Mantenha sua espada afiada e sua língua mais ainda.",
  "Por um preço justo, eu vendo até minha avó. Brincadeira... ou não.",
  "Os deuses nos observam, viajante. Comporte-se.",
  "Não caia no sono na taverna do Cão Sarnento.",
  "Você viu meu gato? Ele é pequeno, preto e cospe fogo.",
  "O segredo de uma vida longa? Correr mais rápido que o monstro.",
  "Nunca confie em um mago que não cheira a enxofre.",
  "Aquela montanha ali? Dizem que engoliu um exército inteiro.",
  "Se você procura problemas, está no lugar certo.",
  "Eu vi coisas nas profundezas que fariam seus cabelos ficarem brancos.",
  "Um brinde aos que caíram e aos que ainda vão cair!",
  "Cuidado com os sussurros na floresta à noite.",
  "O ouro brilha, mas o aço resolve.",
  "Nem tudo que reluz é tesouro, às vezes é a baba de um mímico."
];
