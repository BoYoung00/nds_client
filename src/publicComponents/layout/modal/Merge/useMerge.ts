import {ChangeEvent, useState} from 'react';
import {useTable} from "../../../../contexts/TableContext";
import {tableMergeConfirm, tableMergePreview, tableMergeSave} from "../../../../services/api";

interface TableInfo {
    name: string;
    comment: string;
}

interface UseMerge {
    tableInfo: TableInfo;
    selectedTables: TableData[];
    successMessage: string | null;
    setSuccessMessage: (message: string | null) => void;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCheckboxChange: (table: TableData) => void;
    handleFetchTableMergeConfirm: (isSaveDirect: boolean) => Promise<void>;
    handleFetchTableMergeSave: () => Promise<void>;
}

export const useMerge = (): UseMerge => {
    const { setTables } = useTable();
    const [tableInfo, setTableInfo] = useState<TableInfo>({
        name: '',
        comment: '',
    });
    const [selectedTables, setSelectedTables] = useState<TableData[]>([]); // 테이블 2개 선택
    const [isMergePossibility, setIsMergePossibility] = useState<boolean | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTableInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (table: TableData) => {
        setSelectedTables(prevSelectedTables => {
            if (prevSelectedTables.includes(table)) {
                // 이미 선택된 테이블이면 제거
                return prevSelectedTables.filter(t => t !== table);
            } else if (prevSelectedTables.length < 2) {
                // 선택된 테이블이 2개 미만이면 추가
                return [...prevSelectedTables, table];
            } else {
                // 3개째 선택 시, 가장 처음 선택된 테이블의 선택을 해제
                const [first, ...rest] = prevSelectedTables; // 첫번째 데이터: first, 그 뒤의 데이터: ...rest
                return [...rest, table];
            }
        });
    };

    // 병합 가능 여부 통신
    const handleFetchTableMergeConfirm = async (isSaveDirect: boolean) => {
        if (selectedTables.length !== 2) {
            setErrorMessage('두 개의 테이블을 선택해주세요.');
            return;
        }

        const tableMergeConfirmRequest: TableMergeConfirmRequest = {
            parentTableID: selectedTables[0].id,
            childTableID: selectedTables[1].id
        };

        try {
            const response: TableMergeConfirmResponse = await tableMergeConfirm(tableMergeConfirmRequest);
            if (response.tableConfirmResult) {
                setIsMergePossibility(true);

                if (!isSaveDirect) // 프리뷰 보기 버튼 눌렀을 시
                    await handleFetchTableMergePreview(tableMergeConfirmRequest);
            } else {
                setErrorMessage(
                    '병합을 진행하기 전에 다음 사항을 확인해 주세요:\n' +
                    '\n' +
                    '기본 키(PK) 중복: 기본 키 값이 중복되지 않는지 확인하세요.\n' +
                    '행 이름 중복: 행 이름이 중복되지 않도록 주의하세요.\n' +
                    `행 데이터 길이 불일치: 각 행의 데이터 길이가 일치 하는지 검토해 주세요.`)
            }
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 프리뷰 통신
    const handleFetchTableMergePreview = async (tableMergeConfirmRequest: TableMergeConfirmRequest) => {
        try {
            const response = await tableMergePreview(tableMergeConfirmRequest);
            const mergePreviewElement = document.getElementById('merge-preview');
            if (mergePreviewElement) mergePreviewElement.innerHTML = response;
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 병합 저장
    const handleFetchTableMergeSave = async () => {
        if (tableInfo.name === '') {
            setErrorMessage('테이블 이름을 작성해주세요.');
            return;
        }
        if (tableInfo.comment === '') {
            setErrorMessage('테이블 설명을 작성해주세요.');
            return;
        }
        if (isMergePossibility === null) // 프리뷰 안 보고 실행 시
            await handleFetchTableMergeConfirm(true);

        const tableMergeSaveRequest: TableMergeSaveRequest = {
            parentTableID: selectedTables[0].id,
            childTableID: selectedTables[1].id,
            newTableName: tableInfo.name,
            newTableComment: tableInfo.comment,
        };

        try {
            const response = await tableMergeSave(tableMergeSaveRequest);
            setTables((prevTables) => {
                const filteredTables = prevTables.filter(item =>
                    !selectedTables.some(selected => selected.id === item.id)
                );
                return [...filteredTables, response];
            });
            setSuccessMessage('병합에 성공하셨습니다.')
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return {
        tableInfo,
        selectedTables,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        handleChange,
        handleCheckboxChange,
        handleFetchTableMergeConfirm,
        handleFetchTableMergeSave,
    };
};