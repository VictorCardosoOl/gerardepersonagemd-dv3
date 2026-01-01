import { Monster, APIMonsterIndex } from "../types";

export const MONSTERS_BR: Monster[] = [
    {
        index: "br-goblin",
        name: "Goblin",
        size: "Pequeno",
        type: "Humanoide (Goblinoide)",
        alignment: "Neutro e Mau",
        armor_class_value: 15,
        armor_class_desc: "Armadura de Couro, Escudo",
        hit_points: 7,
        hit_dice: "2d6",
        speed: { walk: "9m" },
        strength: 8,
        dexterity: 14,
        constitution: 10,
        intelligence: 10,
        wisdom: 8,
        charisma: 8,
        proficiencies: [],
        damage_vulnerabilities: [],
        damage_resistances: [],
        damage_immunities: [],
        condition_immunities: [],
        senses: { "Visão no Escuro": "18m", "Percepção Passiva": 9 },
        languages: "Comum, Goblin",
        challenge_rating: 0.25,
        xp: 50,
        special_abilities: [
            {
                name: "Escapar com Agilidade",
                desc: "O goblin pode realizar a ação de Desengajar ou Esconder-se como uma ação bônus em cada um de seus turnos."
            }
        ],
        actions: [
            {
                name: "Cimitarra",
                desc: "Ataque Corpo-a-Corpo com Arma: +4 para atingir, alcance 1,5 m, um alvo. Dano: 5 (1d6 + 2) de dano cortante.",
                attack_bonus: 4
            },
            {
                name: "Arco Curto",
                desc: "Ataque à Distância com Arma: +4 para atingir, alcance 24/96 m, um alvo. Dano: 5 (1d6 + 2) de dano perfurante.",
                attack_bonus: 4
            }
        ]
    },
    {
        index: "br-dragao-vermelho-jovem",
        name: "Dragão Vermelho Jovem",
        size: "Grande",
        type: "Dragão",
        alignment: "Caótico e Mau",
        armor_class_value: 18,
        armor_class_desc: "Armadura Natural",
        hit_points: 178,
        hit_dice: "17d10 + 85",
        speed: { walk: "12m", fly: "24m", climb: "12m" },
        strength: 23,
        dexterity: 10,
        constitution: 21,
        intelligence: 14,
        wisdom: 11,
        charisma: 19,
        proficiencies: [],
        damage_vulnerabilities: [],
        damage_resistances: [],
        damage_immunities: ["Fogo"],
        condition_immunities: [],
        senses: { "Visão às Cegas": "9m", "Visão no Escuro": "36m", "Percepção Passiva": 18 },
        languages: "Comum, Dracônico",
        challenge_rating: 10,
        xp: 5900,
        actions: [
            {
                name: "Ataques Múltiplos",
                desc: "O dragão faz três ataques: um com sua mordida e dois com suas garras."
            },
            {
                name: "Mordida",
                desc: "Ataque Corpo-a-Corpo: +10 para atingir, alcance 3 m, um alvo. Dano: 17 (2d10 + 6) perfurante mais 3 (1d6) de fogo.",
                attack_bonus: 10
            },
            {
                name: "Sopro de Fogo (Recarga 5–6)",
                desc: "O dragão exala fogo em um cone de 9 metros. Cada criatura na área deve fazer um teste de resistência de Destreza CD 17, sofrendo 56 (16d6) de dano de fogo se falhar, ou metade se tiver sucesso."
            }
        ]
    },
    {
        index: "br-esqueleto",
        name: "Esqueleto",
        size: "Médio",
        type: "Morto-vivo",
        alignment: "Leal e Mau",
        armor_class_value: 13,
        armor_class_desc: "Restos de Armadura",
        hit_points: 13,
        hit_dice: "2d8 + 4",
        speed: { walk: "9m" },
        strength: 10,
        dexterity: 14,
        constitution: 15,
        intelligence: 6,
        wisdom: 8,
        charisma: 5,
        proficiencies: [],
        damage_vulnerabilities: ["Concussão"],
        damage_resistances: [],
        damage_immunities: ["Veneno"],
        condition_immunities: [{ name: "Exaustão" }, { name: "Envenenado" }],
        senses: { "Visão no Escuro": "18m", "Percepção Passiva": 9 },
        languages: "Compreende os idiomas que conhecia em vida, mas não pode falar",
        challenge_rating: 0.25,
        xp: 50,
        actions: [
            {
                name: "Espada Curta",
                desc: "Ataque Corpo-a-Corpo com Arma: +4 para atingir, alcance 1,5 m, um alvo. Dano: 5 (1d6 + 2) de dano perfurante.",
                attack_bonus: 4
            },
            {
                name: "Arco Curto",
                desc: "Ataque à Distância com Arma: +4 para atingir, alcance 24/96 m, um alvo. Dano: 5 (1d6 + 2) de dano perfurante.",
                attack_bonus: 4
            }
        ]
    },
    {
        index: "br-ogro",
        name: "Ogro",
        size: "Grande",
        type: "Gigante",
        alignment: "Caótico e Mau",
        armor_class_value: 11,
        armor_class_desc: "Corselete de Peles",
        hit_points: 59,
        hit_dice: "7d10 + 21",
        speed: { walk: "12m" },
        strength: 19,
        dexterity: 8,
        constitution: 16,
        intelligence: 5,
        wisdom: 7,
        charisma: 7,
        proficiencies: [],
        damage_vulnerabilities: [],
        damage_resistances: [],
        damage_immunities: [],
        condition_immunities: [],
        senses: { "Visão no Escuro": "18m", "Percepção Passiva": 8 },
        languages: "Comum, Gigante",
        challenge_rating: 2,
        xp: 450,
        actions: [
            {
                name: "Clava Grande",
                desc: "Ataque Corpo-a-Corpo com Arma: +6 para atingir, alcance 1,5 m, um alvo. Dano: 13 (2d8 + 4) de dano de concussão.",
                attack_bonus: 6
            },
            {
                name: "Azagaia",
                desc: "Ataque Corpo-a-Corpo ou à Distância com Arma: +6 para atingir, alcance 1,5 m ou distância 9/36 m, um alvo. Dano: 11 (2d6 + 4) de dano perfurante.",
                attack_bonus: 6
            }
        ]
    },
    {
        index: "br-mimico",
        name: "Mímico",
        size: "Médio",
        type: "Monstruosidade (Metamorfo)",
        alignment: "Neutro",
        armor_class_value: 12,
        armor_class_desc: "Armadura Natural",
        hit_points: 58,
        hit_dice: "9d8 + 18",
        speed: { walk: "4.5m" },
        strength: 17,
        dexterity: 12,
        constitution: 15,
        intelligence: 5,
        wisdom: 13,
        charisma: 8,
        proficiencies: [],
        damage_vulnerabilities: [],
        damage_resistances: ["Ácido"],
        damage_immunities: ["Ácido"],
        condition_immunities: [{ name: "Agarrado" }, { name: "Caído" }],
        senses: { "Visão no Escuro": "18m", "Percepção Passiva": 11 },
        languages: "-",
        challenge_rating: 2,
        xp: 450,
        special_abilities: [
            {
                name: "Metamorfo",
                desc: "O mímico pode usar sua ação para se metamorfosear em um objeto ou voltar à sua forma real (amorfa). Suas estatísticas são as mesmas em qualquer forma. Qualquer equipamento que ele esteja vestindo ou carregando não é transformado. Ele reverte à sua forma real se morrer."
            },
            {
                name: "Adesivo (Apenas na Forma de Objeto)",
                desc: "O mímico adere a qualquer coisa que o toque. Uma criatura Enorme ou menor aderida ao mímico está agarrada por ele (CD 13 para escapar). Testes de habilidade feitos para escapar desse agarrão têm desvantagem."
            },
            {
                name: "Aparência Falsa (Apenas na Forma de Objeto)",
                desc: "Enquanto o mímico permanecer imóvel, ele é indistinguível de um objeto comum."
            }
        ],
        actions: [
            {
                name: "Pseudópode",
                desc: "Ataque Corpo-a-Corpo com Arma: +5 para atingir, alcance 1,5 m, um alvo. Dano: 7 (1d8 + 3) de dano de concussão. Se o mímico estiver na forma de objeto, o alvo fica sujeito à característica Adesivo.",
                attack_bonus: 5
            },
            {
                name: "Mordida",
                desc: "Ataque Corpo-a-Corpo com Arma: +5 para atingir, alcance 1,5 m, um alvo. Dano: 7 (1d8 + 3) de dano perfurante mais 4 (1d8) de dano de ácido.",
                attack_bonus: 5
            }
        ]
    }
];

export const BR_MONSTER_INDEX: APIMonsterIndex[] = MONSTERS_BR.map(m => ({
    index: m.index,
    name: m.name,
    url: "local"
}));
