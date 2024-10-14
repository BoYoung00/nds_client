import React, { useState, useEffect } from 'react';
import styles from './TableView.module.scss';

interface TableViewProps {
    tableStructure: TableInnerStructure | null;
    useAltStyle?: boolean;
    isFilter?: boolean;
    attributeNames?: string[];
    setAttributeNames?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TableView: React.FC<TableViewProps> = ({ tableStructure, useAltStyle = true, isFilter = false, attributeNames = [], setAttributeNames }) => {
    const [isAllChecked, setIsAllChecked] = useState(false);

    const columns = tableStructure ? Object.keys(tableStructure) : [];
    const numRows = tableStructure && columns.length > 0 ? tableStructure[columns[0]]?.length || 0 : 0;

    const handleCheckboxChange = (columnName: string) => {
        if (!setAttributeNames) return;

        setAttributeNames(prev => {
            if (prev.includes(columnName)) {
                return prev.filter(name => name !== columnName);
            } else {
                return [...prev, columnName];
            }
        });
    };

    const handleAllCheckboxChange = () => {
        if (!setAttributeNames) return;

        if (isAllChecked) {
            setAttributeNames([]);
        } else {
            const allColumnNames = columns.map((columnKey, index) => {
                const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                return columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
            });
            setAttributeNames(allColumnNames);
        }

        setIsAllChecked(!isAllChecked);
    };

    useEffect(() => {
        if (tableStructure && columns.length > 0) {
            const allColumnNames = columns.map((columnKey, index) => {
                const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                return columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
            });
            setIsAllChecked(attributeNames.length === allColumnNames.length);
        }
    }, [attributeNames, columns, tableStructure]); // tableStructure를 의존성에 추가

    if (!tableStructure) return null;

    return (
        <div className={useAltStyle ? styles.tableView : styles.altTableView}>
            <main className={useAltStyle ? styles.tableView__main : styles.altTableView__main}>
                <table>
                    <thead>
                    <tr>
                        {isFilter && (
                            <th className={styles.allSelect} onClick={handleAllCheckboxChange}>
                                전체<br />선택
                                <input
                                    type="checkbox"
                                    checked={isAllChecked}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleAllCheckboxChange();
                                    }}
                                />
                            </th>
                        )}
                        {columns.map((columnKey, index) => {
                            const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                            const columnName = columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
                            const isChecked = attributeNames.includes(columnName);

                            return (
                                <th key={index} onClick={() => handleCheckboxChange(columnName)}>
                                    {columnName}
                                    {isFilter && (
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => e.stopPropagation()}
                                        />
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(numRows)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {isFilter && <td style={{minWidth: '1rem'}} />}
                            {columns.map((columnKey, colIndex) => {
                                const cellData = tableStructure[columnKey][rowIndex] || { id: null, data: '', dataType: '' };
                                return (
                                    <td key={colIndex} className={useAltStyle ? styles.readOnlyInput : styles.altReadOnlyInput}>
                                        {cellData.data ? cellData.data : 'NULL'}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default TableView;
