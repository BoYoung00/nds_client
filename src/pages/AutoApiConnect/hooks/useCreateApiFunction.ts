import React, { useEffect, useState } from "react";
import { generateAPIConnCode, getTablesForDataBaseID, saveAPICode } from "../../../services/api";
import { useDataBase } from "../../../contexts/DataBaseContext";

export const useApiFunction = (setApiData: React.Dispatch<React.SetStateAction<ApiConnInfoResponse[]>>) => {
    const { databases } = useDataBase();

    const [loading, setLoading] = useState<boolean>(false);
    const [tables, setTables] = useState<TableData[]>([]);
    const [code, setCode] = useState<string>('');
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<number>(databases[0]?.id!);
    const [selectedTableHash, setSelectedTableHash] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>("JAVA");
    const [functionName, setFunctionName] = useState<string>('');
    const [functionDescription, setFunctionDescription] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 테이블 가져오기
    const fetchTables = async () => {
        if (!selectedDatabaseId) return;
        try {
            setLoading(true);
            const data = await getTablesForDataBaseID(selectedDatabaseId);
            setTables(data);
            if (data.length > 0) {
                setSelectedTableHash(data[0].tableHash);
            }
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        } finally {
            setLoading(false);
        }
    };

    // API 코드 생성
    const fetchApiConnectCode = async () => {
        if (!selectedTableHash) {
            setErrorMessage('테이블을 선택해주세요.');
            return;
        }

        const apiConnCodeRequest: ApiConnCodeRequest = {
            dataBaseId: selectedDatabaseId,
            tableHash: selectedTableHash,
            title: functionName,
            description: functionDescription,
            programmingLanguage: selectedLanguage,
        };
        try {
            const response: ApiConnCodeResponse = await generateAPIConnCode(apiConnCodeRequest);
            setCode(response.createCode);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // 함수 저장
    const fetchApiConnectCodeSave = async () => {
        if (!selectedTableHash) {
            setErrorMessage('테이블을 선택해주세요.');
            return;
        }
        const apiConnCodeRequest: ApiConnInfoRequest = {
            databaseID: selectedDatabaseId,
            tableHash: selectedTableHash,
            functionTitle: functionName,
            functionDescription: functionDescription,
            programmingLanguage: selectedLanguage,
        };
        try {
            const response: ApiConnInfoResponse = await saveAPICode(apiConnCodeRequest);
            setSuccessMessage('API 함수 저장에 성공하셨습니다.');
            setApiData((prev) => [...prev, response]);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    useEffect(() => {
        setSelectedDatabaseId(databases[0]?.id!);
    }, [databases]);

    useEffect(() => {
        fetchTables();
    }, [selectedDatabaseId]);

    return {
        hooks: {
            tables,
            code,
            selectedDatabaseId,
            selectedTableHash,
            selectedLanguage,
            functionName,
            functionDescription,
            successMessage,
            errorMessage,
            setSelectedDatabaseId,
            setSelectedTableHash,
            setSelectedLanguage,
            setFunctionName,
            setFunctionDescription,
            setSuccessMessage,
            setErrorMessage,
        },
        handles: {
            fetchApiConnectCode,
            fetchApiConnectCodeSave,
        }
    };
};
