import { Attribute, SkillName } from "./types";

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
  "Tiny": "Minúsculo", "Small": "Pequeno", "Medium": "Médio", "Large": "Grande", "Huge": "Enorme", "Gargantuan": "Imenso",
  "aberration": "Aberração", "beast": "Besta", "celestial": "Celestial", "construct": "Constructo", "dragon": "Dragão",
  "elemental": "Elemental", "fey": "Fada", "fiend": "Corruptor", "giant": "Gigante", "humanoid": "Humanoide",
  "monstrosity": "Monstruosidade", "ooze": "Limo", "plant": "Planta", "undead": "Morto-vivo",
  "unaligned": "Imparcial", "lawful good": "Leal e Bom", "neutral good": "Neutro e Bom", "chaotic good": "Caótico e Bom",
  "lawful neutral": "Leal e Neutro", "neutral": "Neutro", "chaotic neutral": "Caótico e Neutro", "lawful evil": "Leal e Mau",
  "neutral evil": "Neutro e Mau", "chaotic evil": "Caótico e Mau", "any alignment": "Qualquer alinhamento",
  "strength": "FOR", "dexterity": "DES", "constitution": "CON", "intelligence": "INT", "wisdom": "SAB", "charisma": "CAR",
  "Força": "FOR", "Destreza": "DES", "Constituição": "CON", "Inteligência": "INT", "Sabedoria": "SAB", "Carisma": "CAR",
  "acrobatics": "Acrobacia", "animal handling": "Adestrar Animais", "arcana": "Arcanismo", "athletics": "Atletismo",
  "deception": "Enganação", "history": "História", "insight": "Intuição", "intimidation": "Intimidação",
  "investigation": "Investigação", "medicine": "Medicina", "nature": "Natureza", "perception": "Percepção",
  "performance": "Atuação", "persuasion": "Persuasão", "religion": "Religião", "sleight of hand": "Prestidigitação",
  "stealth": "Furtividade", "survival": "Sobrevivência",
  "darkvision": "Visão no Escuro", "blindsight": "Visão às Cegas", "tremorsense": "Sentido Sísmico", "truesight": "Visão Verdadeira",
  "passive Perception": "Percepção Passiva", "walk": "Desl.", "fly": "Voo", "swim": "Natação", "climb": "Escalada",
  "burrow": "Escavação", "hover": "(flutuar)",
  "acid": "Ácido", "bludgeoning": "Concussão", "cold": "Frio", "fire": "Fogo", "force": "Energia", "lightning": "Elétrico",
  "necrotic": "Necrótico", "piercing": "Perfurante", "poison": "Veneno", "psychic": "Psíquico", "radiant": "Radiante",
  "slashing": "Cortante", "thunder": "Trovejante", "nonmagical": "não-mágico", "adamantine": "adamantina", "silvered": "prateado",
  "blinded": "Cego", "charmed": "Enfeitiçado", "deafened": "Surdo", "frightened": "Amedrontado", "grappled": "Agarrado",
  "incapacitated": "Incapacitado", "invisible": "Invisível", "paralyzed": "Paralisado", "petrified": "Petrificado",
  "poisoned": "Envenenado", "prone": "Caído", "restrained": "Impedido", "stunned": "Atordoado", "unconscious": "Inconsciente",
  "exhaustion": "Exaustão"
};

// --- VISUAL ASSETS (RACE IMAGES) ---
export const RACE_IMAGES: Record<string, string> = {
    'Humano': 'https://images.unsplash.com/photo-1542259681-d3d63b82a0d7?q=80&w=1000&auto=format&fit=crop',
    'Elfo': 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop',
    'Anão': 'https://images.unsplash.com/photo-1506422748879-887454f9cdff?q=80&w=1000&auto=format&fit=crop',
    'Halfling': 'https://images.unsplash.com/photo-1502477612301-44703a557b77?q=80&w=1000&auto=format&fit=crop',
    'Draconato': 'https://images.unsplash.com/photo-1535581652167-3d6b9353a90b?q=80&w=1000&auto=format&fit=crop',
    'Gnomo': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    'Meio-Orc': 'https://images.unsplash.com/photo-1599789197514-dd7273dc766f?q=80&w=1000&auto=format&fit=crop',
    'Tiefling': 'https://images.unsplash.com/photo-1634918737676-e8d12cc49942?q=80&w=1000&auto=format&fit=crop',
};

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