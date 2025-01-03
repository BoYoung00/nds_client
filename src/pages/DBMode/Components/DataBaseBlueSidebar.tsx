import React, { useState } from 'react';
import styles from '../DBMode.module.scss';
import { DBQueryExtraction } from "../../../publicComponents/layout/modal/DBQueryExtraction";
import { CreateDB } from "../../../publicComponents/layout/modal/CreateDB";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import { useDataBaseBlueSidebar } from "../hooks/useDataBaseBlueSidebar";
import { useDataBase } from "../../../contexts/DataBaseContext";
import edit from "../../../assets/images/edit.webp"

const DataBaseBlueSidebar: React.FC = () => {
    const { databases, selectedDataBase } = useDataBase();

    const {
        comment,
        modals: {
            isOpenCreateDBModal,
            setIsOpenCreateDBModal,
            isOpenQueryModal,
            setIsOpenQueryModal,
            errorMessage,
            setErrorMessage,
        },
        handlers: {
            onSelected,
            handleQuery,
            handleScript,
            handleDelete,
            handleCommentChange,
            handleCommentBlur,
        }
    } = useDataBaseBlueSidebar();

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleCommentChange(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        handleCommentBlur();
    };

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.blueSidebar}`}>
                <section>
                    {databases && databases.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedDataBase?.id === item.id ? styles.selected : ''}`}
                            onClick={() => onSelected(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                    {(databases?.length ?? 0) <= 3 && (
                        <button className={styles.createButton} onClick={() => setIsOpenCreateDBModal(true)}>
                            CREATE DATABASE +
                        </button>
                    )}
                </section>

                <footer>
                    <section className={styles.commentBox}>
                        <div className={styles.commentTitle}>
                            <p>데이터베이스 설명</p>
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
                        {/*<button onClick={handleQuery}>쿼리 추출</button>*/}
                        <button onClick={handleScript}>.nds 파일 다운로드</button>
                        <button onClick={handleDelete}>데이터베이스 삭제</button>
                    </section>
                </footer>
            </div>

            {/* DB 생성 모달 */}
            <CreateDB
                isOpenModal={isOpenCreateDBModal}
                onCloseModal={() => setIsOpenCreateDBModal(false)}
            />

            {/* 쿼리 추출 모달 */}
            <DBQueryExtraction
                isOpenModal={isOpenQueryModal}
                onCloseModal={() => setIsOpenQueryModal(false)}
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

export default DataBaseBlueSidebar;
