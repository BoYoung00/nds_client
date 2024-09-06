import { useEffect, useState, useCallback } from 'react';
import { useDataBase } from '../../contexts/DataBaseContext';
import { useTable } from '../../contexts/TableContext';

export const useErdMode = () => {
    const { databases, setSelectedDataBase } = useDataBase();
    const { selectedTable } = useTable();

    const [isVisible, setIsVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<number>(-1);
    const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const databaseNames = databases.map(db => db.name).concat(databases.length < 4 ? [''] : []);

    useEffect(() => {
        if (databases.length > 0) {
            setSelectedDataBase(databases[selectedDatabaseIndex]);
        }
    }, [databases, selectedDatabaseIndex, setSelectedDataBase]);

    useEffect(() => {
        setIsVisible(Boolean(selectedTable && selectedTab > -1));
    }, [selectedTable, selectedTab]);

    useEffect(() => {
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = originalOverflow;
        };
    }, []);

    return {
        databaseNames,
        selectedTable,
        isVisible,
        selectedTab,
        setSelectedTab,
        setSelectedDatabaseIndex,
        errorMessage,
        setErrorMessage,
    };
};
