import React, {ChangeEvent, useEffect, useState} from 'react';

// 테이블 생성 메인
export const useCreateTable = (dataBase: DataBaseEntity | null) => {
    const [columns , setColumns] = useState<RowState[]>([])
    const [tableData, setTableData] = useState({
        name: '',
        comment: '',
    });
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
    const validateData = () : { isError: boolean } => {
        const columnNameSet: Set<string> = new Set();
        let hasEmptyColumnName = false;
        let hasDuplicates = false;

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
            return { isError: true };
        } else if(hasEmptyColumnName) {
            setErrorMessage("행 이름을 작성해주세요.");
            return { isError: true };
        }
        return { isError: false };
    }

    // 통신
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 유효성 검사
        const validationResult = validateData();
        if (validationResult.isError) return;

        // 통신 데이터 만들기
        let obj = {
            dataBaseID : dataBase!!.id,
            name : tableData.name,
            comment : tableData.comment,
            columns : columns,
            tableHash : null,
        }
        
        // 통신 로직 넣기
        console.log("테이블 생성 : ", obj)
    };

    return {
        tableData,
        handleChange,
        handleSubmit,
        setColumns,
        errorMessage,
        setErrorMessage,
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
    const [rows, setRows] = useState<RowState[]>([initialRowState]);

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
        handleRemoveRow
    };
};

export const useColumnData = (rows: RowState[], handleSetColumnData: (newData: RowState[]) => void) => {
    useEffect(() => {
        handleSetColumnData(rows);
    }, [rows, handleSetColumnData]);
};