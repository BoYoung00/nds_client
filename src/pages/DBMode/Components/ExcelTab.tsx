import React from 'react';
import styles from '../DBMode.module.scss';
import {Notification} from '../../../publicComponents/layout/modal/Notification';
import {useExcelTab} from "../hooks/useExcelTab";
import TableView from "../../../publicComponents/layout/TableView";
import {useTable} from "../../../contexts/TableContext";

const ExcelTab: React.FC = () => {
    const { selectedTable } = useTable();

    const {
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
                <main>
                    <section className={styles.previewContainer}>
                        <div className={styles.excelTop}>
                            <h2>CSV Export</h2>
                            <p>엑셀로 추출할 행을 선택해주세요.</p>
                            <div className={styles.ExportPreviewWrap}>
                                <TableView tableStructure={selectedTable?.tableInnerStructure!} isFilter={true} attributeNames={attributeNames} setAttributeNames={setAttributeNames}/>
                            </div>
                        </div>
                        <button className={styles.excelBut} onClick={handleExportTable}>
                            테이블 엑셀 다운로드
                        </button>
                    </section>

                    <section style={{borderLeft: `1px solid gray`, height: '100%'}}></section>

                    <section className={styles.fileContainer}>
                        <div className={styles.description}>
                            <h2>CSV Import</h2>
                            <p>CSV 파일로 테이블에 데이터 추가하는 방법:</p>
                            <p>
                                1. 엑셀 가장 상단 행은 <span>테이블 행 이름과 동일</span>해야 합니다.
                            </p>
                            <p>
                                2. 해당 시트의 이름은 항상 <span>"Sheet1"</span>으로 해주세요.
                            </p>
                            <p>
                                3. 파일 선택을 눌러 Excel 파일을 첨부 후 <span>"테이블에 데이터 추가"</span>를 눌러주세요.
                            </p>
                        </div>
                        <label className={styles.fileInputWrapper}>
                            <p>Excel 파일 선택:</p>
                            <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                        </label>
                        <div className={styles.importPreviewWrap}>
                            <div className={styles.dataPreviewWrap}>
                                <h3>Excel Data Preview</h3>
                                <div className={styles.dataPreview}>
                                    {tableViewData && displayExcelData(tableViewData)}
                                </div>
                            </div>
                            <button className={styles.excelBut} onClick={handleFetchSaveCsvData}>테이블에 데이터 추가</button>
                        </div>
                    </section>
                </main>
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
