import { useState, useEffect } from 'react';
import { getAllDBMSInfo, getTablesForDataBaseID, importTableData, insertData } from '../../services/api';
import { useDataBase } from '../../contexts/DataBaseContext';

export const useDBMSConnect = () => {
    const { databases } = useDataBase();

    const [tables, setTables] = useState<TableData[]>([]);
    const [dbmsInfos, setDbmsInfos] = useState<DBMSInfoResponse[]>([]);
    const [selectedDbmsInfo, setSelectedDbmsInfo] = useState<DBMSInfoResponse>();
    const [isOpenCreateDBConnectModal, setIsOpenCreateDBConnectModal] = useState<boolean>(false);
    const [isItemInfoModalOpen, setIsItemInfoModalOpen] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isImportExportOpen, setIsImportExportOpen] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('Import');
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<number>(databases[0]?.id!);
    const [tableNameInputValue, setTableNameInputValue] = useState<string>('');
    const [selectedTableId, setSelectedTableId] = useState<number>(tables[0]?.id);

    const fetchDbmsInfos = async () => {
        try {
            const response = await getAllDBMSInfo();
            setDbmsInfos(response);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    const fetchTables = async () => {
        if (!selectedDatabaseId) return;
        try {
            const data = await getTablesForDataBaseID(selectedDatabaseId);
            setTables(data);
            if (data.length > 0) {
                setSelectedTableId(data[0].id);
            }
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // Export
    const fetchInsertData = async () => {
        if (!selectedDbmsInfo) return;
        try {
            const response = await insertData(selectedDbmsInfo.id, selectedTableId);
            setSuccessMessage(response)
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // Import
    const fetchImportTableData = async () => {
        if (!selectedDbmsInfo) return;
        try {
            const response = await importTableData(selectedDbmsInfo.id, selectedDatabaseId, tableNameInputValue);
            setSuccessMessage(response)
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    const handleRun = () => {
        if (selectedOption === "Import") {
            fetchImportTableData();
        } else {
            fetchInsertData();
        }
    };

    useEffect(() => {fetchDbmsInfos(); }, []);

    useEffect(() => { fetchTables(); }, [selectedDatabaseId]);

    useEffect(() => {
        if (databases.length > 0) {
            setSelectedDatabaseId(databases[0].id!);
        }
    }, [databases]);

    useEffect(() => {
        if (tables.length > 0) {
            setSelectedTableId(tables[0].id);
        }
    }, [tables]);

    return {
        hooks: {
            dbmsInfos,
            setDbmsInfos,
            selectedDbmsInfo,
            setSelectedDbmsInfo,
            isOpenCreateDBConnectModal,
            setIsOpenCreateDBConnectModal,
            isItemInfoModalOpen,
            setIsItemInfoModalOpen,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
            isImportExportOpen,
            setIsImportExportOpen,
            selectedOption,
            setSelectedOption,
            selectedDatabaseId,
            setSelectedDatabaseId,
            tableNameInputValue,
            setTableNameInputValue,
            selectedTableId,
            setSelectedTableId,
            databases,
            tables,
        },
        handles: {
            handleRun
        }
    };
};
