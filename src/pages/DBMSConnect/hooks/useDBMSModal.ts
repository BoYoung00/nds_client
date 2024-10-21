import React, { useEffect, useState } from "react";
import { createDBMSInfo, deleteDBMSInfo, testDbmsConnection, updateDBMSInfo } from "../../../services/api";

export const useDBMSModal = (selectedDbmsInfo?: DBMSInfoResponse, setDbmsInfos?: React.Dispatch<React.SetStateAction<DBMSInfoResponse[]>>) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [successConnect, setSuccessConnect] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const [connType, setConnType] = useState<string>('JDBC');
    const [DBMSType, setDBMSType] = useState<string>('MySQL');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [databaseName, setDatabaseName] = useState<string>('');

    const handleConnTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnType(e.target.value);
    };

    const handleDBMSTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDBMSType(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleDatabaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatabaseName(e.target.value);
    };

    // DBMS 정보 수정 및 업데이트
    const fetchSaveAndUpdateDBMS = async (isSave: boolean = true) => {
        const dbmsInfo: DBMSDtoRequest = {
            description,
            name,
            connType,
            dbmsType: DBMSType,
            url,
            databaseName,
            password,
            username,
        };

        try {
            if (isSave) {
                const response = await createDBMSInfo(dbmsInfo);
                if (setDbmsInfos) setDbmsInfos(response);
                setSuccessMessage('연결 정보 저장에 성공하셨습니다.');
            } else {
                if (!selectedDbmsInfo) return;
                await updateDBMSInfo(selectedDbmsInfo.id, dbmsInfo);
                setSuccessMessage('연결 정보 수정에 성공하셨습니다.');
            }
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // DBMS 연결 테스트
    const fetchTestDbmsConnection = async () => {
        setSuccessConnect(false);
        setLoading(true);

        const dbmsInfo: DBMSDtoRequest = {
            description,
            name,
            connType,
            dbmsType: DBMSType,
            url,
            databaseName,
            password,
            username,
        };

        try {
            const response = await testDbmsConnection(dbmsInfo);
            if (response.success) {
                setSuccessConnect(true);
            } else {
                setErrorMessage(response.message);
            }
            setLoading(false);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // 삭제 로직
    const fetchDeleteDBMS = async (id: number) => {
        try {
            await deleteDBMSInfo(id);
            setSuccessMessage('삭제에 성공하셨습니다.');
            if (setDbmsInfos)
                setDbmsInfos((prev) => prev.filter(info => info.id !== id));
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        if (selectedDbmsInfo) {
            setConnType(selectedDbmsInfo.connType || 'JDBC');
            setDBMSType(selectedDbmsInfo.dbmsType || 'MySQL');
            setName(selectedDbmsInfo.name || '');
            setDescription(selectedDbmsInfo.description || '');
            setUrl(selectedDbmsInfo.url || '');
            setUsername(selectedDbmsInfo.username || '');
            setPassword(selectedDbmsInfo.password || '');
            setDatabaseName(selectedDbmsInfo.databaseName || '');
            setLoading(false);
            setSuccessConnect(false);
        }
    }, [selectedDbmsInfo]);

    return {
        hooks: {
            loading,
            successConnect,
            successMessage,
            errorMessage,
            questionMessage,
            connType,
            DBMSType,
            name,
            description,
            url,
            username,
            password,
            databaseName,

            setSuccessMessage,
            setErrorMessage,
            setQuestionMessage,
        },
        handles: {
            fetchSaveAndUpdateDBMS,
            fetchTestDbmsConnection,
            fetchDeleteDBMS,
            handleConnTypeChange,
            handleDBMSTypeChange,
            handleNameChange,
            handleUsernameChange,
            handleDescriptionChange,
            handleDatabaseNameChange,
            handleUrlChange,
            handlePasswordChange,
        }
    };
};
