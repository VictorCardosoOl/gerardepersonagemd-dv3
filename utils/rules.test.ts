import { describe, it, expect } from 'vitest';
import { calculateAC, recalculateCharacterStats } from './rules';
import { Character, Item } from '../types';

// Mock helpers
const createItem = (type: Item['type'], props: Partial<Item> = {}): Item => ({
    id: 'test-item',
    name: 'Test Item',
    type,
    quantity: 1,
    ...props
});

describe('Regras D&D 5e - Classe de Armadura (CA)', () => {
    
    it('deve calcular CA sem armadura (10 + Des)', () => {
        const dexMod = 3; // 16 DEX
        const ac = calculateAC('Mago', dexMod, 2, 1, []);
        expect(ac).toBe(13); // 10 + 3
    });

    it('deve calcular CA com Armadura Leve (Base + Des)', () => {
        const leatherArmor = createItem('armor', { acBase: 11 });
        const dexMod = 4;
        const ac = calculateAC('Ladino', dexMod, 2, 1, [leatherArmor]);
        expect(ac).toBe(15); // 11 + 4
    });

    it('deve calcular CA com Armadura Média (Base + Des [max 2])', () => {
        const hideArmor = createItem('armor', { acBase: 12, dexBonusCap: 2 });
        
        // Caso 1: Des alta é capada
        expect(calculateAC('Clérigo', 4, 2, 1, [hideArmor])).toBe(14); // 12 + 2 (cap)
        
        // Caso 2: Des baixa é usada integralmente
        expect(calculateAC('Clérigo', 1, 2, 1, [hideArmor])).toBe(13); // 12 + 1
    });

    it('deve calcular CA com Armadura Pesada (Base apenas)', () => {
        const chainMail = createItem('armor', { acBase: 16, dexBonusCap: 0 });
        const ac = calculateAC('Guerreiro', 3, 2, 1, [chainMail]);
        expect(ac).toBe(16); // Ignora Des
    });

    it('deve somar bônus de Escudo', () => {
        const shield = createItem('shield', { acBonus: 2 });
        const leatherArmor = createItem('armor', { acBase: 11 });
        const dexMod = 2;
        
        const ac = calculateAC('Guerreiro', dexMod, 2, 1, [leatherArmor, shield]);
        expect(ac).toBe(15); // 11 (armor) + 2 (dex) + 2 (shield)
    });

    it('deve aplicar Defesa Sem Armadura do Bárbaro (10 + Des + Con)', () => {
        const dexMod = 2;
        const conMod = 4;
        const shield = createItem('shield', { acBonus: 2 });
        
        // Bárbaros podem usar escudo
        const ac = calculateAC('Bárbaro', dexMod, conMod, 1, [shield]);
        expect(ac).toBe(18); // 10 + 2 + 4 + 2
    });

    it('deve aplicar Defesa Sem Armadura do Monge (10 + Des + Sab)', () => {
        const dexMod = 4;
        const wisMod = 3;
        
        // Monge sem armadura e sem escudo
        const ac = calculateAC('Monge', dexMod, 2, wisMod, []);
        expect(ac).toBe(17); // 10 + 4 + 3
    });

    it('Monge perde bônus de Sabedoria se usar escudo', () => {
        const dexMod = 4;
        const wisMod = 3;
        const shield = createItem('shield', { acBonus: 2 });
        
        const ac = calculateAC('Monge', dexMod, 2, wisMod, [shield]);
        expect(ac).toBe(16); // 10 + 4 (Des) + 2 (Escudo). Sabedoria ignorada.
    });
});

describe('Regras D&D 5e - Pontos de Vida (HP)', () => {
    // Mock parcial de Character
    const mockChar = (cls: string, level: number, conScore: number, currentHp: number): Character => ({
        id: '1', name: 'Test', race: 'Humano', class: cls, level,
        attributes: { Constituição: conScore, Força: 10, Destreza: 10, Inteligência: 10, Sabedoria: 10, Carisma: 10 },
        modifiers: { Constituição: Math.floor((conScore - 10) / 2), Força: 0, Destreza: 0, Inteligência: 0, Sabedoria: 0, Carisma: 0 },
        hp: currentHp, maxHp: 0, equipment: [], skills: [],
        proficiencyBonus: 2, ac: 10, initiative: 0, passivePerception: 10,
        wealth: { cp:0, sp:0, ep:0, gp:0, pp:0 }, languages: [], senses: [],
        alignment: '', background: '', createdAt: 0
    });

    it('deve calcular HP máximo no Nível 1 (Dado de Vida + Con)', () => {
        // Bárbaro (d12) com Con 14 (+2)
        const char = mockChar('Bárbaro', 1, 14, 10);
        const updated = recalculateCharacterStats(char);
        
        expect(updated.maxHp).toBe(14); // 12 + 2
        expect(updated.hp).toBe(14); // Cura até o máximo se o atual for menor ou inconsistente
    });

    it('deve calcular HP máximo em Níveis > 1 (Média + Con por nível)', () => {
        // Clérigo (d8, média 5) com Con 12 (+1) no nível 3
        // Nível 1: 8 + 1 = 9
        // Nível 2: 5 + 1 = 6
        // Nível 3: 5 + 1 = 6
        // Total: 21
        const char = mockChar('Clérigo', 3, 12, 10);
        const updated = recalculateCharacterStats(char);
        
        expect(updated.maxHp).toBe(21);
    });

    it('não deve permitir HP Máximo menor que 1', () => {
        // Mago (d6) com Con 1 (-5) no nível 1
        // Cálculo: 6 - 5 = 1.
        const char = mockChar('Mago', 1, 1, 10);
        const updated = recalculateCharacterStats(char);
        expect(updated.maxHp).toBe(1); 
    });
});