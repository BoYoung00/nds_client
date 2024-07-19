import React, {ChangeEvent, useEffect, useState} from 'react';

// 테이블 생성 메인
export const useCreateTable = (dataBase: DataBaseEntity | null) => {
    const [columnData , setColumnData] = useState<RowState[]>([])
    const [tableData, setTableData] = useState({
        name: '',
        comment: '',
    });
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

        columnData.forEach(row => {
            // columnName이 비어 있는지 체크
            if (row.columnName.trim() === '') {
                hasEmptyColumnName = true;
            }

            // columnName 중복을 체크
            if (columnNameSet.has(row.columnName)) {
                hasDuplicates = true;
            } else {
                columnNameSet.add(row.columnName);
            }
        });

        if (hasDuplicates) {
            setErrorMessage("중복된 이름을 가진 행이 존재합니다.");
            setIsErrorOpen(true);
            return { isError: true };
        } else if(hasEmptyColumnName) {
            setErrorMessage("행 이름을 작성해주세요.");
            setIsErrorOpen(true);
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

        let obj = {
            tableName : tableData.name,
            comment : tableData.comment,
            columnList : columnData,
            dataBaseID : dataBase!!.id,
        }
        
        // 통신 로직 넣기
        console.log("테이블 생성 : ", obj)
    };

    return {
        tableData: tableData,
        handleChange,
        handleSubmit,
        setColumnData,
        isErrorOpen,
        setIsErrorOpen,
        errorMessage,
    };
};

// 테이블 컬럼 생성 부분
const initialRowState: RowState = {
    columnName: '',
    dataType: 'TEXT',
    pk: false,
    fk: false,
    uk: false,
    isNotNull: false,
    joinTable: null,
    joinColumn: null,
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
            columnName: '',
            dataType: 'TEXT',
            pk: false,
            fk: false,
            uk: false,
            isNotNull: false,
            joinTable: null,
            joinColumn: null,
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