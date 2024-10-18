import React, {useEffect, useState} from "react";
import styles from "./DBMSConnenct.module.scss";
import LineTitle from "../../publicComponents/UI/LineTitle";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import DBMSModal from "./Components/DBMSModal";
import {getAllDBMSInfo} from "../../services/api";

const DBMSConnect:React.FC = () => {
    const [dbmsInfos, setDbmsInfos] = useState<DBMSDtoRequest[]>([]);
    const [selectedDbmsInfo, setSelectedDbmsInfo] = useState<DBMSDtoRequest>();

    const [isOpenCreateDBConnectModal, setIsOpenCreateDBConnectModal] = useState<boolean>(false);
    const [isItemInfoModalOpen, setIsItemInfoModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchDbmsInfos = async () => {
        try {
            const response = await getAllDBMSInfo();
            console.log('리스트', response)
            setDbmsInfos(response);
        } catch (e) {
            console.error(e);
            setErrorMessage('알 수 없는 오류가 발생하였습니다.');
        }
    };

    useEffect(() => {
        fetchDbmsInfos();
    }, [])

    return (
        <>
            <div className={styles.DBMSConnect}>
                <section className={styles.DBMSConnect__container}>
                    <header>
                        <LineTitle
                            text="DBMS Connection"
                            fontSize="2rem"
                            smallText="D-SIM에서 만든 데이터베이스와 기존 DBMS를 상호 연결하여 유연한 데이터 관리 환경을 구축하세요."
                            isCenter
                        >
                            <div className={styles.createButWrap}>
                                <button
                                    className={styles.createBut}
                                    onClick={() => setIsOpenCreateDBConnectModal(true)}
                                >
                                    ADD Connector
                                </button>
                            </div>
                        </LineTitle>
                    </header>
                    <main>
                        {dbmsInfos.length !== 0 ?
                            dbmsInfos.map((info, index) => (
                                <div
                                    key={index}
                                    className={styles.item}
                                    onClick={() => {
                                        setSelectedDbmsInfo(info);
                                        setIsItemInfoModalOpen(true);
                                    }}
                                >
                                    <section className={styles.itemInfo}>
                                        <h2>{info.name}</h2>
                                        <p>{info.description}</p>
                                    </section>
                                    <section className={styles.itemAction}>
                                        <div className={styles.runButWrap}>
                                            <button>RUN</button>
                                        </div>
                                        <div className={styles.IMEXWrap}>
                                            <p>IMPORT</p>
                                            <p>EXPORT</p>
                                        </div>
                                    </section>
                                </div>
                            ))
                            :
                            <div style={{width:'100%', height: '100%', textAlign:'center'}}>
                                <p style={{color: 'gray'}}>DBMS 연결 정보가 없습니다.</p>
                            </div>
                        }
                    </main>
                </section>
            </div>

            <DBMSModal
                isOpenModal={isOpenCreateDBConnectModal}
                onCloseModal={setIsOpenCreateDBConnectModal}
                setDbmsInfos={setDbmsInfos}
            />

            <DBMSModal
                isOpenModal={isItemInfoModalOpen}
                onCloseModal={setIsItemInfoModalOpen}
                setDbmsInfos={setDbmsInfos}
                isUpdateModel={true}
                selectedDbmsInfo={selectedDbmsInfo}
            />

            {successMessage && (
                <Notification
                    onClose={() => setSuccessMessage(null)}
                    type="success"
                    message={successMessage}
                />
            )}

            {errorMessage && (
                <Notification
                    onClose={() => setErrorMessage(null)}
                    type="error"
                    message={errorMessage}
                />
            )}
        </>
    );
};


export default DBMSConnect;