import React from "react";
import styles from '../DataBase.module.scss';
import refresh from "../../../assets/images/refresh.png";
import addData from "../../../assets/images/addData.png";
import deleteData from "../../../assets/images/deleteData.png";
import save from "../../../assets/images/save.png";
import search from "../../../assets/images/search.png";

interface DataTabProps {
    selectedTable: TableData | null;
}

const DataTab: React.FC<DataTabProps> = ({ selectedTable }) => {
    if (!selectedTable) return null;

    const columns = Object.keys(selectedTable.tableInnerStructure);

    return (
        <div className={styles.dataTab}>
            <header className={styles.dataTab__header}>
                <span>
                    <img className={styles.refresh} src={refresh} alt="refresh" />
                    REFRESH
                </span>
                <span>
                    <img className={styles.addData} src={addData} alt="addData" />
                    ADD_DATA
                </span>
                <span>
                    <img className={styles.deleteData} src={deleteData} alt="deleteData" />
                    DELETE_DATA
                </span>
                <span>
                    <img className={styles.save} src={save} alt="save" />
                    SAVE
                </span>
                <span>
                    <img className={styles.search} src={search} alt="search" />
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
                            return (
                                <th key={index}>{columnName}</th>
                            );
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {selectedTable.tableInnerStructure[columns[0]].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((columnKey) => {
                                const cellData = selectedTable.tableInnerStructure[columnKey][rowIndex];
                                return <td key={cellData.id}>{cellData.data}</td>;
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default DataTab;
