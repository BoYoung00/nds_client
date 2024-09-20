import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getDataBasesForCurrentUser} from "../services/api";
import {Notification} from "../publicComponents/layout/modal/Notification";


interface DataBaseContextType {
    databases: DataBaseEntity[];
    setDatabases: React.Dispatch<React.SetStateAction<DataBaseEntity[]>>;
    selectedDataBase: DataBaseEntity | null;
    setSelectedDataBase: (db: DataBaseEntity | null) => void;
    loading: boolean;
    errorMessage: string | null;
    fetchDatabases: () => void;
}

// Context 생성
const DataBaseContext = createContext<DataBaseContextType | undefined>(undefined);

export const DataBaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchDatabases = async () => {
        const token = localStorage.getItem('token')
        if (!token) return;
        try {
            setLoading(true);
            const data = await getDataBasesForCurrentUser();
            // console.log('데이터베이스 리스트', data);
            setDatabases(data);
        } catch (error) {
            setErrorMessage('데이터베이스를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatabases();
    }, []);

    return (
        <>
            <DataBaseContext.Provider
                value={{
                    selectedDataBase,
                    setSelectedDataBase,
                    loading,
                    errorMessage,
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