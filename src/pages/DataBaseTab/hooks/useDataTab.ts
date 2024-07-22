import { useState } from 'react';
import {findColumnInfo} from "../../../utils/utils";

export function useDataTab(initialTableStructure: TableInnerStructure | undefined) {
    const [tableStructure, setTableStructure] = useState<TableInnerStructure | undefined>(initialTableStructure);
    const [editingCell, setEditingCell] = useState<{ columnKey: string; rowIndex: number } | null>(null); // 더블 클릭한 key, index 값
    const [editedValue, setEditedValue] = useState<string>(''); // 더블 클릭한 value 값
    const [requestDataList, setRequestDataList] = useState<RequestData[]>([]); // 요청 데이터 (추가, 수정, 삭제)
    const [selectedRow, setSelectedRow] = useState<number | null>(null); // 행 선택

    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false); // 오류창
    const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false); // 알림창
    const [message, setMessage] = useState<string>(""); // 알림창 메세지

    // 새로고침 버튼 클릭
    const handleRefreshClick = () => {
        setMessage("새로고침을 하시겠습니까?");
        setIsQuestionOpen(true);
    };

    // 행 추가 버튼 클릭
    const handleAddData = () => {
        if (tableStructure) {
            const columns = Object.keys(tableStructure);
            const newData = columns.reduce((acc, columnKey) => {
                acc[columnKey] = [
                    ...(tableStructure[columnKey] || []),
                    { id: null, data: '', columnID: 0, createTime: '', lineHash: '', dataType: '' },
                ];
                return acc;
            }, {} as TableInnerStructure);

            setTableStructure(newData);
            setSelectedRow(Object.values(newData)[0].length - 1);
        }
    };

    // 행 삭제 버튼 클릭
    const handleDeleteData = () => {
        if (selectedRow !== null && tableStructure) {
            const updatedTableStructure = { ...tableStructure };
            const columns = Object.keys(tableStructure);
            columns.forEach(columnKey => {
                updatedTableStructure[columnKey] = tableStructure[columnKey].filter((_, index) => index !== selectedRow);
            });

            setTableStructure(updatedTableStructure);
            setRequestDataList(prevList => prevList.filter(data => data.columnLine !== selectedRow + 1));
            setSelectedRow(null);
        } else {
            setIsErrorOpen(true);
            setMessage("삭제할 행을 선택해 주세요.");
        }
    };

    // 셀 더블 클릭 시 수정 시작
    const handleCellDoubleClick = (columnKey: string, rowIndex: number, columnData: ColumnData) => {
        setEditingCell({ columnKey, rowIndex });
        setEditedValue(columnData.data);
    };

    // 셀 편집 중 입력값 변경
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedValue(event.target.value);
    };

    // 셀 편집 완료
    const handleInputBlur = () => {
        if (editingCell && tableStructure) {
            const { columnKey, rowIndex } = editingCell;
            const { columnID, columnHash, type } = findColumnInfo(columnKey);

            const updatedTableStructure = { ...tableStructure };
            const updatedCellData = [...(tableStructure[columnKey] || [])];
            updatedCellData[rowIndex] = { ...updatedCellData[rowIndex], data: editedValue };
            updatedTableStructure[columnKey] = updatedCellData;

            setTableStructure(updatedTableStructure);

            // 수정, 삭제, 추가 요청 값 만들기
            const newRequestData: RequestData = {
                id: updatedCellData[rowIndex].id ?? null,
                columnID,
                columnHash,
                data: editedValue,
                columnLine: rowIndex + 1,
                dataType: type,
            };
            setRequestDataList(prevList => [
                ...prevList.filter(data => data.id !== newRequestData.id),
                newRequestData
            ]);

            setEditingCell(null);
        }
    };

    return {
        hooks: {
            tableStructure,
            editingCell,
            editedValue,
            requestDataList,
            selectedRow,
            setTableStructure,
            setRequestDataList,
            setSelectedRow,
        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleCellDoubleClick,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick
        },
        modals: {
            isErrorOpen,
            setIsErrorOpen,
            isQuestionOpen,
            setIsQuestionOpen,
            message,
        }
    };
}
