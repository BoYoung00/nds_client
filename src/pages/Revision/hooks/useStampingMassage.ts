import { useState } from 'react';
import { revisionDataFirstCommit } from '../../../services/api';
import { useDataBase } from '../../../contexts/DataBaseContext';

export const useStampingMassage = (isStampingPossible: boolean) => {
    const { selectedDataBase } = useDataBase();

    const [stampingMessage, setStampingMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStampingMessage(event.target.value);
    };

    const handleSave = async () => {
        if (!selectedDataBase) return;
        if (stampingMessage.trim() === '') {
            setErrorMessage('스태핑 메세지를 작성해주세요.');
            return;
        }
        if (!isStampingPossible) {
            console.log('isStampingPossible',isStampingPossible)
            setErrorMessage('변경 데이터가 없습니다.');
            return;
        }

        try {
            await revisionDataFirstCommit(selectedDataBase.id!, stampingMessage);
            setSuccessMessage('내역 저장에 성공하셨습니다.');
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return {
        stampingMessage,
        successMessage,
        errorMessage,
        handleChange,
        handleSave,
        setSuccessMessage,
        setErrorMessage,
    };
};
