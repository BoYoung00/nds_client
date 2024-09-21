import React, {useState} from 'react';
import styles from '../DBMode.module.scss';
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";
import {useDataBaseWhiteSidebar} from "../hooks/useDataBaseWhiteSidebar";
import {useDataBase} from "../../../contexts/DataBaseContext";
import Merge from "../../../publicComponents/layout/modal/Merge/Merge";
import {useTable} from "../../../contexts/TableContext";
import edit from "../../../assets/images/edit.png";

const DataBaseWhiteSidebar: React.FC = () => {
    const { selectedDataBase } = useDataBase();
    const { tables, selectedTable } = useTable();

    const {
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        isOpenMergeModal,
        setIsOpenMergeModal,
        errorMessage,
        setErrorMessage,
        onSelected,
        handleMerge,
        handleDelete,
        FetchDelete,
        comment,
        handleCommentChange,
        handleCommentBlur,
        questionMessage,
        setQuestionMessage,
        successMessage,
        setSuccessMessage
    } = useDataBaseWhiteSidebar();

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCommentChange(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        handleCommentBlur();
    };

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.whiteSidebar}`}>
                <section className={styles.tablesBox}>
                    {tables && tables.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedTable === item ? styles.selected : ''}`}
                            onClick={() => onSelected(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                    {selectedDataBase &&
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
                            {isEditing ? (
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
                        <button onClick={handleMerge}>테이블 병합</button>
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

            {/*성공 모달*/}
            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            {/* 오류 모달 */}
            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}

            {/*테이블 삭제*/}
            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={FetchDelete}
            /> }
        </>
    );
};

export default DataBaseWhiteSidebar;
