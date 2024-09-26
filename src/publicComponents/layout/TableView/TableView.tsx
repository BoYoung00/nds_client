import React from 'react';
import styles from './TableView.module.scss';

interface TableViewProps {
    tableStructure: TableInnerStructure | null;
    useAltStyle?: boolean;
}

const TableView: React.FC<TableViewProps> = ({ tableStructure, useAltStyle = true }) => {
    if (!tableStructure) return null;

    const columns = Object.keys(tableStructure);
    const numRows = tableStructure[columns[0]]?.length || 0;

    return (
        <div className={useAltStyle ? styles.tableView : styles.altTableView}>
            <main className={useAltStyle ? styles.tableView__main : styles.altTableView__main}>
                <table>
                    <thead>
                    <tr>
                        {columns.map((columnKey, index) => {
                            const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                            const columnName = columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
                            return <th key={index}>{columnName}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {[...Array(numRows)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((columnKey, colIndex) => {
                                const cellData = tableStructure[columnKey][rowIndex] || { id: null, data: '', dataType: '' };
                                return (
                                    <td key={colIndex} >
                                        <input
                                            type="text"
                                            value={cellData.data}
                                            readOnly
                                            className={useAltStyle ? styles.readOnlyInput : styles.altReadOnlyInput}
                                            placeholder="NULL"
                                        />
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
