import React, {useState} from 'react';
import * as XLSX from 'xlsx';
import styles from '../DataBase.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import csv from '../../../assets/images/CSV.png';
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {exportTable, saveCsvData, saveFilteredTableData} from "../../../services/api";
import {downloadFile} from "../../../utils/utils";

interface ExcelTabProps {
    selectedTable: TableData | null;
}

const ExcelTab: React.FC<ExcelTabProps> = ({ selectedTable }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [tableViewData, setTableViewData] = useState<string[][] | null>(null);
    const [dataSet, setDataSet] = useState<Map<string, string[]> | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setFile(file);

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
            reader.readAsArrayBuffer(file);
        }
    };

    const displayExcelData = (data: string[][]) => {
        return (
            <table>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            rowIndex === 0 ? (
                                <th key={cellIndex}>{cell || ''}</th>
                            ) : (
                                <td key={cellIndex}>{cell || ''}</td>
                            )
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
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


    const handleExportTable = async () => {
        if (!selectedTable) return

        try {
            const { blob: fileBlob, fileName } = await exportTable(selectedTable.id);
            downloadFile(fileBlob, fileName); // 파일 다운
        } catch (error) {
            setErrorMessage("파일 다운로드 중 오류가 발생했습니다.");
        }
    };

    const handleFetchSaveCsvData = async () => {
        if (!selectedTable) return;
        if (!dataSet) {
            setErrorMessage('엑셀 파일을 선택해주세요.');
            return;
        }

        const csvDataRequest: CsvDataRequest = {
            tableID: selectedTable.id,
            tableHash: selectedTable.tableHash,
            dataSet: dataSet!,
        };

        console.log(csvDataRequest);

        try {
            setLoading(true);
            await saveCsvData(csvDataRequest);
            setSuccessMessage("CSV 데이터 저장에 성공하셨습니다.");
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={styles.excelTab}>
                <span className={styles.excelDownload} onClick={handleExportTable}>테이블 엑셀 추출</span>
                <main>
                    <section className={styles.excelTab__fileContainer}>
                        <div className={styles.description}>
                            <h2>CSV 엑셀 데이터 적용 방법</h2>
                            <p>1. 엑셀 가장 상단 행은 데이터베이스 <span>행 이름과 동일</span>해야 합니다.</p>
                            <p>ex) </p>
                            <img className={styles.csvImg} src={csv} alt="CSV" />
                            <p>2. 해당 시트의 이름은 항상  <span>"Sheet1"</span>으로 해주세요.</p>
                            <p>3. 파일 선택을 누르고 추가할 EXCEL 파일을 첨부 후 추가 버튼을 눌러주세요.</p>
                        </div>
                        <div className={styles.fileInputWrapper}>
                            <label className={styles.addBut}>
                                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                                <p className={styles.chooseFileButton}>파일 선택</p>
                            </label>
                            { file &&
                                <div className={styles.selectedFileName}>{file.name}</div>
                            }
                        </div>
                    </section>
                    <img className={styles.excelTab__doubleArrowImg} src={doubleArrow} alt='화살표'/>
                    <section className={styles.excelTab__previewContainer}>
                        {tableViewData && displayExcelData(tableViewData)}
                    </section>
                </main>
                <footer className={styles.tableAddDataBut}>
                    <button onClick={handleFetchSaveCsvData}>테이블에 데이터 추가하기</button>
                </footer>
            </div>

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default ExcelTab;
