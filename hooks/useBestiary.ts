import { useState, useEffect, useMemo } from 'react';
import { APIMonsterIndex, Monster } from '../types';
import { fetchMonsterList, fetchMonsterDetails } from '../services/dndApi';

export const useBestiary = (preLoadedList: APIMonsterIndex[] = []) => {
    const [monsterList, setMonsterList] = useState<APIMonsterIndex[]>(preLoadedList);
    const [search, setSearch] = useState('');
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        if (monsterList.length === 0) {
            fetchMonsterList().then(data => setMonsterList(data));
        }
    }, [monsterList.length]);

    // Atualiza se preLoadedList mudar (caso venha do App)
    useEffect(() => {
        if (preLoadedList.length > 0 && preLoadedList !== monsterList) {
            setMonsterList(preLoadedList);
        }
    }, [preLoadedList]);

    const handleSelect = async (index: string) => {
        setIsLoadingDetails(true);
        const details = await fetchMonsterDetails(index);
        setSelectedMonster(details);
        setIsLoadingDetails(false);
    };

    const clearSelection = () => setSelectedMonster(null);

    const filteredList = useMemo(() => {
        const term = search.toLowerCase();
        if (!term) return monsterList.slice(0, 50);
        return monsterList.filter(m => m.name.toLowerCase().includes(term)).slice(0, 50);
    }, [search, monsterList]);

    return {
        monsterList,
        filteredList,
        search,
        setSearch,
        selectedMonster,
        handleSelect,
        clearSelection,
        isLoadingDetails
    };
};