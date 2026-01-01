import { Attributes } from "../../types";

interface LifeEvent {
    text: string;
    consequence: string;
}

const GENERIC_EVENTS: LifeEvent[] = [
    { text: "deixou sua casa em busca de um destino maior", consequence: "carrega apenas um medalhão antigo de sua família" },
    { text: "perdeu tudo em uma aposta de dados viciada", consequence: "não confia em ninguém que sorri demais" },
    { text: "sobreviveu a uma praga que assolou sua vila", consequence: "vê a vida como um presente frágil e temporário" },
];

const BACKGROUND_EVENTS: Record<string, LifeEvent[]> = {
    'Acólito': [
        { text: "descobriu um texto apócrifo na biblioteca do templo", consequence: "questiona a verdadeira natureza de sua divindade" },
        { text: "falhou em proteger uma relíquia sagrada", consequence: "busca redenção através do sacrifício" }
    ],
    'Criminoso': [
        { text: "roubou a pessoa errada na corte real", consequence: "tem uma recompensa alta por sua cabeça em três cidades" },
        { text: "foi traído por seu parceiro em um grande golpe", consequence: "nunca dorme sem uma adaga sob o travesseiro" }
    ],
    'Soldado': [
        { text: "liderou uma unidade suicida e foi o único sobrevivente", consequence: "ouve os gritos de seus companheiros em seus pesadelos" },
        { text: "recusou uma ordem imoral de um superior", consequence: "foi desonrado e exilado de sua terra natal" }
    ],
    'Sábio': [
        { text: "olhou tempo demais para o abismo astral", consequence: "às vezes sussurra em línguas mortas sem perceber" },
        { text: "encontrou um mapa para uma civilização perdida", consequence: "está obcecado em encontrar a entrada secreta" }
    ],
    'Nobre': [
        { text: "foi deserdado após um escândalo amoroso", consequence: "ainda age com a arrogância de seu antigo título" },
        { text: "sua família foi assassinada por rivais políticos", consequence: "guarda um anel de sinete como prova de sua linhagem" }
    ]
};

const SECRETS = [
    "é secretamente herdeiro de um reino caído",
    "fez um pacto com uma entidade que não compreende totalmente",
    "matou alguém por acidente e fugiu da cena do crime",
    "carrega uma marca amaldiçoada que cresce a cada lua cheia",
    "está morrendo de uma doença mágica lenta e incurável",
    "sabe a localização de um portal para o inferno"
];

const getAttributeTrait = (attrs: Attributes): string => {
    if (attrs.Força >= 15) return "Sua presença física é intimidante, com músculos forjados pelo esforço.";
    if (attrs.Destreza >= 15) return "Move-se com uma graça sobrenatural, quase sem fazer som.";
    if (attrs.Constituição >= 15) return "Possui uma resistência lendária, raramente ficando doente ou cansado.";
    if (attrs.Inteligência >= 15) return "Seu olhar é analítico, dissecando cada situação antes de agir.";
    if (attrs.Sabedoria >= 15) return "Fala pouco, mas suas palavras carregam o peso de velhas verdades.";
    if (attrs.Carisma >= 15) return "Tem um magnetismo natural que atrai olhares assim que entra em uma sala.";
    
    if (attrs.Força <= 8) return "De compleição franzina, depende mais de astúcia do que de força bruta.";
    if (attrs.Carisma <= 8) return "Sua presença é esquecível ou desconfortável para os outros.";
    
    return "De aparência comum, esconde seus verdadeiros talentos sob um manto de mediocridade.";
};

export const generateDeepBackstory = (background: string, dndClass: string, race: string, attributes: Attributes): string => {
    // 1. Selecionar Evento de Vida (Life Path)
    const events = BACKGROUND_EVENTS[background] || GENERIC_EVENTS;
    const event = events[Math.floor(Math.random() * events.length)];
    
    // 2. Selecionar Segredo
    const secret = SECRETS[Math.floor(Math.random() * SECRETS.length)];
    
    // 3. Traço de Atributo
    const trait = getAttributeTrait(attributes);

    // 4. Montagem da Narrativa
    return `Nascido como ${race}, seu destino mudou quando ${event.text}. Por consequência, hoje ele ${event.consequence}. ${trait} Embora viaje como um ${dndClass}, ele guarda a sete chaves o segredo de que ${secret}.`;
};