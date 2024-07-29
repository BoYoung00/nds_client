import React, { useEffect, useRef } from 'react';
import styles from '../DataBase.module.scss';
import refresh from '../../../assets/images/refresh.png';
import addData from '../../../assets/images/addData.png';
import deleteData from '../../../assets/images/deleteData.png';
import save from '../../../assets/images/save.png';
import updateSave from '../../../assets/images/updateSave.png';
import search from '../../../assets/images/search.png';
import { Notification } from '../../../publicComponents/layout/modal/Notification';
import { useDataTab } from "../hooks/useDataTab";

interface DataTabProps {
    selectedTable: TableData | null;
}

const DataTab: React.FC<DataTabProps> = ({ selectedTable }) => {
    const {
        hooks: {
            tableStructure,
            selectedRow,
            setSelectedRow,
            createDataList,
            setCreateDataList,
            updateDataList,
            setUpdateDataList,
            deleteDataList,
            setDeleteDataList,
            setTableStructure
        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleSave,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick
        },
        modals: {
            successMessage,
            setSuccessMessage,
            questionMessage,
            setQuestionMessage,
            errorMessage,
            setErrorMessage,
        }
    } = useDataTab(selectedTable);

    const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

    useEffect(() => {
        const columnWidths: { [key: string]: number } = {};

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
    }, [createDataList, updateDataList, deleteDataList]);

    if (!tableStructure) return null;
    const columns = tableStructure ? Object.keys(tableStructure) : [];

    return (
        <>
            <div className={styles.dataTab}>
                <header className={styles.dataTab__header}>
                    <span onClick={handleRefreshClick}>
                        <img src={refresh} alt="refresh" />
                        REFRESH
                    </span>
                    <span onClick={handleAddData}>
                        <img src={addData} alt="addData" />
                        ADD_DATA
                    </span>
                    <span onClick={handleDeleteData}>
                        <img src={deleteData} alt="deleteData" />
                        DELETE_DATA
                    </span>
                    <span onClick={handleSave}>
                        {createDataList.length === 0 && updateDataList.length === 0 && deleteDataList.length === 0 ?
                            <img src={save} alt="save" />
                            :
                            <img src={updateSave} alt="updateSave" />
                        }
                        SAVE
                    </span>
                    <span>
                        <img src={search} alt="search" style={{ marginBottom: '2.5px' }}/>
                        FIND_COLUMN
                    </span>
                </header>
                <main className={styles.dataTab__main}>
                    <table>
                        <thead>
                        <tr>
                            {columns.map((columnKey, index) => {
                                const columnNameMatch = columnKey.match(/name=(\w+),/);
                                const columnName = columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
                                return <th key={index}>{columnName}</th>;
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {columns.length > 0 && tableStructure[columns[0]].map((_, rowIndex) => (
                            <tr key={rowIndex} onClick={() => setSelectedRow(rowIndex)}>
                                {columns.map(columnKey => {
                                    const cellData = tableStructure[columnKey][rowIndex] || { id: null, data: '' };
                                    return (
                                        <td
                                            key={cellData.id || columnKey + rowIndex}
                                            className={selectedRow === rowIndex ? styles.selectedCell : ''}
                                        >
                                            { cellData.dataType === 'MediaFile' ?
                                                <span>{cellData.data}</span>
                                                :
                                                <>
                                                    { cellData.dataType === 'JOIN_Column' ?
                                                        <span>{cellData.data}</span>
                                                        :
                                                        <input
                                                            ref={el => {
                                                                if (el) inputRefs.current[`${columnKey}-${rowIndex}`] = el;
                                                            }}
                                                            type="text"
                                                            value={cellData.data}
                                                            data-column-key={columnKey}
                                                            onChange={e => handleInputChange(e, columnKey, rowIndex)}
                                                            onBlur={handleInputBlur}
                                                            placeholder={'NULL'}
                                                        />
                                                    }
                                                </>
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </main>
            </div>

            {/*새로고침 모달*/}
            {questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={() => {
                    setTableStructure(selectedTable?.tableInnerStructure);
                    setCreateDataList([]);
                    setUpdateDataList([]);
                    setDeleteDataList([]);
                    setSelectedRow(null);
                }}
            />}

            {/*에러 모달*/}
            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}
        </>
    );
};

export default DataTab;
