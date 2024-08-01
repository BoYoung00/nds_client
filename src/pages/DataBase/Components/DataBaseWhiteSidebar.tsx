import React, {useEffect, useState} from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";
import {useDataBaseWhiteSidebar} from "../hooks/useDataBaseWhiteSidebar";

interface DataBaseWhiteSidebarProps {
    tables: TableData[];
    setTables: React.Dispatch<React.SetStateAction<TableData[]>>;
    setSelectedTable: React.Dispatch<React.SetStateAction<TableData | null>>;
    parentsDataBase: DataBaseEntity | null;
}

const DataBaseWhiteSidebar: React.FC<DataBaseWhiteSidebarProps> = ({tables, setTables, setSelectedTable, parentsDataBase }) => {
    const {
        selectedId,
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        errorMessage,
        setErrorMessage,
        onSelected,
        handleQuery,
        handleDelete
    } = useDataBaseWhiteSidebar(setSelectedTable, tables);

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.whiteSidebar}`}>
                <section className={styles.tablesBox}>
                    {tables && tables.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
                            onClick={() => onSelected(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                    { parentsDataBase &&
                        <button className={styles.createButton} onClick={() => setIsOpenCreateTableModal(true)}>
                            CREATE TABLE +
                        </button>
                    }
                </section>

                <footer>
                    <section className={styles.commentBox}>
                        <p>테이블 설명</p>
                        <span>{tables?.find(dataBase => dataBase.id === selectedId)?.comment} </span>
                    </section>
                    <section className={styles.buttonBox}>
                        <button onClick={handleQuery}>테이블 병합</button>
                        <button onClick={handleDelete}>테이블 삭제</button>
                    </section>
                </footer>
            </div>

            {/* 테이블 생성 모달 */}
            <CreateTable
                setTables={setTables}
                isOpenModal={isOpenCreateTableModal}
                onCloseModal={() => setIsOpenCreateTableModal(false)}
                dataBase={parentsDataBase}
            />

            {/* 쿼리 추출 모달 */}
            <DBQueryExtraction
                isOpenModal={isOpenMergeModal}
                onCloseModal={() => setIsOpenMergeModal(false)}
            />

            {/* 오류 모달 */}
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default DataBaseWhiteSidebar;
