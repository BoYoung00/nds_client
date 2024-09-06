import {useEffect, useState} from 'react';
import {useDataBase} from "../../../contexts/DataBaseContext";
import {useTable} from "../../../contexts/TableContext";
import {deleteTable, updateTableComment} from '../../../services/api';

export function useDataBaseWhiteSidebar() {
    const { selectedDataBase } = useDataBase();
    const { tables, setTables, selectedTable, setSelectedTable } = useTable();

    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const onSelected = (table: TableData) => {
        setSelectedTable(table);
        setComment(table.comment || '');
    };

    const handleMerge = () => {
        if (!selectedDataBase) {
            setErrorMessage('데이터베이스를 선택해주세요.');
        } else {
            setIsOpenMergeModal(true);
        }
    };

    const handleDelete = async () => {
        if (selectedTable === null) {
            setErrorMessage("테이블을 선택해주세요.");
        } else {
            setQuestionMessage(`${selectedTable.name} 테이블을 삭제 하시겠습니까?`);
        }
    };

    const FetchDelete = async () => {
        if(!selectedTable) return;

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

    const handleCommentChange = (newComment: string) => {
        if (comment !== newComment)
            setComment(newComment);
    };

    // 설명 수정 통신
    const handleCommentBlur = async () => {
        if (selectedTable) {
            try {
                await updateTableComment(selectedTable.id, comment);
            } catch (error) {
                const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
                setErrorMessage(errorMessage);
            }
        }
    };

    useEffect(() => {
        setComment('');
        if (selectedTable) {
            setComment(selectedTable.comment);
        }
    }, [selectedTable, tables, setSelectedTable]);

    return {
        selectedTable,
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        errorMessage,
        setErrorMessage,
        onSelected,
        handleMerge,
        handleDelete,
        FetchDelete,
        comment,
        handleCommentChange,
        handleCommentBlur,
        questionMessage,
        setQuestionMessage,
        successMessage,
        setSuccessMessage
    };
}
