import React, {useState} from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";
import {useDataBaseWhiteSidebar} from "../hooks/useDataBaseWhiteSidebar";
import {useDataBase} from "../../../contexts/DataBaseContext";
import Merge from "../../../publicComponents/layout/modal/Merge/Merge";
import {useTable} from "../../../contexts/TableContext";
import edit from "../../../assets/images/edit.png";

const DataBaseWhiteSidebar: React.FC = () => {
    const { selectedDataBase } = useDataBase();
    const { tables } = useTable();

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
    } = useDataBaseWhiteSidebar(tables);

    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(tables?.find(table => table.id === selectedId)?.comment || '');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        // comment 수정 통신
    };

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
                    { selectedDataBase &&
                        <button className={styles.createButton} onClick={() => setIsOpenCreateTableModal(true)}>
                            CREATE TABLE +
                        </button>
                    }
                </section>

                <footer>
                    <section className={styles.commentBox}>
                        <div className={styles.commentTitle}>
                            <p>테이블 설명</p>
                            <img src={edit} className={styles.editIcon} onClick={() => setIsEditing(true)} />
                        </div>
                        <div className={styles.commentContainer}>
                            { isEditing ? (
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    autoFocus
                                />
                            ) : (
                                <span onDoubleClick={() => setIsEditing(true)}>{comment}</span>
                            )}
                        </div>
                    </section>
                    <section className={styles.buttonBox}>
                        <button onClick={handleQuery}>테이블 병합</button>
                        <button onClick={handleDelete}>테이블 삭제</button>
                    </section>
                </footer>
            </div>

            {/* 테이블 생성 모달 */}
            <CreateTable
                isOpenModal={isOpenCreateTableModal}
                onCloseModal={() => setIsOpenCreateTableModal(false)}
            />

            {/* 병합 모달 */}
            <Merge
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
