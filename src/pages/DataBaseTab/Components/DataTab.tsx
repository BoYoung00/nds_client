import React, { useEffect } from 'react';
import styles from '../DataBase.module.scss';
import refresh from '../../../assets/images/refresh.png';
import addData from '../../../assets/images/addData.png';
import deleteData from '../../../assets/images/deleteData.png';
import save from '../../../assets/images/save.png';
import updateSave from '../../../assets/images/updateSave.png';
import search from '../../../assets/images/search.png';
import { Notification } from '../../../publicComponents/layout/modal/Notification';
import {useDataTab} from "../hooks/useDataTab";

interface DataTabProps {
    selectedTableStructure: TableInnerStructure | undefined;
}

const DataTab: React.FC<DataTabProps> = ({ selectedTableStructure }) => {
    const {
        hooks: { tableStructure, editingCell, editedValue, requestDataList, selectedRow, setTableStructure, setRequestDataList, setSelectedRow },
        handlers: { handleAddData, handleDeleteData, handleCellDoubleClick, handleInputChange, handleInputBlur, handleRefreshClick },
        modals: { isErrorOpen, setIsErrorOpen, isQuestionOpen, setIsQuestionOpen, message }
    } = useDataTab(selectedTableStructure);

    useEffect(() => {
        console.log('요청 데이터 출력', requestDataList);
    }, [requestDataList]);

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
                    <span>
                        {requestDataList.length === 0 ?
                            <img src={save} alt="save" />
                            :
                            <img src={updateSave} alt="updateSave" />
                        }
                        SAVE
                    </span>
                    <span>
                        <img src={search} alt="search" />
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
                                            onDoubleClick={() => handleCellDoubleClick(columnKey, rowIndex, cellData)}
                                            className={selectedRow === rowIndex ? styles.selectedCell : ''}
                                        >
                                            {editingCell && editingCell.columnKey === columnKey && editingCell.rowIndex === rowIndex
                                                ?
                                                <input
                                                    type="text"
                                                    value={editedValue}
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputBlur}
                                                    placeholder={'NULL'}
                                                />
                                                :
                                                <input
                                                    type="text"
                                                    value={cellData.data}
                                                    placeholder={'NULL'}
                                                    readOnly
                                                    className={styles.readOnlyInput}
                                                />
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

            <Notification
                isOpen={isQuestionOpen}
                onClose={() => setIsQuestionOpen(false)}
                type="question"
                message={message}
                onConfirm={() => {
                    setTableStructure(selectedTableStructure);
                    setRequestDataList([]);
                    setSelectedRow(null);
                }}
            />

            <Notification
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                type="error"
                message={message}
            />
        </>
    );
};

export default DataTab;
