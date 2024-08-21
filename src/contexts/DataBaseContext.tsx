import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {getDataBasesForCurrentUser, getTablesForDataBaseID} from "../services/api";
import {Notification} from "../publicComponents/layout/modal/Notification";


interface DataBaseContextType {
    databases: DataBaseEntity[];
    setDatabases: React.Dispatch<React.SetStateAction<DataBaseEntity[]>>;
    selectedDataBase: DataBaseEntity | null;
    setSelectedDataBase: (db: DataBaseEntity | null) => void;
    tables: TableData[];
    setTables: React.Dispatch<React.SetStateAction<TableData[]>>;
    selectedTable: TableData | null;
    setSelectedTable: (table: TableData | null) => void;
    loading: boolean;
    errorMessage: string | null;
    fetchTables: () => void;
    fetchDatabases: () => void;
}

// Context 생성
const DataBaseContext = createContext<DataBaseContextType | undefined>(undefined);

export const DataBaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
    const [tables, setTables] = useState<TableData[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchDatabases = async () => {
        try {
            setLoading(true);
            const data = await getDataBasesForCurrentUser();
            setDatabases(data);
        } catch (error) {
            setErrorMessage('데이터베이스를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchDatabases();
    }, []);

    useEffect(() => {
        fetchTables();
    }, [selectedDataBase]);

    return (
        <>
            <DataBaseContext.Provider
                value={{
                    selectedDataBase,
                    setSelectedDataBase,
                    tables,
                    setTables,
                    selectedTable,
                    setSelectedTable,
                    loading,
                    errorMessage,
                    fetchTables,
                    databases,
                    setDatabases,
                    fetchDatabases
                }}
            >
                {children}
            </DataBaseContext.Provider>
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
export const useDataBase = (): DataBaseContextType => {
    const context = useContext(DataBaseContext);
    if (context === undefined) {
        throw new Error('useDataBase must be used within a DataBaseProvider');
    }
    return context;
};