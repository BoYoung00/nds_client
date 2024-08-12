import React, {ChangeEvent, useEffect, useState} from 'react';
import {createDataBase} from "../../../../services/api";
import {useDataBase} from "../../../../contexts/DataBaseContext";

export const useDatabaseForm = () => {
    const { setDatabases } = useDataBase();

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const createdDataBase = await createDataBase(dataBaseData.name, dataBaseData.comment);
            // 생성된 DB id 업데이트
            await setDataBaseData(prevState => ({
                ...prevState,
                id: createdDataBase.id,
            }));
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
        handleSubmit,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    };
};


// 파일 업로드 훅
export const useFileUpload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
        }
    };

    return {
        selectedFile,
        handleFileChange,
    };
};