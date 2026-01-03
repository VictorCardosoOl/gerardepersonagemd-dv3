
export const RULES_DATA = {
  "races": [
    { 
      "name": "Humano", 
      "speed": 9, 
      "bonuses": { "Força": 1, "Destreza": 1, "Constituição": 1, "Inteligência": 1, "Sabedoria": 1, "Carisma": 1 }, 
      "languages": ["Comum", "Um extra a escolha"], 
      "senses": [],
      "description": "Humanos são a mais adaptável e comum das raças comuns. Sua ambição e ímpeto de realizar algo levam-nos a abandonar suas terras natais e explorar o mundo.",
      "racialTraits": ["Versatilidade Humana (Todos atributos +1)", "Adaptação Rápida"]
    },
    { 
      "name": "Elfo", 
      "speed": 9, 
      "bonuses": { "Destreza": 2, "Inteligência": 1 }, 
      "languages": ["Comum", "Élfico"], 
      "senses": ["Visão no Escuro 18m", "Sentidos Aguçados"],
      "description": "Elfos são um povo mágico de graça sobrenatural, vivendo no mundo sem fazer parte inteiramente dele. Eles amam a natureza e a magia, a arte e a música.",
      "racialTraits": ["Ancestralidade Feérica", "Transe", "Sentidos Aguçados", "Treinamento Élfico"]
    },
    { 
      "name": "Anão", 
      "speed": 7.5, 
      "bonuses": { "Constituição": 2, "Força": 2 }, 
      "languages": ["Comum", "Anão"], 
      "senses": ["Visão no Escuro 18m", "Resiliência Anã"],
      "description": "Reinos ricos de grandeza antiga, salões escavados nas raízes das montanhas, o eco de picaretas e martelos em minas profundas e forjas ardentes.",
      "racialTraits": ["Resiliência Anã", "Treinamento em Combate Anão", "Conhecimento de Pedra", "Tenacidade"]
    },
    { 
      "name": "Halfling", 
      "speed": 7.5, 
      "bonuses": { "Destreza": 2, "Carisma": 1 }, 
      "languages": ["Comum", "Halfling"], 
      "senses": ["Sortudo", "Bravura"],
      "description": "O conforto de um lar é o objetivo da maioria dos halflings: um lugar para se estabelecer em paz e sossego, longe de monstros saqueadores.",
      "racialTraits": ["Sortudo", "Bravura", "Agilidade Halfling", "Furtividade Natural"]
    },
    { 
      "name": "Draconato", 
      "speed": 9, 
      "bonuses": { "Força": 2, "Carisma": 1 }, 
      "languages": ["Comum", "Dracônico"], 
      "senses": ["Resistência a Dano"],
      "description": "Nascidos de dragões, como seu nome proclama, os draconatos caminham orgulhosamente pelo mundo que os saúda com um temor incompreensível.",
      "racialTraits": ["Ancestralidade Dracônica", "Ataque de Sopro", "Resistência a Dano Elemental"]
    },
    { 
      "name": "Gnomo", 
      "speed": 7.5, 
      "bonuses": { "Inteligência": 2, "Constituição": 1 }, 
      "languages": ["Comum", "Gnômico"], 
      "senses": ["Visão no Escuro 18m", "Esperteza Gnômica"],
      "description": "Um zumbido constante de atividade permeia os lares onde os gnomos formam suas comunidades muito unidas. Eles vivem intensamente.",
      "racialTraits": ["Esperteza Gnômica", "Ilusionista Nato (Gnomo da Floresta)", "Engenhoqueiro (Gnomo das Rochas)"]
    },
    { 
      "name": "Meio-Orc", 
      "speed": 9, 
      "bonuses": { "Força": 2, "Constituição": 1 }, 
      "languages": ["Comum", "Orc"], 
      "senses": ["Visão no Escuro 18m", "Ameaçador", "Implacável"],
      "description": "Meio-orcs contam com força bruta e vigor para superar seus desafios. Muitos buscam uma vida de aventuras, onde sua força marcial é valorizada.",
      "racialTraits": ["Ameaçador", "Resistência Implacável", "Ataques Selvagens"]
    },
    { 
      "name": "Tiefling", 
      "speed": 9, 
      "bonuses": { "Carisma": 2, "Inteligência": 1 }, 
      "languages": ["Comum", "Infernal"], 
      "senses": ["Visão no Escuro 18m", "Resistência Infernal"],
      "description": "Ser recebido com olhares e sussurros, sofrer violência e insultos na rua, ver a desconfiança e o medo em cada olhar: esse é o fardo do tiefling.",
      "racialTraits": ["Legado Infernal", "Resistência Infernal (Fogo)", "Misticismo Obscuro"]
    }
  ],
  "classes": [
    { 
      "name": "Bárbaro", 
      "hitDie": 12, 
      "primaryAttributes": ["Força", "Constituição"], 
      "proficiencies": ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples", "Armas Marciais"],
      "skillChoices": ["Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência", "Adestrar Animais"],
      "numSkills": 2
    },
    { 
      "name": "Bardo", 
      "hitDie": 8, 
      "primaryAttributes": ["Carisma", "Destreza"], 
      "proficiencies": ["Armaduras Leves", "Armas Simples", "Bestas de Mão", "Espadas Longas"],
      "skillChoices": ["Atuação", "Persuasão", "Enganação", "Acrobacia", "Furtividade", "História", "Intuição"],
      "numSkills": 3
    },
    { 
      "name": "Clérigo", 
      "hitDie": 8, 
      "primaryAttributes": ["Sabedoria", "Constituição"], 
      "proficiencies": ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples"],
      "skillChoices": ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
      "numSkills": 2
    },
    { 
      "name": "Druida", 
      "hitDie": 8, 
      "primaryAttributes": ["Sabedoria", "Constituição"], 
      "proficiencies": ["Armaduras Leves", "Armaduras Médias", "Escudos", "Clavas", "Adagas"],
      "skillChoices": ["Arcanismo", "Adestrar Animais", "Intuição", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"],
      "numSkills": 2
    },
    { 
      "name": "Guerreiro", 
      "hitDie": 10, 
      "primaryAttributes": ["Força", "Constituição"], 
      "proficiencies": ["Todas as Armaduras", "Escudos", "Armas Simples", "Armas Marciais"],
      "skillChoices": ["Acrobacia", "Adestrar Animais", "Atletismo", "História", "Intuição", "Intimidação", "Percepção", "Sobrevivência"],
      "numSkills": 2
    },
    { 
      "name": "Monge", 
      "hitDie": 8, 
      "primaryAttributes": ["Destreza", "Sabedoria"], 
      "proficiencies": ["Armas Simples", "Espadas Curtas"],
      "skillChoices": ["Acrobacia", "Atletismo", "História", "Intuição", "Religião", "Furtividade"],
      "numSkills": 2
    },
    { 
      "name": "Paladino", 
      "hitDie": 10, 
      "primaryAttributes": ["Força", "Carisma"], 
      "proficiencies": ["Todas as Armaduras", "Escudos", "Armas Simples", "Armas Marciais"],
      "skillChoices": ["Atletismo", "Intuição", "Intimidação", "Medicina", "Persuasão", "Religião"],
      "numSkills": 2
    },
    { 
      "name": "Patrulheiro", 
      "hitDie": 10, 
      "primaryAttributes": ["Destreza", "Sabedoria"], 
      "proficiencies": ["Armaduras Leves", "Armaduras Médias", "Escudos", "Armas Simples", "Armas Marciais"],
      "skillChoices": ["Adestrar Animais", "Atletismo", "Furtividade", "Investigação", "Natureza", "Percepção", "Sobrevivência", "Intuição"],
      "numSkills": 3
    },
    { 
      "name": "Ladino", 
      "hitDie": 8, 
      "primaryAttributes": ["Destreza", "Inteligência"], 
      "proficiencies": ["Armaduras Leves", "Armas Simples", "Bestas de Mão", "Espadas Longas", "Rapieiras", "Espadas Curtas"],
      "skillChoices": ["Acrobacia", "Atletismo", "Enganação", "Furtividade", "Investigação", "Intimidação", "Percepção", "Prestidigitação", "Persuasão"],
      "numSkills": 4
    },
    { 
      "name": "Feiticeiro", 
      "hitDie": 6, 
      "primaryAttributes": ["Carisma", "Constituição"], 
      "proficiencies": ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas Leves"],
      "skillChoices": ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
      "numSkills": 2
    },
    { 
      "name": "Bruxo", 
      "hitDie": 8, 
      "primaryAttributes": ["Carisma", "Constituição"], 
      "proficiencies": ["Armaduras Leves", "Armas Simples"],
      "skillChoices": ["Arcanismo", "Enganação", "História", "Intimidação", "Investigação", "Natureza", "Religião"],
      "numSkills": 2
    },
    { 
      "name": "Mago", 
      "hitDie": 6, 
      "primaryAttributes": ["Inteligência", "Constituição"], 
      "proficiencies": ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas Leves"],
      "skillChoices": ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Religião"],
      "numSkills": 2
    }
  ],
  "backgrounds": [
    "Acólito", "Charlatão", "Criminoso", "Artista", "Herói do Povo", "Artesão da Guilda", 
    "Eremita", "Nobre", "Forasteiro", "Sábio", "Marinheiro", "Soldado", "Órfão",
    "Gladiador", "Cavaleiro", "Pirata", "Caçador de Recompensas", "Mercador de Clã",
    "Erudito Enclausurado", "Assombrado", "Veterano Mercenário", "Vigilante Urbano",
    "Herdeiro Disputado", "Arqueólogo", "Antropólogo"
  ],
  "alignments": [
    "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
    "Leal e Neutro", "Neutro", "Caótico e Neutro",
    "Leal e Mau", "Neutro e Mau", "Caótico e Mau"
  ]
};
