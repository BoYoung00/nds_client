import {useEffect, useState} from 'react';
import {findColumnInfo} from "../../../utils/utils";
import {findJoinPreviewData, getTableHashUrl, getUserLikeFilters, saveFilteredTableData} from "../../../services/api";
import {useTable} from "../../../contexts/TableContext";


export function useLikeTab() {
    const { selectedTable } = useTable();

    const [loading, setLoading] = useState<boolean>(false);

    const [tableStructure, setTableStructure] = useState<TableInnerStructure | null>(null);
    const [filteredTableStructure, setFilteredTableStructure] = useState<TableInnerStructure | null>(null);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [filterApiUrl, setFilterApiUrl] = useState<string | null>(null);
    const [attributeNames, setAttributeNames] = useState<string[]>([]); // 행 선택 값

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

            // 조인 테이블인지 찾기
            const columns = Object.keys(selectedTable?.tableInnerStructure!);
            columns.forEach(columnKey => {
                const { joinTableHash } = findColumnInfo(columnKey);
                if (joinTableHash) {
                    handleFetchJoinTablePreview();
                } else {
                    setTableStructure(selectedTable.tableInnerStructure);
                }
            })
            fetchFilters(selectedTable.tableHash); // 필터 가져오기
            handelFetchFilterUrl(); // url 가져오기
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

    // 필터 목록을 가져오는 함수 (get 통신)
    const fetchFilters = async (tableHash: string) => {
        try {
            setLoading(true);
            const data: CustomAPIResponse = await getUserLikeFilters(tableHash);
            // if (data.apiFilterRequest.length === 0 || data.attributeNames.length === 0) return;
            initializeFilters(data.apiFilterResponse);
            setAttributeNames(data.attributeNames);
        } catch (error) {
            // setErrorMessage('필터 목록을 가져오는 데 실패했습니다.');
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

    // 필터를 저장 하는 함수 (통신)
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
        const customAPIRequest: CustomAPIRequest = {
            apiFilterRequest: filterRequests,
            attributeNames: attributeNames,
        }
        console.log('customAPIRequest', customAPIRequest)
        try {
            setLoading(true);
            await saveFilteredTableData(selectedTable.tableHash, customAPIRequest);
            setSuccessMessage("필터 저장에 성공하셨습니다.");
            if (filterApiUrl === null) handelFetchFilterUrl();
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // REST API url 통신
    const handelFetchFilterUrl = async () => {
        if (!selectedTable) return;

        try {
            const response = await getTableHashUrl(selectedTable.tableHash);
            setFilterApiUrl(response);
        } catch (error) {
            // 해당 테이블에 필터가 없을 경우
            setFilterApiUrl(null);
        }
    }

    // join 테이블 프리뷰 데이터 통신
    const handleFetchJoinTablePreview = async () => {
        try {
            const response = await findJoinPreviewData(selectedTable?.id!);
            setTableStructure(response);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 프리뷰에 필터를 적용하는 함수
    const applyFilters = () => {
        if (!tableStructure) return;

        let filteredIndices: Set<number> = new Set();

        // 첫 번째 필터링에 모든 인덱스를 추가하여 시작
        for (let i = 0; i < Object.values(tableStructure)[0].length; i++) {
            filteredIndices.add(i);
        }

        Object.keys(tableStructure).forEach(key => {
            const columnInfo = findColumnInfo(key);
            const index = selectedColumnData.findIndex(data => data.columnHash === columnInfo.columnHash);
            if (index === -1) return;

            const inputValue = inputValues[index];
            const option = selectOptions[index];

            // 새로운 임시 Set을 만들어서 현재 열에서 조건을 만족하는 인덱스만 유지
            let currentFilteredIndices: Set<number> = new Set();

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
                    currentFilteredIndices.add(dataIndex);
                }
            });

            // AND 연산: 기존의 filteredIndices와 현재 필터 조건의 결과인 currentFilteredIndices의 교집합을 구함
            filteredIndices = new Set(Array.from(filteredIndices).filter(index => currentFilteredIndices.has(index)));
        });

        // 결과를 필터링된 인덱스들로 재구성
        let newFilteredStructure: TableInnerStructure = {};
        Object.keys(tableStructure).forEach(key => {
            newFilteredStructure[key] = tableStructure[key].filter((_, index) => filteredIndices.has(index));
        });

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
            filterApiUrl,
            attributeNames,
            setAttributeNames,
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
