import { useState } from 'react';
import { useTable } from '../../../contexts/TableContext';
import { deleteTable } from '../../../services/api';

export const useRemoteControl = () => {
    const { tables, setTables, selectedTable, setSelectedTable } = useTable();
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDelete = () => {
        if (selectedTable === null) {
            setErrorMessage("엔티티를 선택해주세요.");
        } else {
            setQuestionMessage(`${selectedTable.name} 엔티티를 삭제 하시겠습니까?`);
        }
    };

    const fetchDelete = async () => {
        if (!selectedTable) return;

        try {
            const response = await deleteTable(selectedTable.id!);
            await setTables(tables.filter(table => table !== selectedTable));
            setSelectedTable(null);
            setSuccessMessage(response.message);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return {
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        questionMessage,
        setQuestionMessage,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        handleDelete,
        fetchDelete,
    };
};
