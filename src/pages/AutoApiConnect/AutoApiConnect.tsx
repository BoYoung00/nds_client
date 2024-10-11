import React, {useState} from "react";
import LineTitle from "../../publicComponents/UI/LineTitle";
import styles from "./AutoApiConnect.module.scss";
import CreateApiFunction from "./Components/CreateApiFunction";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import ApiViewModal from "./Components/ApiViewModal";

interface AutoApiConnectProps {

}

const AutoApiConnect:React.FC<AutoApiConnectProps> = () => {
    // const [apiData, setApiData] = useState<ApiConnCodeResponse[]>([]);
    // const selectedApiInfo = apiData.find(api => api.id === selectedApiId) || null;
    const [selectedApiId, setSelectedApiId] = useState<number | null >(null);

    const [isOpenCreateApiFunctionModal, setIsOpenCreateApiFunctionModal] = useState<boolean>(false);
    const [isItemInfoModalOpen, setIsItemInfoModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const handleRemoveApi = () => {
        setQuestionMessage('해당 함수를 삭제하시겠습니까?');
    };

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
                        <div
                            className={styles.item}
                            onClick={() => {
                                setSelectedApiId(1);
                                setIsItemInfoModalOpen(true); // 클릭 시 모달 열기
                            }}
                        >
                            <h2>테이블 함수1</h2>
                            <p>테이블 함수1 설명</p>
                            <button className={styles.closeButton} onClick={handleRemoveApi}>X</button>
                        </div>
                    </main>
                </section>
            </div>
            <CreateApiFunction isOpenModal={isOpenCreateApiFunctionModal} onCloseModal={setIsOpenCreateApiFunctionModal} />

            {/* 선택된 아이템 정보 모달 */}
            <ApiViewModal
                isOpen={isItemInfoModalOpen}
                onClose={() => setIsItemInfoModalOpen(false)}
                apiId={selectedApiId}
                apiInfo={{title: '함수 제목', description: '함수 설명', createCode: '코드'}}
            />

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }

            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={() => {
                    console.log('삭제 로직');
                }}
            /> }
        </>
    );
};

export default AutoApiConnect;