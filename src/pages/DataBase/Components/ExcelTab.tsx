import React from 'react';
import styles from '../DataBase.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import csv from '../../../assets/images/CSV.png';
import { Notification } from '../../../publicComponents/layout/modal/Notification';
import {useExcelTab} from "../hooks/useExcelTab";

const ExcelTab: React.FC = () => {
    const {
        loading,
        file,
        tableViewData,
        handleFileChange,
        handleExportTable,
        handleFetchSaveCsvData,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useExcelTab();

    const displayExcelData = (data: string[][]) => {
        return (
            <table>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) =>
                            rowIndex === 0 ? (
                                <th key={cellIndex}>{cell || ''}</th>
                            ) : (
                                <td key={cellIndex}>{cell || ''}</td>
                            )
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            <div className={styles.excelTab}>
                <span className={styles.excelDownload} onClick={handleExportTable}>
                  테이블 엑셀 추출
                </span>
                <main>
                    <section className={styles.excelTab__fileContainer}>
                        <div className={styles.description}>
                            <h2>CSV 엑셀 데이터 적용 방법</h2>
                            <p>
                                1. 엑셀 가장 상단 행은 데이터베이스 <span>행 이름과 동일</span>해야 합니다.
                            </p>
                            <p>ex) </p>
                            <img className={styles.csvImg} src={csv} alt="CSV" />
                            <p>
                                2. 해당 시트의 이름은 항상 <span>"Sheet1"</span>으로 해주세요.
                            </p>
                            <p>
                                3. 파일 선택을 누르고 추가할 EXCEL 파일을 첨부 후 추가 버튼을 눌러주세요.
                            </p>
                        </div>
                        <div className={styles.fileInputWrapper}>
                            <label className={styles.addBut}>
                                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                                <p className={styles.chooseFileButton}>파일 선택</p>
                            </label>
                            {file && <div className={styles.selectedFileName}>{file.name}</div>}
                        </div>
                    </section>
                    <img className={styles.excelTab__doubleArrowImg} src={doubleArrow} alt="화살표" />
                    <section className={styles.excelTab__previewContainer}>
                        {tableViewData && displayExcelData(tableViewData)}
                    </section>
                </main>
                <footer className={styles.tableAddDataBut}>
                    <button onClick={handleFetchSaveCsvData}>테이블에 데이터 추가하기</button>
                </footer>
            </div>

            {successMessage && (
                <Notification onClose={() => setSuccessMessage(null)} type="success" message={successMessage} />
            )}

            {errorMessage && (
                <Notification onClose={() => setErrorMessage(null)} type="error" message={errorMessage} />
            )}
        </>
    );
};

export default ExcelTab;
