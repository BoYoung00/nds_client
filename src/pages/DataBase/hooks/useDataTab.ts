import React, {RefObject, useEffect, useState} from 'react';
import {findColumnInfo} from "../../../utils/utils";
import {createData} from "../../../services/api";

const createEmptyData = (columnKey: string, columnLength: number): DataDTO => {
    const { columnID, type, columnHash } = findColumnInfo(columnKey);
    return {
        id: null,
        columnID,
        columnHash,
        data: '',
        columnLine: columnLength,
        dataType: type,
    };
};

export function useDataTab(
    selectedTable: TableData | null,
    setTables: React.Dispatch<React.SetStateAction<TableData[]>>
) {
    const [tableStructure, setTableStructure] = useState<TableInnerStructure | undefined>(undefined);
    const [editingCell, setEditingCell] = useState<{ columnKey: string; rowIndex: number } | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [createRowLine, setCreateRowLine] = useState<number>(0);

    // 통신 데이터
    const [createDataList, setCreateDataList] = useState<DataDTO[]>([]);
    const [updateDataList, setUpdateDataList] = useState<DataDTO[]>([]);
    const [deleteDataList, setDeleteDataList] = useState<DataDTO[]>([]);

    // 모달
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 다른 테이블 선택 시마다 초기화
    useEffect(() => {
        handleResetTableData();
    }, [selectedTable])

    // 저장 (통신)
    const handleSave = async () => {
        if (!selectedTable) return;

        const requestData: DataRequest = {
            tableID: selectedTable.id,
            tableHash: selectedTable.tableHash,
            createDataRequests: createDataList,
            updateDataRequests: updateDataList,
            deleteDataRequests: deleteDataList
        };
        console.log("requestData (SAVE)", requestData);

        try {
            const createdTableData = await createData(requestData);
            console.log(createdTableData)
            setSuccessMessage('데이터 저장에 성공하셨습니다.');
            // 서버 수정하면 수정하기
            await updateTable(createdTableData.id, createdTableData);
            await handleResetTableData();
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 기존 테이블 리스트 업데이트
    const updateTable = (id: number, updatedData: Partial<TableData>) => {
        setTables(prevTables =>
            prevTables.map(table =>
                table.id === id
                    ? { ...table, ...updatedData }
                    : table
            )
        );
    };

    // 새로고침
    const handleRefreshClick = () => {
        setQuestionMessage("새로고침을 하시겠습니까?");
    };

    // 리셋 함수
    const handleResetTableData = () => {
        if (selectedTable) {
            setTableStructure(selectedTable.tableInnerStructure);
            setCreateDataList([]);
            setUpdateDataList([]);
            setDeleteDataList([]);
            setSelectedRow(null);
            setCreateRowLine(0);
        }
    }

    // 행 추가
    const handleAddData = () => {
        if (tableStructure) {
            const columns = Object.keys(tableStructure);
            const newData = columns.reduce((acc, columnKey) => {
                const newCreateData = createEmptyData(columnKey, createRowLine);
                createDataList.push(newCreateData);

                acc[columnKey] = [
                    ...(tableStructure[columnKey] || []),
                    { id: null, data: '', columnID: newCreateData.columnID, createTime: '', lineHash: createRowLine.toString(), dataType: newCreateData.dataType },
                ];
                return acc;
            }, {} as TableInnerStructure);

            console.log(newData)

            setCreateRowLine(createRowLine + 1);
            setTableStructure(newData);
            setSelectedRow(Object.values(newData)[0].length - 1);
        }
    };

    // 행 삭제
    const handleDeleteData = () => {
        if (selectedRow === null || !tableStructure) {
            setErrorMessage("삭제할 행을 선택해 주세요.");
            return;
        }

        const updatedTableStructure = { ...tableStructure };
        const columns = Object.keys(tableStructure);
        const deletedDataList: DataDTO[] = [];

        columns.forEach(columnKey => {
            const columnData = tableStructure[columnKey];
            const deletedData = columnData[selectedRow];
            const { columnID, columnHash, type } = findColumnInfo(columnKey);

            const newDeleteData: DataDTO = {
                id: deletedData.id,
                columnID,
                columnHash,
                data: deletedData.data,
                columnLine: parseInt(deletedData.lineHash),
                dataType: type,
            };

            deletedDataList.push(newDeleteData);
            if (deletedData.id !== null) deleteDataList.push(newDeleteData);

            updatedTableStructure[columnKey] = columnData.filter((_, index) => index !== selectedRow);
        });

        const deletedDataLines = Array.from(new Set(deletedDataList.map(data => data.columnLine)));
        setCreateDataList(prevList => prevList.filter(data =>
            !deletedDataLines.includes(data.columnLine)
        ));
        setSelectedRow(null);
        setTableStructure(updatedTableStructure);
    };

    // 셀 데이터 수정
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, columnKey: string, rowIndex: number) => {
        const newValue = event.target.value;
        setEditingCell({ columnKey, rowIndex });
        setEditedValue(newValue);

        if (tableStructure) {
            const updatedTableStructure = { ...tableStructure };
            const updatedCellData = [...(tableStructure[columnKey] || [])];
            updatedCellData[rowIndex] = { ...updatedCellData[rowIndex], data: newValue };
            updatedTableStructure[columnKey] = updatedCellData;

            setTableStructure(updatedTableStructure);
        }
    };

    // 셀 수정 완료
    const handleInputBlur = () => {
        if (editingCell && tableStructure) {
            const { columnKey, rowIndex } = editingCell;
            const { columnID, columnHash, type } = findColumnInfo(columnKey);

            const updatedTableStructure = { ...tableStructure };
            const updatedCellData = [...(tableStructure[columnKey] || [])];
            updatedCellData[rowIndex] = { ...updatedCellData[rowIndex], data: editedValue };
            updatedTableStructure[columnKey] = updatedCellData;

            setTableStructure(updatedTableStructure);

            const newData: DataDTO = {
                id: updatedCellData[rowIndex].id ?? null,
                columnID,
                columnHash,
                data: editedValue,
                columnLine: parseInt(updatedCellData[rowIndex].lineHash),
                dataType: type,
            };

            console.log("행 수정", newData)

            if (newData.id === null) {
                setCreateDataList(prevList => [
                    ...prevList.filter(data =>
                        !(data.columnLine === newData.columnLine &&
                            data.columnID === newData.columnID)),
                    newData
                ]);
            } else {
                setUpdateDataList(prevList => [
                    ...prevList.filter(data => data.id !== newData.id),
                    newData
                ]);
            }
            setEditingCell(null);
        }
    };

    return {
        hooks: {
            tableStructure,
            selectedRow,
            setSelectedRow,
            createDataList,
            updateDataList,
            deleteDataList,
        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleSave,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick,
            handleResetTableData
        },
        modals: {
            successMessage,
            setSuccessMessage,
            questionMessage,
            setQuestionMessage,
            errorMessage,
            setErrorMessage,
        }
    };
}

export function useAutoColumnWidth(
    dependencies: any[],
    inputRefs: RefObject<{ [key: string]: HTMLInputElement }>
) {
    useEffect(() => {
        const columnWidths: { [key: string]: number } = {};

        // inputRefs.current가 null이 아닌 경우에만 처리
        if (inputRefs.current) {
            Object.values(inputRefs.current).forEach(input => {
                if (input) {
                    const columnKey = input.dataset.columnKey as string;
                    if (columnKey) {
                        input.style.width = 'auto';
                        const inputWidth = input.scrollWidth;
                        if (!columnWidths[columnKey] || inputWidth > columnWidths[columnKey]) {
                            columnWidths[columnKey] = inputWidth;
                        }
                    }
                }
            });

            Object.values(inputRefs.current).forEach(input => {
                if (input) {
                    const columnKey = input.dataset.columnKey as string;
                    if (columnKey) {
                        input.style.width = `${columnWidths[columnKey] || 100}px`;
                    }
                }
            });
        }
    }, dependencies);
}


