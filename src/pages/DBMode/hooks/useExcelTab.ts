import {useState} from 'react';
import * as XLSX from 'xlsx';
import {exportTable, saveCsvData} from '../../../services/api';
import {downloadFile} from '../../../utils/utils';
import {useTable} from "../../../contexts/TableContext";


export const useExcelTab = () => {
    const { selectedTable } = useTable();

    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [tableViewData, setTableViewData] = useState<string[][] | null>(null);
    const [dataSet, setDataSet] = useState<Map<string, string[]> | null>(null);
    const [attributeNames, setAttributeNames] = useState<string[]>([]); // 행 선택 값

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;

        // 파일이 선택되지 않았거나 취소된 경우
        if (!selectedFile) {
            setFile(null);
            setTableViewData(null);
            setDataSet(null);
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

            setTableViewData(json);
            excelDataParsing(json);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const excelDataParsing = (data: string[][]) => {
        const dataSet: Map<string, string[]> = new Map();

        const columnList = data[0];

        for (let colIndex = 0; colIndex < columnList.length; colIndex++) {
            const columnName = columnList[colIndex];

            const columnData: string[] = [];
            for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
                columnData.push(data[rowIndex][colIndex]);
            }
            dataSet.set(columnName, columnData);
        }
        setDataSet(dataSet);
    };

    // 파일 다운로드 통신
    const handleExportTable = async () => {
        if (!selectedTable) return;

        try {
            const { blob: fileBlob, fileName } = await exportTable(selectedTable.id, attributeNames);
            downloadFile(fileBlob, fileName); // 파일 다운로드
        } catch (error) {
            setErrorMessage('파일 다운로드 중 오류가 발생했습니다.');
        }
    };

    const handleFetchSaveCsvData = async () => {
        if (!selectedTable) return;
        if (!dataSet) {
            setErrorMessage('엑셀 파일을 선택해주세요.');
            return;
        }
        const dataSetObject = Object.fromEntries(dataSet);
        const csvDataRequest: CsvDataRequest = {
            tableID: selectedTable.id,
            tableHash: selectedTable.tableHash,
            dataSet: dataSetObject,
        };

        try {
            setLoading(true);
            await saveCsvData(csvDataRequest);
            setSuccessMessage('CSV 데이터 저장에 성공하셨습니다.');
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        hooks: {
            file,
            tableViewData,
            attributeNames,
            setAttributeNames,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
        },
        handles: {
            handleFileChange,
            handleExportTable,
            handleFetchSaveCsvData,
        }
    };
};
