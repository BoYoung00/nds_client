import React, { useEffect, useState } from 'react';
import styles from '../DataBase.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import { findColumnInfo } from "../../../utils/utils";
import TableView from "../../../publicComponents/layout/TableView";

interface LikeTabProps {
    selectedTable: TableData | null;
}

const LikeTab: React.FC<LikeTabProps> = ({ selectedTable }) => {
    const [tableStructure, setTableStructure] = useState<TableInnerStructure | null>(null);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(['']);
    const [selectedColumnData, setSelectedColumnData] = useState<{ id: number, columnHash: string, type: string }[]>([]);
    const [inputValues, setInputValues] = useState<string[]>(['']);
    const [selectOptions, setSelectOptions] = useState<string[]>(['']);

    useEffect(() => {
        if (selectedTable) {
            setTableStructure(selectedTable.tableInnerStructure);
        }
    }, [selectedTable]);

    useEffect(() => {
        if (tableStructure) {
            const names = Object.keys(tableStructure).map(key => {
                const columnInfo = findColumnInfo(key);
                return columnInfo.name;
            });
            setColumnNames(names);
        }
    }, [tableStructure]);

    const handleSelectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = event.target.value;
        const updatedSelectedColumns = [...selectedColumns];
        updatedSelectedColumns[index] = selectedName;
        setSelectedColumns(updatedSelectedColumns);

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
        setSelectedColumns([...selectedColumns, '']);
        setSelectedColumnData([...selectedColumnData, { id: 0, columnHash: '', type: '' }]);
        setInputValues([...inputValues, '']);
        setSelectOptions([...selectOptions, '']);
    };

    const removeSelectBox = () => {
        if (selectedColumns.length > 1) {
            const updatedSelectedColumns = [...selectedColumns];
            const updatedSelectedColumnData = [...selectedColumnData];
            const updatedInputValues = [...inputValues];
            const updatedSelectOptions = [...selectOptions];

            updatedSelectedColumns.pop();
            updatedSelectedColumnData.pop();
            updatedInputValues.pop();
            updatedSelectOptions.pop();

            setSelectedColumns(updatedSelectedColumns);
            setSelectedColumnData(updatedSelectedColumnData);
            setInputValues(updatedInputValues);
            setSelectOptions(updatedSelectOptions);
        }
    };

    const getFilterRequests = (): FilterRequest[] => {
        return selectedColumns.map((_, index) => {
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
    };

    if (!tableStructure) return null;

    return (
        <div className={styles.LikeTab}>
            <section className={styles.filterContainer}>
                <span onClick={addSelectBox}>+</span> <span onClick={removeSelectBox}>-</span>
                {selectedColumns.map((selectedColumnName, index) => (
                    <div key={index}>
                        <select value={selectedColumnName} onChange={(event) => handleSelectChange(index, event)}>
                            <option value="">행 선택</option>
                            {columnNames.map(name => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        {selectedColumnData[index] && (
                            <div>
                                {['INTEGER', 'REAL'].includes(selectedColumnData[index].type) ? (
                                    <>
                                        <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                        <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                            <option value="">옵션 선택</option>
                                            <option value="GREATER">{'GREATER <'}</option>
                                            <option value="LESS">{'LESS >'}</option>
                                            <option value="EQUAL">{'EQUAL ='}</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                        <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                            <option value="">옵션 선택</option>
                                            <option value="FIRST">First</option>
                                            <option value="INCLUDE">INCLUDE</option>
                                            <option value="LAST">Last</option>
                                        </select>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <button onClick={() => console.log(getFilterRequests())}>필터 상태 저장하기</button>
            </section>
            <img className={styles.doubleArrowImg} src={doubleArrow} alt="화살표" />
            <section className={styles.previewContainer}>
                <TableView tableStructure={tableStructure} />
            </section>
        </div>
    );
};

export default LikeTab;
