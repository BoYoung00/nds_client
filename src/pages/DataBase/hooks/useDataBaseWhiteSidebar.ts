import {useEffect, useState} from 'react';

export const useDataBaseWhiteSidebar = (tables: TableData[], setSelectedTable: (table: TableData | null) => void, parentsDataBase: DataBaseEntity | null) => {
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

    const onSelected = (table: TableData) => {
        setSelectedId(table.id!!);
        setSelectedTable(table);
    }

    const handleQuery = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            setIsOpenMergeModal(true);
        }
    }

    const handleDelete = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            console.log('삭제 로직');
        }
    }

    useEffect(() => {
        console.log(parentsDataBase);
    }, [parentsDataBase]);

    useEffect(() => {
        if (selectedId !== -1) {
            const selectedTable = tables.find(table => table.id === selectedId) || null;
            setSelectedTable(selectedTable);
        }
    }, [selectedId, tables, setSelectedTable]);

    return {
        selectedId,
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        isErrorOpen,
        setIsErrorOpen,
        onSelected,
        handleQuery,
        handleDelete
    };
};
