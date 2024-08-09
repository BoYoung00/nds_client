import React, {useEffect, useState} from 'react';
import styles from '../DataBase.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import {findColumnInfo} from "../../../utils/utils";
import TableView from "../../../publicComponents/layout/TableView";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {getUserLikeFilters, saveFilteredTableData} from "../../../services/api";

interface LikeTabProps {
    selectedTable: TableData | null;
}

const LikeTab: React.FC<LikeTabProps> = ({ selectedTable }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const [tableStructure, setTableStructure] = useState<TableInnerStructure | null>(null);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(['']);
    const [selectedColumnData, setSelectedColumnData] = useState<{ id: number, columnHash: string, type: string }[]>([]);
    const [inputValues, setInputValues] = useState<string[]>(['']);
    const [selectOptions, setSelectOptions] = useState<string[]>(['']);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedTable) {
            setTableStructure(selectedTable.tableInnerStructure);
            fetchFilters(selectedTable.tableHash);
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

    const fetchFilters = async (tableHash: string) => {
        try {
            setLoading(true);
            const data = await getUserLikeFilters(tableHash);
            console.log(data)
            initializeFilters(data);  // 필터 데이터 초기화 함수 호출
        } catch (error) {
            setErrorMessage('필터 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const initializeFilters = (data: FilterResponse[]) => {
        if (data.length === 0) return;

        const newSelectedColumns = data.map(filter => filter.filterColumnName);
        const newSelectedColumnData = data.map(filter => {
            return {
                id: filter.filterColumnID,
                columnHash: filter.filterColumnHash,
                type: filter.filterType === 1 ? 'INTEGER' : 'TEXT'
            };
        });
        const newInputValues = data.map(filter => filter.filterValue);
        const newSelectOptions = data.map(filter => filter.option);

        setSelectedColumns(newSelectedColumns);
        setSelectedColumnData(newSelectedColumnData);
        setInputValues(newInputValues);
        setSelectOptions(newSelectOptions);
    };

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
            setSelectedColumns(selectedColumns.slice(0, -1));
            setSelectedColumnData(selectedColumnData.slice(0, -1));
            setInputValues(inputValues.slice(0, -1));
            setSelectOptions(selectOptions.slice(0, -1));
        }
    };

    const validateFilters = (): boolean => {
        for (let i = 0; i < selectedColumns.length; i++) {
            if (selectedColumns[i] === '') {
                setErrorMessage("행을 선택해주세요.");
                return false;
            }
            if (selectOptions[i] === '') {
                setErrorMessage("옵션을 선택해주세요.");
                return false;
            }
        }
        return true;
    };

    const fetchFilterSave = async () => {
        if (!validateFilters() || !selectedTable?.tableHash) return;

        const filterRequests = selectedColumns.map((_, index) => {
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

        try {
            setLoading(true);
            await saveFilteredTableData(selectedTable.tableHash, filterRequests);
            setSuccessMessage("필터 저장에 성공하셨습니다.")
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!tableStructure) return null;

    return (
        <>
            <div className={styles.LikeTab}>
                <section className={styles.filterContainer}>
                    <section className={styles.addRemoveButBox}>
                        <span onClick={addSelectBox}>+</span>
                        <span onClick={removeSelectBox}>-</span>
                    </section>
                    <section className={styles.filterBox}>
                        {selectedColumns.map((selectedColumnName, index) => (
                            <div className={styles.filterInputBox} key={index}>
                                <label>
                                    <span>Column</span>
                                    <select value={selectedColumnName} onChange={(event) => handleSelectChange(index, event)} >
                                        <option value="">행 선택</option>
                                        {columnNames.map(name => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className={styles.filterSelectBox}>
                                    {['INTEGER', 'REAL'].includes(selectedColumnData[index]?.type) ? (
                                        <>
                                            <label>
                                                <span>Number</span>
                                                <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                            </label>
                                            <label>
                                                <span>Option</span>
                                                <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                                    <option value="">옵션 선택</option>
                                                    <option value="GREATER">{'<'}</option>
                                                    <option value="LESS">{'>'}</option>
                                                    <option value="EQUAL">{'='}</option>
                                                </select>
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <label>
                                                <span>Word</span>
                                                <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                            </label>
                                            <label>
                                                <span>Option</span>
                                                <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                                    <option value="">옵션 선택</option>
                                                    <option value="FIRST">First</option>
                                                    <option value="INCLUDE">INCLUDE</option>
                                                    <option value="LAST">Last</option>
                                                </select>
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                    <section className={styles.saveButBox}>
                        <span>※ 해당 상태는 REST API에서 데이터를 가지고 올 때 적용 되는 필터입니다.</span>
                        <button onClick={fetchFilterSave}>필터 상태 저장하기</button>
                    </section>
                </section>
                <img className={styles.doubleArrowImg} src={doubleArrow} alt="화살표" />
                <section className={styles.previewContainer}>
                    <TableView tableStructure={tableStructure} />
                </section>
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

export default LikeTab;
