import { RULES_DATA } from '../data/rules';
import { DndClass, DndRace } from '../types';

export const RulesRepository = {
    getRaces: (): DndRace[] => {
        return RULES_DATA.races as DndRace[];
    },

    getClasses: (): DndClass[] => {
        return RULES_DATA.classes as DndClass[];
    },

    getBackgrounds: (): string[] => {
        return RULES_DATA.backgrounds;
    },

    getAlignments: (): string[] => {
        return RULES_DATA.alignments;
    },

    getRaceByName: (name: string): DndRace | undefined => {
        return (RULES_DATA.races as DndRace[]).find(r => r.name === name);
    },

    getClassByName: (name: string): DndClass | undefined => {
        return (RULES_DATA.classes as DndClass[]).find(c => c.name === name);
    }
};