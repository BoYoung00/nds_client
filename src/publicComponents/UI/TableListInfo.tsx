import styles from './Ui.module.scss';
import React from "react";

interface TableListInfoProps {
    tableList: string[];
    selectedTableName: string | null;
    setSelectedTableName: (name: string) => void;
}

const TableListInfo: React.FC<TableListInfoProps> = ({tableList, selectedTableName, setSelectedTableName}) => {

    return (
        <div className={styles.tableListInfo}>
            <ul>
                {tableList.map((table, index) => (
                    <li
                        key={index}
                        className={selectedTableName === table ? styles.selected : ''}
                        onClick={() => setSelectedTableName(table)}
                    >
                        {table}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableListInfo;