import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getTablesForDataBaseID} from "../services/api";
import {Notification} from "../publicComponents/layout/modal/Notification";
import {useDataBase} from "./DataBaseContext";


interface TableContextType {
    tables: TableData[];
    setTables: React.Dispatch<React.SetStateAction<TableData[]>>;
    selectedTable: TableData | null;
    setSelectedTable: (table: TableData | null) => void;
    loading: boolean;
    errorMessage: string | null;
    fetchTables: () => void;
}

// Context 생성
const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const {selectedDataBase} = useDataBase();
    const [tables, setTables] = useState<TableData[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDataBase) {
            setSelectedTable(null); // selectedDataBase가 변경될 때만 초기화
            fetchTables();
        }
    }, [selectedDataBase]);

    const fetchTables = async () => {
        if (!selectedDataBase) return;
        try {
            setLoading(true);
            const data = await getTablesForDataBaseID(selectedDataBase.id!);
            setTables(data);
            // console.log('테이블 리스트', data);
        } catch (error) {
            setErrorMessage('테이블 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TableContext.Provider
                value={{
                    tables,
                    setTables,
                    selectedTable,
                    setSelectedTable,
                    loading,
                    errorMessage,
                    fetchTables,
                }}
            >
                {children}
            </TableContext.Provider>
            {/* 오류 모달 */}
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>

    );
};

// Context를 사용하는 커스텀 훅
export const useTable = (): TableContextType => {
    const context = useContext(TableContext);
    if (context === undefined) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};