export interface Spell {
    id: string;
    name: string;
    level: number;
    school: 'Evocação' | 'Cura' | 'Necromancia' | 'Ilusão' | 'Encantamento' | 'Adivinhação' | 'Conjuracao' | 'Abjuracao' | 'Transmutacao';
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    desc: string;
    classes: string[];
}

export const SPELLS_BR: Spell[] = [
    {
        id: "luz",
        name: "Luz",
        level: 0,
        school: "Evocação",
        castingTime: "1 ação",
        range: "Toque",
        components: "V, M",
        duration: "1 hora",
        desc: "Você toca um objeto com não mais de 3 metros em qualquer dimensão. Até a magia acabar, o objeto emite luz plena num raio de 6 metros e luz penumbra por mais 6 metros adicionais.",
        classes: ["Bardo", "Clérigo", "Mago", "Feiticeiro"]
    },
    {
        id: "rajada-mistica",
        name: "Rajada Mística",
        level: 0,
        school: "Evocação",
        castingTime: "1 ação",
        range: "36 metros",
        components: "V, S",
        duration: "Instantânea",
        desc: "Um feixe de energia crepitante é disparado em direção a uma criatura ao alcance. Faça um ataque à distância com magia. Se atingir, o alvo sofre 1d10 de dano de energia.",
        classes: ["Bruxo"]
    },
    {
        id: "maos-magicas",
        name: "Mãos Mágicas",
        level: 0,
        school: "Conjuracao",
        castingTime: "1 ação",
        range: "9 metros",
        components: "V, S",
        duration: "1 minuto",
        desc: "Uma mão espectral flutuante aparece num ponto à sua escolha. Você pode usar sua ação para controlar a mão. Ela pode manipular objetos, abrir portas destrancadas ou guardar itens.",
        classes: ["Bardo", "Mago", "Feiticeiro", "Bruxo"]
    },
    {
        id: "estabilizar",
        name: "Estabilizar",
        level: 0,
        school: "Necromancia",
        castingTime: "1 ação",
        range: "Toque",
        components: "V, S",
        duration: "Instantânea",
        desc: "Você toca uma criatura viva que esteja com 0 pontos de vida. A criatura se torna estável. Essa magia não afeta mortos-vivos ou constructos.",
        classes: ["Clérigo", "Druida"]
    },
    {
        id: "missil-magico",
        name: "Míssil Mágico",
        level: 1,
        school: "Evocação",
        castingTime: "1 ação",
        range: "36 metros",
        components: "V, S",
        duration: "Instantânea",
        desc: "Você cria três dardos brilhantes de força mágica. Cada dardo atinge uma criatura de sua escolha que você possa ver. Cada dardo causa 1d4 + 1 de dano de energia. O acerto é garantido.",
        classes: ["Mago", "Feiticeiro"]
    },
    {
        id: "curar-ferimentos",
        name: "Curar Ferimentos",
        level: 1,
        school: "Evocação",
        castingTime: "1 ação",
        range: "Toque",
        components: "V, S",
        duration: "Instantânea",
        desc: "Uma criatura que você tocar recupera pontos de vida iguais a 1d8 + seu modificador de habilidade de conjuração. Não afeta mortos-vivos ou constructos.",
        classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro"]
    },
    {
        id: "escudo-arcano",
        name: "Escudo Arcano",
        level: 1,
        school: "Abjuracao",
        castingTime: "1 reação",
        range: "Pessoal",
        components: "V, S",
        duration: "1 rodada",
        desc: "Uma barreira invisível de força mágica aparece e protege você. Até o início do seu próximo turno, você tem +5 de bônus na CA, incluindo contra o ataque que desencadeou a magia.",
        classes: ["Mago", "Feiticeiro"]
    },
    {
        id: "detectar-magia",
        name: "Detectar Magia",
        level: 1,
        school: "Adivinhação",
        castingTime: "1 ação",
        range: "Pessoal",
        components: "V, S",
        duration: "Conc. até 10 min",
        desc: "Pela duração, você sente a presença de magia a até 9 metros de você. Se sentir magia dessa forma, você pode usar sua ação para ver uma aura fraca em redor de qualquer criatura ou objeto visível.",
        classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Patrulheiro", "Feiticeiro", "Mago"]
    }
];
