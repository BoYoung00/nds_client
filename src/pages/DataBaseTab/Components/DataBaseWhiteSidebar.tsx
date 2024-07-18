import React, {useEffect, useState} from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";

interface DataBaseWhiteSidebarProps {
    tables?: TableEntity[];
    setSelectedTable: (table: TableEntity) => void;
    parentsDataBase: DataBaseEntity | null;
}

const DataBaseWhiteSidebar: React.FC<DataBaseWhiteSidebarProps> = ({ tables=[], setSelectedTable, parentsDataBase }) => {
    const [selectedId, setSelectedId] = useState(-1);
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

    const onSelected = (table: TableEntity) => {
        setSelectedId(table.id!!);
        setSelectedTable(table);
    }

    const handleQuery = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            setIsOpenMergeModal(true);
        }
    }

    const handleDelete = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            console.log('삭제 로직');
        }
    }

    useEffect(()=> {
        console.log(parentsDataBase)
    }, [parentsDataBase]);


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
                            CREATE DATABASE +
                        </button>
                    }
                </section>

                <footer>
                    <section className={styles.commentBox}>
                        <p>테이블 설명</p>
                        <span>{tables?.find(dataBase => dataBase.id == selectedId)?.comment} </span>
                    </section>
                    <section className={styles.buttonBox}>
                        <button onClick={handleQuery}>테이블 병합</button>
                        <button onClick={handleDelete}>테이블 삭제</button>
                    </section>
                </footer>
            </div>

            {/* DB 생성 모달 */}
            <CreateTable
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
            <Notification
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                type="error"
                message="선택한 테이블이 없습니다."
            />
        </>
    );
};

export default DataBaseWhiteSidebar;
