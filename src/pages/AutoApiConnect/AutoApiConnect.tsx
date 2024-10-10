import React, {useState} from "react";
import LineTitle from "../../publicComponents/UI/LineTitle";
import styles from "./AutoApiConnect.module.scss";
import CreateApiFunction from "./Components/CreateApiFunction";

interface AutoApiConnectProps {

}

const AutoApiConnect:React.FC<AutoApiConnectProps> = () => {
    const [isOpenCreateApiFunctionModal, setIsOpenCreateApiFunctionModal] = useState<boolean>(false);
    const [selectedApiId, setSelectedApiId] = useState<number | null >(null);

    return (
        <>
            <div className={styles.autoApiConnect}>
                <section className={styles.autoApiConnect__container}>
                    <header>
                        <LineTitle
                            text="AUTO API CONNECT"
                            fontSize="2rem"
                            smallText="REST API 연결 코드를 자동으로 생성하여 작업 효율성을 극대화 해보세요."
                            isCenter
                        >
                            <div className={styles.createFunButWrap}>
                                <button  className={styles.createFunBut} onClick={() => setIsOpenCreateApiFunctionModal(true)}>함수 생성</button>
                            </div>
                        </LineTitle>
                    </header>
                    <main>
                        <div className={styles.item} onClick={() => setSelectedApiId(1)}>
                            <h2>테이블 함수1</h2>
                            <p>테이블 함수1 설명</p>
                        </div>
                    </main>
                </section>
            </div>
            <CreateApiFunction isOpenModal={isOpenCreateApiFunctionModal} onCloseModal={setIsOpenCreateApiFunctionModal} />
        </>
    );
};

export default AutoApiConnect;