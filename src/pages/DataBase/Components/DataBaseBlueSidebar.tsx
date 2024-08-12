import React from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {CreateDB} from "../../../publicComponents/layout/modal/CreateDB";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useDataBaseBlueSidebar} from "../hooks/useDataBaseBlueSidebar";


const DataBaseBlueSidebar: React.FC = () => {
    const {
        databases,
        setDatabases,
        selectedId,
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
        }
    } = useDataBaseBlueSidebar();

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.blueSidebar}`}>
                <section>
                    {databases && databases.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
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
                        <p>데이터베이스 설명</p>
                        <span>{databases?.find(dataBase => dataBase.id === selectedId)?.comment} </span>
                    </section>
                    <section className={styles.buttonBox}>
                        <button onClick={handleQuery}>쿼리 추출</button>
                        <button onClick={handleScript}>파일 스크립트 다운로드</button>
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
