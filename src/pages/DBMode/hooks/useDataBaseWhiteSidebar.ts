import React, { useEffect, useState } from 'react';
import { useDataBase } from "../../../contexts/DataBaseContext";
import { useTable } from "../../../contexts/TableContext";
import { deleteTable, updateTableComment } from '../../../services/api';

export function useDataBaseWhiteSidebar() {
    const { selectedDataBase } = useDataBase();
    const { setSelectedTable, tables, setTables, selectedTable } = useTable();

    const [selectedId, setSelectedId] = useState<number>(-1);
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedTable) setSelectedId(selectedTable.id)
    }, [selectedTable]);

    const onSelected = (table: TableData) => {
        setSelectedId(table.id!!);
        setSelectedTable(table);
        setComment(table.comment || '');
    };

    const handleMerge = () => {
        if (!selectedDataBase) {
            setErrorMessage("데이터베이스를 선택해 주세요.");
        } else {
            setIsOpenMergeModal(true);
        }
    };

    const handleDelete = async () => {
        if (selectedTable === null) {
            setErrorMessage("선택한 테이블이 없습니다.");
        } else {
            setQuestionMessage(`${selectedTable.name} 테이블을 삭제 하시겠습니까?`);
        }
    };

    const FetchDelete = async () => {
        if (!selectedTable) return;

        try {
            const response = await deleteTable(selectedTable.id!);
            setTables(tables.filter(table => table !== selectedTable));
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
        if (selectedId !== -1) {
            const selectedTable = tables.find(table => table.id === selectedId) || null;
            setSelectedTable(selectedTable);
            setComment(selectedTable?.comment || '');
        }
    }, [selectedId, tables, setSelectedTable]);

    return {
        selectedId,
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        handleMerge,
        handleDelete,
        FetchDelete,
        comment,
        handleCommentChange,
        handleCommentBlur,
        questionMessage,
        setQuestionMessage,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        onSelected,
    };
}
