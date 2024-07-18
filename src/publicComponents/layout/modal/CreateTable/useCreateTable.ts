import React, {ChangeEvent, useState} from 'react';

interface useCreateTable {
    dataBaseData: DataBaseEntity;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// 통신 훅 (Form)
export const useCreateTable = (): useCreateTable => {
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