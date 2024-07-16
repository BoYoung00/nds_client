import React, {ChangeEvent, useState} from 'react';

interface UseDatabaseForm {
    dataBaseData: DataBaseEntity;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 통신 훅 (Form)
export const useDatabaseForm = (): UseDatabaseForm => {
    const [dataBaseData, setDataBaseData] = useState<DataBaseEntity>({
        id: 0,
        name: '',
        comment: '',
        currentUserToken: '',
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

        console.log(dataBaseData)
    };

    return {
        dataBaseData,
        handleChange,
        handleSubmit
    };
};


interface UseFileUpload {
    selectedFile: File | null;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// 파일 업로드 훅
export const useFileUpload = (): UseFileUpload => {
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