import {useState} from 'react';
import {findColumnInfo} from "../../../utils/utils";

export function useDataTab(selectedTable: TableData | null) {
    const [tableStructure, setTableStructure] = useState<TableInnerStructure | undefined>(selectedTable?.tableInnerStructure);
    const [editingCell, setEditingCell] = useState<{ columnKey: string; rowIndex: number } | null>(null); // 더블 클릭한 key, index 값
    const [editedValue, setEditedValue] = useState<string>(''); // 더블 클릭한 value 값
    const [selectedRow, setSelectedRow] = useState<number | null>(null); // 행 선택

    const [createDataList, setCreateDataList] = useState<DataDTO[]>([]); // 요청 데이터 (추가)
    const [updateDataList, setUpdateDataList] = useState<DataDTO[]>([]); // 요청 데이터 (수정)
    const [deleteDataList, setDeleteDataList] = useState<DataDTO[]>([]); // 요청 데이터 (삭제)

    const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false); // 성공창
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false); // 오류창
    const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false); // 알림창
    const [message, setMessage] = useState<string>(""); // 알림창 메세지

    // 저장 버튼 클릭 (통신)
    const handleSave = async () => {
        if (selectedTable === null) return;

        let requestData: DataRequest = {
            tableID: selectedTable.id,
            tableHash: selectedTable.tableHash,
            createDataRequests: createDataList,
            updateDataRequests: updateDataList,
            deleteDataRequests: deleteDataList
        };

        console.log("requestData (SAVE)", requestData);

        // 예제
        // try {
        //     await post('/url', { requestData });
        //     setIsSuccessOpen(true);
        //     setMessage('성공');
        // } catch (error) {
        //     setIsErrorOpen(true);
        //     setMessage('실패');
        // }

    }

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

                // setCreateDataList에 추가
                const { columnID, type, columnHash } = findColumnInfo(columnKey);
                const columnLength = (tableStructure[columnKey]?.length || 0) + 1;
                const newCreateData: DataDTO = {
                    id: null,
                    columnID,
                    columnHash,
                    data: '',
                    columnLine: columnLength,
                    dataType: type,
                };
                createDataList.push(newCreateData);

                // 테이블 행 리스트에 추가
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
            const deletedDataList: DataDTO[] = [];

            columns.forEach(columnKey => {
                const columnData = tableStructure[columnKey];
                const deletedData = columnData[selectedRow];

                // 삭제 요청 값 만들기
                const { columnID, columnHash, type } = findColumnInfo(columnKey);
                const newCreateData: DataDTO = {
                    id: deletedData.id,
                    columnID,
                    columnHash,
                    data: deletedData.data,
                    columnLine: selectedRow + 1,
                    dataType: type,
                };
                deletedDataList.push(newCreateData);
                if (deletedData.id !== null)
                    deleteDataList.push(newCreateData)

                // 전체 리스트에서 해당 데이터 빼기
                updatedTableStructure[columnKey] = columnData.filter((_, index) => index !== selectedRow);
            });

            // 추가 했던 데이터 리스트에서 삭제하기
            const deletedDataLines = Array.from(new Set(deletedDataList.map(data => data.columnLine)));
            setCreateDataList(prevList => [...prevList.filter(data =>
                    !deletedDataLines.includes(data.columnLine)
            )]);
            setSelectedRow(null);
            setTableStructure(updatedTableStructure);
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

    // 셀 편집 완료 (데이터 추가, 수정)
    const handleInputBlur = () => {
        if (editingCell && tableStructure) {
            const { columnKey, rowIndex } = editingCell;
            const { columnID, columnHash, type } = findColumnInfo(columnKey);

            const updatedTableStructure = { ...tableStructure };
            const updatedCellData = [...(tableStructure[columnKey] || [])];
            updatedCellData[rowIndex] = { ...updatedCellData[rowIndex], data: editedValue };
            updatedTableStructure[columnKey] = updatedCellData;

            setTableStructure(updatedTableStructure);

            // 수정, 추가 요청 값 만들기
            const newCreateData: DataDTO = {
                id: updatedCellData[rowIndex].id ?? null,
                columnID,
                columnHash,
                data: editedValue,
                columnLine: rowIndex + 1,
                dataType: type,
            };

            if (newCreateData.id === null) {
                setCreateDataList(prevList => [
                    ...prevList.filter(data =>
                        !(data.columnLine === newCreateData.columnLine &&
                        data.columnID === newCreateData.columnID)),
                    newCreateData
                ]);
            } else {
                setUpdateDataList(prevList => [
                    ...prevList.filter(data => data.id !== newCreateData.id),
                    newCreateData
                ]);
            }

            setEditingCell(null);
        }
    };

    return {
        hooks: {
            editingCell,
            editedValue,
            selectedRow,
            setSelectedRow,
            tableStructure,
            setTableStructure,
            createDataList,
            setCreateDataList,
            updateDataList,
            setUpdateDataList,
            deleteDataList,
            setDeleteDataList,

        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleSave,
            handleCellDoubleClick,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick
        },
        modals: {
            isSuccessOpen,
            setIsSuccessOpen,
            isErrorOpen,
            setIsErrorOpen,
            isQuestionOpen,
            setIsQuestionOpen,
            message,
        }
    };
}
