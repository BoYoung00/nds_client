import React, {useState} from 'react';
import styles from '../DataBase.module.scss';
import { DBQueryExtraction } from "../../../publicComponents/layout/modal/DBQueryExtraction";
import { CreateDB } from "../../../publicComponents/layout/modal/CreateDB";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import { useDataBaseBlueSidebar } from "../hooks/useDataBaseBlueSidebar";
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";

interface DataBaseWhiteSidebarProps {
    tables?: DataBaseEntity[],
    setSelectedTableID: (id: number) => void;
}

const DataBaseWhiteSidebar: React.FC<DataBaseWhiteSidebarProps> = ({ tables, setSelectedTableID }) => {
    const [selectedId, setSelectedId] = useState(-1);
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    const [isOpenMergeModal, setIsOpenMergeModal] = useState<boolean>(false);
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

    const onSelected = (id: number) => {
        setSelectedId(id);
        setSelectedTableID(id);
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

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.whiteSidebar}`}>
                <section className={styles.tablesBox}>
                    {tables && tables.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
                            onClick={() => onSelected(item.id!!)}
                        >
                            {item.name}
                        </div>
                    ))}
                    <button className={styles.createButton} onClick={() => setIsOpenCreateTableModal(true)}>
                        CREATE DATABASE +
                    </button>
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
                message="선택한 데이터베이스가 없습니다."
            />
        </>
    );
};

export default DataBaseWhiteSidebar;
