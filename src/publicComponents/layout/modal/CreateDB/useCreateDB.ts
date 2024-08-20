import React, {ChangeEvent, useEffect, useState} from 'react';
import {createDataBase, saveStructureToDatabase} from "../../../../services/api";
import {useDataBase} from "../../../../contexts/DataBaseContext";

export const useDatabaseForm = () => {
    const { setDatabases, fetchDatabases } = useDataBase();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [dataBaseData, setDataBaseData] = useState<DataBaseEntity>({
        id: null,
        name: '',
        comment: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDataBaseData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFetchCreateDB = async (file: File | null) => {
        try {
            if (file) {
                await saveStructureToDatabase(file);
                setSuccessMessage("데이터베이스 생성에 성공하셨습니다.");
                fetchDatabases();
            } else {
                const createdDataBase = await createDataBase(dataBaseData.name, dataBaseData.comment);
                // 생성된 DB id 업데이트
                await setDataBaseData(prevState => ({
                    ...prevState,
                    id: createdDataBase.id,
                }));
            }
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    useEffect(() => {
        if (dataBaseData.id !== null) {
            setDatabases(prevDatabases => [...prevDatabases, dataBaseData]);
            setSuccessMessage("데이터베이스 생성에 성공하셨습니다.");
        }
    }, [dataBaseData.id]);

    return {
        dataBaseData,
        handleChange,
        handleFetchCreateDB,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    };
};


// 파일 업로드 생성
export const useFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [convertedData, setConvertedData] = useState<FileDataBaseSet | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target?.result as string;
                const data = convertFileToDataType(fileContent);
                setConvertedData(data);
                // console.log(data);
            };
            reader.readAsText(file);
        }
    };

    const convertFileToDataType = (fileContent: string): FileDataBaseSet => {
        const lines = fileContent.split('\n');
        const database: FileDataBaseSet = {
            name: '',
            comment: '',
            tableList: [],
        };
        let currentTable: FileTableSet | null = null;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('/')) {
                line = line.substring(1).trim();
            }

            if (line.startsWith('DataBase')) {
                const parts = line.split(' / ');
                database.name = parts[1]?.trim().replace(/\/$/, '') || '';
                database.comment = parts[2]?.trim() || '';
            } else if (line.startsWith('table')) {
                const parts = line.split(' / ');
                currentTable = {
                    name: parts[1]?.trim().replace(/\/$/, '') || '',
                    comment: parts[2]?.trim() || '',
                    tableHash: parts[3]?.trim() || '',
                    columnList: [],
                };
                database.tableList.push(currentTable);
            } else if (line.startsWith('column')) {
                const parts = line.split(' / ');
                const column: FileColumnSet = {
                    name: parts[1]?.trim() || '',
                    dataType: parts[2]?.trim() || '',
                    columnHash: parts[3]?.trim() || '',
                    isJoinTableHash: parts[4]?.trim() === 'NULL' ? null : parts[4]?.trim(),
                    isPkActive: parts[5]?.trim() === 'true',
                    isFkActive: parts[6]?.trim() === 'true',
                    isUkActive: parts[7]?.trim() === 'true',
                    isNotNullActive: parts[8]?.trim() === 'true',
                };
                currentTable?.columnList.push(column);
            }
        });

        return database;
    };

    return {
        selectedFile,
        handleFileChange,
        convertedData,
    };
};