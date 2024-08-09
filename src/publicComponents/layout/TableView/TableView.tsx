import React from 'react';
import styles from './TableView.module.scss';

interface TableViewProps {
    tableStructure: TableInnerStructure | null;
}

const TableView: React.FC<TableViewProps> = ({ tableStructure }) => {
    if (!tableStructure) return null;

    const columns = Object.keys(tableStructure);
    const numRows = tableStructure[columns[0]]?.length || 0;

    return (
        <div className={styles.tableView}>
            <main className={styles.tableView__main} style={{border: 'none', overflow: 'none',}}>
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
                                            className={styles.readOnlyInput}
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
