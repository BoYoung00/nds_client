import { useEffect, useState } from 'react';
import { findColumnInfo } from "../../../utils/utils";
import { getUserLikeFilters, saveFilteredTableData } from "../../../services/api";


export function useLikeTab(selectedTable: TableData | null) {
    const [loading, setLoading] = useState<boolean>(false);

    const [tableStructure, setTableStructure] = useState<TableInnerStructure | null>(null);
    const [filteredTableStructure, setFilteredTableStructure] = useState<TableInnerStructure | null>(null);
    const [columnNames, setColumnNames] = useState<string[]>([]);

    const [columns, setColumns] = useState<string[]>(['']);
    const [selectedColumnData, setSelectedColumnData] = useState<{ id: number, columnHash: string, type: string }[]>([]); // column 선택 값
    const [inputValues, setInputValues] = useState<string[]>(['']); // text 입력 값
    const [selectOptions, setSelectOptions] = useState<string[]>(['']); // option 선택 값

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 선택된 테이블이 변경되면 호출되는 효과
    useEffect(() => {
        if (selectedTable) {
            setColumns(['']);
            setSelectedColumnData([]);
            setInputValues(['']);
            setSelectOptions(['']);

            setTableStructure(selectedTable.tableInnerStructure);
            fetchFilters(selectedTable.tableHash);
        }
    }, [selectedTable]);

    // 테이블 구조가 변경되면 열 이름을 설정
    useEffect(() => {
        if (tableStructure) {
            const names = Object.keys(tableStructure).map(key => {
                const columnInfo = findColumnInfo(key);
                return columnInfo.name;
            });
            setColumnNames(names);
        }
    }, [tableStructure]);

    // 필터링 조건이 변경되면 필터 적용
    useEffect(() => {
        if (tableStructure && columns.length > 0) {
            applyFilters();
        }
    }, [tableStructure, columns, inputValues, selectOptions]);

    // 필터 목록을 가져오는 함수
    const fetchFilters = async (tableHash: string) => {
        try {
            setLoading(true);
            const data = await getUserLikeFilters(tableHash);
            if (data.length === 0) return;
            initializeFilters(data);
        } catch (error) {
            setErrorMessage('필터 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 목록 불러오기 통신 완료 후 필터를 초기화하는 함수
    const initializeFilters = (data: FilterResponse[]) => {
        const newSelectedColumns = data.map(filter => filter.filterColumnName);
        const newSelectedColumnData = data.map(filter => {
            return {
                id: filter.filterColumnID,
                columnHash: filter.filterColumnHash,
                type: filter.filterType === 1 ? 'INTEGER' : 'TEXT'
            };
        });
        const newInputValues = data.map(filter => filter.filterValue);
        const newSelectOptions = data.map(filter => filter.option);

        setColumns(newSelectedColumns);
        setSelectedColumnData(newSelectedColumnData);
        setInputValues(newInputValues);
        setSelectOptions(newSelectOptions);
    };

    // 프리뷰에 필터를 적용하는 함수
    const applyFilters = () => {
        if (!tableStructure) return;

        let filteredIndices: Set<number> = new Set();
        let newFilteredStructure: TableInnerStructure = {};

        Object.keys(tableStructure).forEach(key => {
            const columnInfo = findColumnInfo(key);
            const index = selectedColumnData.findIndex(data => data.columnHash === columnInfo.columnHash);
            if (index === -1) return;

            const inputValue = inputValues[index];
            const option = selectOptions[index];

            tableStructure[key].forEach((colData, dataIndex) => {
                const value = colData.data;

                let isValid = false;
                if (columnInfo.type === 'INTEGER' || columnInfo.type === 'REAL') {
                    const numValue = parseFloat(value);
                    const numInput = parseFloat(inputValue);
                    if (option === 'GREATER') isValid = numValue > numInput;
                    if (option === 'LESS') isValid = numValue < numInput;
                    if (option === 'EQUAL') isValid = numValue === numInput;
                } else if (columnInfo.type === 'TEXT') {
                    if (option === 'FIRST') isValid = value.startsWith(inputValue);
                    if (option === 'INCLUDE') isValid = value.includes(inputValue);
                    if (option === 'LAST') isValid = value.endsWith(inputValue);
                }

                if (isValid) {
                    filteredIndices.add(dataIndex);
                }
            });
        });

        Object.keys(tableStructure).forEach(key => {
            newFilteredStructure[key] = tableStructure[key].filter((_, index) => filteredIndices.has(index));
        });

        console.log('newFilteredStructure', newFilteredStructure);
        setFilteredTableStructure(newFilteredStructure);
    };

    // 핸들러 함수들
    const handleSelectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = event.target.value;
        const updatedSelectedColumns = [...columns];
        updatedSelectedColumns[index] = selectedName;
        setColumns(updatedSelectedColumns);

        const selectedKey = Object.keys(tableStructure!).find(key => {
            const columnInfo = findColumnInfo(key);
            return columnInfo.name === selectedName;
        });

        if (selectedKey) {
            const columnInfo = findColumnInfo(selectedKey);
            const updatedSelectedColumnData = [...selectedColumnData];
            updatedSelectedColumnData[index] = {
                id: columnInfo.columnID,
                columnHash: columnInfo.columnHash,
                type: columnInfo.type
            };
            setSelectedColumnData(updatedSelectedColumnData);
        }
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const updatedInputValues = [...inputValues];
        updatedInputValues[index] = value;
        setInputValues(updatedInputValues);
    };

    const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const updatedSelectOptions = [...selectOptions];
        updatedSelectOptions[index] = value;
        setSelectOptions(updatedSelectOptions);
    };

    const addSelectBox = () => {
        setColumns([...columns, '']);
        setSelectedColumnData([...selectedColumnData, { id: 0, columnHash: '', type: '' }]);
        setInputValues([...inputValues, '']);
        setSelectOptions([...selectOptions, '']);
    };

    const removeSelectBox = () => {
        if (columns.length > 1) {
            setColumns(columns.slice(0, -1));
            setSelectedColumnData(selectedColumnData.slice(0, -1));
            setInputValues(inputValues.slice(0, -1));
            setSelectOptions(selectOptions.slice(0, -1));
        }
    };

    const validateFilters = (): boolean => {
        for (let i = 0; i < columns.length; i++) {
            if (columns[i] === '') {
                setErrorMessage("행을 선택해주세요.");
                return false;
            }
            if (selectOptions[i] === '') {
                setErrorMessage("옵션을 선택해주세요.");
                return false;
            }
        }
        return true;
    };

    // 필터를 저장하는 함수 (통신)
    const fetchFilterSave = async () => {
        if (!validateFilters() || !selectedTable?.tableHash) return;

        const filterRequests = columns.map((_, index) => {
            const columnData = selectedColumnData[index];
            const isNumeric = ['INTEGER', 'REAL'].includes(columnData.type);
            return {
                filterColumnID: columnData.id,
                filterColumnHash: columnData.columnHash,
                filterIntegerValue: isNumeric ? parseFloat(inputValues[index]) : null,
                filterIntegerOption: isNumeric ? selectOptions[index] : null,
                filterWordValue: !isNumeric ? inputValues[index] : null,
                filterWorldOption: !isNumeric ? selectOptions[index] : null
            };
        });

        try {
            setLoading(true);
            await saveFilteredTableData(selectedTable.tableHash, filterRequests);
            setSuccessMessage("필터 저장에 성공하셨습니다.");
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        hooks: {
            loading,
            tableStructure,
            filteredTableStructure,
            columnNames,
            columns,
            selectedColumnData,
            inputValues,
            selectOptions,
        },
        handlers: {
            handleSelectChange,
            handleInputChange,
            handleOptionChange,
            addSelectBox,
            removeSelectBox,
            fetchFilterSave,
        },
        modals: {
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage
        }
    };
}
