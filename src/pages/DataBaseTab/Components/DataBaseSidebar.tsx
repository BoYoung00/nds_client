import React, {useState} from 'react';
import styles from '../DataBase.module.scss';
import {DBQueryExtraction} from "../../../publicComponents/layout/modal/DBQueryExtraction";
import {CreateDB} from "../../../publicComponents/layout/modal/CreateDB";

interface DataBaseSidebarProps {
    dataBases?: DataBaseEntity[],
    setSelectedDataBaseID: (id: number) => void;
}

const DataBaseSidebar:React.FC<DataBaseSidebarProps> = ({dataBases, setSelectedDataBaseID}) => {
    const [selectedId, setSelectedId] = useState(-1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);

    const onSelected = (id: number) => {
        setSelectedId(id);
        setSelectedDataBaseID(id);
    }

    return (
        <>
            <div className={styles.dataBaseSidebar}>
                <section>
                    {dataBases && dataBases.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.item} ${selectedId === item.id ? styles.selected : ''}`}
                            onClick={() => onSelected(item.id!!)}
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
                        <button onClick={() => setIsOpenQueryModal(true)}>쿼리 추출</button>
                        {/*DB 삭제 구현하기*/}
                        <button onClick={() => selectedId === -1 ? alert("선택된 데이터베이스가 없습니다.") : '삭제 로직'}>데이터베이스 삭제</button>
                    </section>
                </footer>
            </div>

            {/*DB 생성 모달*/}
            <CreateDB
                isOpenModal={isOpenCreateDBModal}
                onCloseModal={() => setIsOpenCreateDBModal(false)}
            />

            {/*쿼리 추출 모달*/}
            <DBQueryExtraction
                isOpenModal={isOpenQueryModal}
                onCloseModal={() => setIsOpenQueryModal(false)}
            />
        </>

    );
};

export default DataBaseSidebar;