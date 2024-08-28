import styles from './Ui.module.scss';
import React, {useState} from "react";

interface TableListInfoProps {
    tableList: any[];
}

const TableListInfo: React.FC<TableListInfoProps> = ({tableList}) => {
    const [selectedTable, setSelectedTable] = useState<number | null>(null); // 선택된 li의 인덱스를 관리

    return (
        <div className={styles.tableListInfo}>
            <ul>
                {tableList.map((table, index) => (
                    <li
                        key={index}
                        className={selectedTable === index ? styles.selected : ''}
                        onClick={() => setSelectedTable(index)} // 통신 연결하면 바꾸기
                    >
                        {table}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableListInfo;