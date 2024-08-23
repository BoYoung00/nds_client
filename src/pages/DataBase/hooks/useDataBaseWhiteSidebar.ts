import React, {useEffect, useState} from 'react';
import {useDataBase} from "../../../contexts/DataBaseContext";
import {useTable} from "../../../contexts/TableContext";

export function useDataBaseWhiteSidebar(
    tables: TableData[],
) {
    const { selectedDataBase } = useDataBase();
    const { setSelectedTable } = useTable();

    const [selectedId, setSelectedId] = useState<number>(-1);

    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSelected = (table: TableData) => {
        setSelectedId(table.id!!);
        setSelectedTable(table);
    }

    const handleMerge = () => {
        if (!selectedDataBase) {
            setErrorMessage('선택된 데이터베이스가 없습니다.');
        } else {
            setIsOpenMergeModal(true);
        }
    }

    const handleDelete = () => {
        if (selectedId === -1) {
            setErrorMessage("선택한 테이블이 없습니다.");
        } else {
            console.log('삭제 로직');
        }
    }

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
        errorMessage,
        setErrorMessage,
        onSelected,
        handleQuery: handleMerge,
        handleDelete
    };
}
