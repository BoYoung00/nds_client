import React from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {CreateDB} from "../../../publicComponents/layout/modal/CreateDB";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useDataBaseBlueSidebar} from "../hooks/useDataBaseBlueSidebar";

interface DataBaseBlueSidebarProps {
    dataBases?: DataBaseEntity[],
    setSelectedDataBase: (dataBase: DataBaseEntity) => void;
}

const DataBaseBlueSidebar: React.FC<DataBaseBlueSidebarProps> = ({ dataBases, setSelectedDataBase }) => {
    const {
        selectedId,
        modals: {
            isOpenCreateDBModal,
            setIsOpenCreateDBModal,
            isOpenQueryModal,
            setIsOpenQueryModal,
            isErrorOpen,
            setIsErrorOpen,
        },
        handlers: {
            onSelected,
            handleQuery,
            handleScript,
            handleDelete,
        }
    } = useDataBaseBlueSidebar(setSelectedDataBase);

    return (
        <>
            <div className={`${styles.dataBaseSidebar} ${styles.blueSidebar}`}>
                <section>
                    {dataBases && dataBases.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
                            onClick={() => onSelected(item)}
                        >
                            {item.name}
                        </div>
                    ))}
                    {(dataBases?.length ?? 0) <= 3 && (
                        <button className={styles.createButton} onClick={() => setIsOpenCreateDBModal(true)}>
                            CREATE DATABASE +
                        </button>
                    )}
                </section>

                <footer>
                    <section className={styles.commentBox}>
                        <p>데이터베이스 설명</p>
                        <span>{dataBases?.find(dataBase => dataBase.id == selectedId)?.comment} </span>
                    </section>
                    <section className={styles.buttonBox}>
                        <button onClick={handleQuery}>쿼리 추출</button>
                        <button onClick={handleScript}>파일 스크립트 추출</button>
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
            <Notification
                isOpen={isErrorOpen}
                onClose={() => setIsErrorOpen(false)}
                type="error"
                message="선택한 데이터베이스가 없습니다."
            />
        </>
    );
};

export default DataBaseBlueSidebar;
