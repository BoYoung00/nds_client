import {useEffect, useState} from 'react';
import {getTablesForDataBaseID} from "../../../services/api";

export const useDataBaseWhiteSidebar = (setSelectedTable: (table: TableData | null) => void, parentsDataBase: DataBaseEntity | null) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [tables, setTables] = useState<TableData[]>([]);
    const [selectedId, setSelectedId] = useState<number>(-1);

    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSelected = (table: TableData) => {
        setSelectedId(table.id!!);
        setSelectedTable(table);
    }

    const handleQuery = () => {
        if (selectedId === -1) {
            setErrorMessage("선택한 테이블이 없습니다.");
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

    // 테이블 리스트 통신
    const fetchTables = async (databaseID: number) => {
        try {
            setLoading(true);
            const data = await getTablesForDataBaseID(databaseID);
            console.log("테이블 리스트",data)
            setTables(data);
        } catch (error) {
            setErrorMessage('테이블 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (parentsDataBase)
            fetchTables(parentsDataBase.id!)
    }, [parentsDataBase]);

    useEffect(() => {
        if (selectedId !== -1) {
            const selectedTable = tables.find(table => table.id === selectedId) || null;
            setSelectedTable(selectedTable);
        }
    }, [selectedId, tables, setSelectedTable]);

    return {
        tables,
        setTables,
        selectedId,
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        errorMessage,
        setErrorMessage,
        onSelected,
        handleQuery,
        handleDelete
    };
};
