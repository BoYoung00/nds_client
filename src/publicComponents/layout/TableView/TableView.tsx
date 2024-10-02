import React from 'react';
import styles from './TableView.module.scss';

interface TableViewProps {
    tableStructure: TableInnerStructure | null;
    useAltStyle?: boolean;
    isFilter?: boolean;
    attributeNames?: string[];
    setAttributeNames?: React.Dispatch<React.SetStateAction<string[]>>; // 추가
}

const TableView: React.FC<TableViewProps> = ({ tableStructure, useAltStyle = true, isFilter = false, attributeNames = [], setAttributeNames }) => {
    if (!tableStructure) return null;

    const columns = Object.keys(tableStructure);
    const numRows = tableStructure[columns[0]]?.length || 0;

    const handleCheckboxChange = (columnName: string) => {
        if (!setAttributeNames) return;

        setAttributeNames(prev => {
            if (prev.includes(columnName)) {
                // 이미 존재하면 제거
                return prev.filter(name => name !== columnName);
            } else {
                // 존재하지 않으면 추가
                return [...prev, columnName];
            }
        });
    };

    return (
        <div className={useAltStyle ? styles.tableView : styles.altTableView}>
            <main className={useAltStyle ? styles.tableView__main : styles.altTableView__main}>
                <table>
                    <thead>
                    <tr>
                        {columns.map((columnKey, index) => {
                            const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                            const columnName = columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
                            const isChecked = attributeNames.includes(columnName); // 체크 여부 확인

                            return (
                                <th key={index} onClick={() => handleCheckboxChange(columnName)}>
                                    {columnName}
                                    {isFilter && (
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => e.stopPropagation()} // input의 onChange 이벤트가 th의 클릭 이벤트와 중복 실행되지 않도록 방지
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
