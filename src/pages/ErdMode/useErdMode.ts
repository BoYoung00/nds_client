import {useEffect, useState} from 'react';
import {useDataBase} from '../../contexts/DataBaseContext';
import {useTable} from '../../contexts/TableContext';

export const useErdMode = () => {
    const { databases, setSelectedDataBase, selectedDataBase } = useDataBase();
    const { selectedTable } = useTable();

    const [isVisible, setIsVisible] = useState(false);
    const [selectedRemoteIndex, setSelectedRemoteIndex] = useState<number>(-1);
    const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState<number>(selectedDataBase ? databases.findIndex(db => db.id === selectedDataBase?.id!) : 0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const databaseNames = databases.map(db => db.name).concat(databases.length < 4 ? [''] : []);

    useEffect(() => {
        if (databases.length > 0) {
            setSelectedDataBase(databases[selectedDatabaseIndex]);
        }
    }, [databases, selectedDatabaseIndex, setSelectedDataBase]);

    useEffect(() => {
        setIsVisible(Boolean(selectedTable && selectedRemoteIndex > -1));
    }, [selectedTable, selectedRemoteIndex]);

    useEffect(() => {
        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = originalOverflow;
        };
    }, []);

    const handelSelectedRemoteItem = (index: number) => {
        if (selectedRemoteIndex === index)
            setSelectedRemoteIndex(-1);
        else
            setSelectedRemoteIndex(index)
    }

    return {
        databaseNames,
        selectedTable,
        isVisible,
        selectedRemoteIndex,
        handelSelectedRemoteItem,
        setSelectedDatabaseIndex,
        errorMessage,
        setErrorMessage,
    };
};
