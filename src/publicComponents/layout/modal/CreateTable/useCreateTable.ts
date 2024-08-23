import React, {ChangeEvent, useEffect, useState} from 'react';
import {getJoinedTableData, tableStructure} from "../../../../services/api";
import {useDataBase} from "../../../../contexts/DataBaseContext";
import {useTable} from "../../../../contexts/TableContext";

// 테이블 생성 메인
export const useCreateTable = (dataBase: DataBaseEntity | null) => {
    const { setTables } = useTable();

    const [columns , setColumns] = useState<RowState[]>([]);
    const [tableData, setTableData] = useState({
        name: '',
        comment: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 테이블 이름, 설명 받기
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTableData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 행 생성 유효성 검사
    const validateData = () : boolean => {
        const columnNameSet: Set<string> = new Set();
        let hasEmptyColumnName = false;
        let hasDuplicates = false;

        if (tableData.name.trim() === '') {
            setErrorMessage('테이블명을 작성해주세요.')
            return true;
        }

        columns.forEach(row => {
            // columnName이 비어 있는지 체크
            if (row.name.trim() === '')
                hasEmptyColumnName = true;

            // columnName 중복을 체크
            if (columnNameSet.has(row.name))
                hasDuplicates = true;
            else
                columnNameSet.add(row.name);
        });

        if (hasDuplicates) {
            setErrorMessage("중복된 이름을 가진 행이 존재합니다.");
            return true;
        } else if(hasEmptyColumnName) {
            setErrorMessage("행 이름을 작성해주세요.");
            return true;
        }
        return false;
    }

    // 테이블 생성 통신
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateData()) return; // 유효성 검사

        // 통신 데이터 만들기
        let columnObjs = columns.map(row => {
           return {
               ...row,
               isJoinTableHash: row.isJoinTableHash? row.isJoinTableHash.split('-')[1] : null
           }
        });

        let createTableObj: TableRequest = {
            dataBaseID : dataBase!.id!,
            name : tableData.name,
            comment : tableData.comment,
            columns : columnObjs,
            tableHash : null,
        };
        // console.log("테이블 생성 : ", createTableObj);
        try {
            const createdTable = await tableStructure(createTableObj);
            setTables(prevTables => [...prevTables, createdTable]);
            setSuccessMessage('테이블 생성에 성공 하셨습니다.');
            resetForm(); // 성공 후 초기화
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 폼 초기화
    const resetForm = () => {
        setTableData({ name: '', comment: '' });
        setColumns([]);
    };

    return {
        tableData,
        handleChange,
        handleSubmit,
        setColumns,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
    };
};

// 테이블 컬럼 생성 부분
const initialRowState: RowState = {
    name: '',
    dataType: 'TEXT',
    isPkActive: false,
    isFkActive: false,
    isUkActive: false,
    isNotNullActive: false,
    isJoinTableHash: null,
};

export const useRowState = () => {
    const { selectedDataBase } = useDataBase();
    const { tables } = useTable();

    const [rows, setRows] = useState<RowState[]>([initialRowState]);

    const [joinTables, setJoinTable] = useState<JoinTable[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 테이블 생성 후 초기화
    useEffect(()=> {
        setRows([{
            name: '',
            dataType: 'TEXT',
            isPkActive: false,
            isFkActive: false,
            isUkActive: false,
            isNotNullActive: false,
            isJoinTableHash: null
        }]);
    }, [tables]);

    // 테이블 생성 조인 테이블 통신 연결하기
    const fetchJoinTables = async (databaseID: number) => {
        try {
            const data = await getJoinedTableData(databaseID);
            // console.log("조인 테이블", data)
            setJoinTable(data);
        } catch (error) {
            setErrorMessage('조인 테이블 데이터를 가져오는 데 실패했습니다.');
        }
    };

    // 디비 선택, 테이블 생성 후 조인 데이터 통신
    useEffect(()=> {
        if (selectedDataBase?.id) fetchJoinTables(selectedDataBase.id)
    }, [selectedDataBase, tables]);

    // 조인 테이블 데이터 선택 후 데이터 가공
    const handleSelectJoinTable = (joinTable: JoinTable | null, index: number) => {
        // console.log('joinTable', joinTable);
        const updatedRows = [...rows];
        updatedRows[index]['isJoinTableHash'] = joinTable
            ? `${joinTable.name} / ${joinTable.pkColumn?.name} / ${joinTable.pkColumn?.type}-${joinTable.tableHash}`
            : null;
        setRows(updatedRows);
    };

    // 행 정보 받기
    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const { name, value, type, checked } = event.target as HTMLInputElement;
        const updatedRows = [...rows];

        if (type === 'checkbox') {
            updatedRows[index][name] = checked;
        } else {
            updatedRows[index][name] = value;
        }
        setRows(updatedRows);
    };

    // 행 추가
    const handleAddRow = () => {
        const newRow: RowState = {
            name: '',
            dataType: 'TEXT',
            isPkActive: false,
            isFkActive: false,
            isUkActive: false,
            isNotNullActive: false,
            isJoinTableHash: null,
        };
        setRows([...rows, newRow]);
    };

    // 행 삭제
    const handleRemoveRow = (index: number) => {
        if (rows.length > 1) {
            const updatedRows = rows.filter((_, idx) => idx !== index);
            setRows(updatedRows);
        }
    };

    return {
        rows,
        handleSelectChange,
        handleAddRow,
        handleRemoveRow,
        handleSelectJoinTable,
        joinTables,
        errorMessage,
        setErrorMessage
    };
};

export const useColumnData = (rows: RowState[], handleSetColumnData: (newData: RowState[]) => void) => {
    useEffect(() => {
        handleSetColumnData(rows);
    }, [rows, handleSetColumnData]);
};