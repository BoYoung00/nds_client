import React, {RefObject, useEffect, useRef, useState} from 'react';
import {copyToClipboard, findColumnInfo} from "../../../utils/utils";
import {createData, findJoinPreviewData, getImagesPathList, getVideoPathList} from "../../../services/api";
import {useTable} from "../../../contexts/TableContext";

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

export const useDataTab = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {selectedTable, setSelectedTable, setTables, tables} = useTable();
    const [imagePaths, setImagePaths] = useState<MediaFile[]>([]);
    const [videoPaths, setVideoPaths] = useState<MediaFile[]>([]);

    const [tableStructure, setTableStructure] = useState<TableInnerStructure | undefined>(undefined);
    const [editingCell, setEditingCell] = useState<{ columnKey: string; rowIndex: number } | null>(null);
    const [editedValue, setEditedValue] = useState<string>('');
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [createRowLine, setCreateRowLine] = useState<number>(0);
    const [deletedRows, setDeletedRows] = useState<number[]>([]); // 삭제된 행 상태
    const [joinTableStructure, setJoinTableStructure] = useState<TableInnerStructure | null>(null);
    const [isJoinTable, setIsJoinTable] =useState<boolean>(false);
    const [isSsrViewVisible, setIsSsrViewVisible] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(false);

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
        fetchMedias();

        // 조인 테이블인지 찾기
        const columns = Object.keys(selectedTable?.tableInnerStructure!);
        columns.forEach(columnKey => {
            const { joinTableHash } = findColumnInfo(columnKey);
            if (joinTableHash) {
                handleFetchJoinTablePreview();
                setIsJoinTable(true)
            }
        })
    }, [selectedTable])

    // 데이터 저장 (비동기 처리)
    useEffect(() => {
        if (editingCell && tableStructure) {
            handleInputBlur();
        }
    }, [tableStructure]);

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
        try {
            const createdTableData = await createData(requestData);
            setSuccessMessage('데이터 저장에 성공하셨습니다.');
            await updateTable(createdTableData);
            await handleResetTableData();
            await setSelectedTable(createdTableData);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 기존 테이블 리스트 업데이트
    const updateTable = async (updatedData: Partial<TableData>) => {
        await setTables((prevTables: TableData[]) =>
            prevTables.map(table =>
                table.id === updatedData.id
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
            setDeletedRows([]);
            setSelectedRow(null);
            setCreateRowLine(0);
            setIsJoinTable(false);
        }
    }

    // tables가 업데이트될 때, selectedTable의 id와 일치하는 테이블을 다시 선택
    useEffect(() => {
        if (tables.length > 0 && selectedTable) {
            const matchingTable = tables.find(table => table.id === selectedTable.id);
            if (matchingTable) {
                setSelectedTable(matchingTable);  // id가 일치하는 테이블로 업데이트
            } else {
                setSelectedTable(null);  // 일치하는 테이블이 없으면 null로 초기화
            }
        }
    }, [tables]);

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
            // console.log(newData)
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
        });

        const deletedDataLines = Array.from(new Set(deletedDataList.map(data => data.columnLine)));
        setCreateDataList(prevList => prevList.filter(data =>
            !deletedDataLines.includes(data.columnLine)
        ));
        setSelectedRow(null);
        setDeletedRows(prev => [...prev, selectedRow]); // 삭제된 행 인덱스 추가
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

            // console.log("행 수정", newData)

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

    // 조인 데이터 데이터 리스트 찾기
    const findJoinDataList = (tableHash: string): string[] => {
        const parentsTable = tables.find((table) => table.tableHash === tableHash);
        if (!parentsTable) return [];

        const dataList: string[] = [];

        for (const key in parentsTable.tableInnerStructure) {
            const { isPk } = findColumnInfo(key)
            const columns = parentsTable.tableInnerStructure[key];

            if (isPk) {
                columns.forEach((column) => {
                    dataList.push(column.data);
                });
            }
        }
        return dataList;
    };

    // 테이블 이미지 리스트 가져오기
    const fetchMedias = async () => {
        if (!selectedTable?.tableHash) return;

        try {
            setLoading(true);
            const images = await getImagesPathList(selectedTable.tableHash)
            const videos = await getVideoPathList(selectedTable.tableHash);
            setImagePaths(images);
            setVideoPaths(videos);
        } catch (error) {
            setErrorMessage('미디어 경로 목록을 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 모달에서 데이터 선택
    const handleSelectData = (selectedData: any, columnKey: string, rowIndex: number) => {
        if (tableStructure) {
            setEditingCell({ columnKey, rowIndex });

            let finalData: string;

            // `selectedData`가 `MediaFile` 타입인지 체크
            if (selectedData === null) {
                finalData = ''; // null일 경우 빈 문자열을 할당
            } else if (selectedData && typeof selectedData === 'object' && 'path' in selectedData) {
                finalData = selectedData.path;  // `MediaFile` 타입일 경우
            } else {
                finalData = selectedData as string;  // `string` 타입일 경우
            }

            setEditedValue(finalData);

            // 테이블 구조 업데이트
            const updatedTableStructure = { ...tableStructure };
            const updatedCellData = [...(updatedTableStructure[columnKey] || [])];
            updatedCellData[rowIndex] = { ...updatedCellData[rowIndex], data: finalData };
            updatedTableStructure[columnKey] = updatedCellData;

            // 상태 업데이트 한 번에 처리
            setTableStructure(updatedTableStructure);
        }
    };

    // join 테이블 프리뷰 데이터 통신
    const handleFetchJoinTablePreview = async () => {
        try {
            const response = await findJoinPreviewData(selectedTable?.id!);
            setJoinTableStructure(response);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    const toggleSsrView = () => {
        setIsSsrViewVisible(prevState => !prevState);
    };

    // 조인 테이블 접근 url 복사
    const handleCopyJoinTableUrl = () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const url = apiUrl + '/api/json/join/' + selectedTable?.tableHash
        copyToClipboard(url, () => setShowCopyMessage(true));
        setShowCopyMessage(false);
    }

    return {
        hooks: {
            tableStructure,
            selectedRow,
            setSelectedRow,
            createDataList,
            updateDataList,
            deleteDataList,
            deletedRows,
            imagePaths,
            videoPaths,
            isJoinTable,
            isSsrViewVisible,
            joinTableStructure,
            showCopyMessage
        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleSave,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick,
            handleResetTableData,
            handleSelectData,
            findJoinDataList,
            toggleSsrView,
            handleCopyJoinTableUrl
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

// 행 데이터 수정 시에 행 너비 조정
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

// 모달창 마우스 이벤트
export const useSearchPosition = (initialPosition: { x: number, y: number } | null) => {
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchPosition, setSearchPosition] = useState<{ x: number, y: number } | null>(initialPosition);
    const searchBoxRef = useRef<HTMLSpanElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // 버튼 클릭 시 검색창 토글 및 위치 설정
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX: x, clientY: y } = event;
        setSearchPosition({ x, y: y-40 });
        setShowSearch(prevShowSearch => !prevShowSearch);
    };

    // 화면 크기와 스크롤을 고려하여 검색창 위치 조정
    useEffect(() => {
        if (showSearch && searchBoxRef.current) {
            const { clientWidth: boxWidth, clientHeight: boxHeight } = searchBoxRef.current;
            const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
            const { x, y } = searchPosition || { x: 0, y: 0 };

            let adjustedX = x;
            let adjustedY = y;

            // 화면 오른쪽 벽과 맞닿게 조정
            if (x + boxWidth > windowWidth) {
                adjustedX = windowWidth - boxWidth - 10; // 10px 여유 공간
            }

            // 화면 아래쪽 벽과 맞닿게 조정
            if (y + boxHeight > windowHeight) {
                adjustedY = windowHeight - boxHeight - 10; // 10px 여유 공간
            }

            setSearchPosition({ x: adjustedX, y: adjustedY });
        }
    }, [showSearch, searchPosition]);

    // 문서 클릭 시 검색창 닫기
    useEffect(() => {
        const handleDocumentClick: EventListener = (event: Event) => {
            const target = event.target as HTMLElement;
            if (
                searchBoxRef.current && !searchBoxRef.current.contains(target) &&
                buttonRef.current && !buttonRef.current.contains(target)
            ) {
                setShowSearch(false);
            }
        };

        document.addEventListener('click', handleDocumentClick as EventListener);
        return () => {
            document.removeEventListener('click', handleDocumentClick as EventListener);
        };
    }, []);

    return {
        showSearch,
        searchPosition,
        searchBoxRef,
        buttonRef,
        handleButtonClick,
        setShowSearch
    };
};

