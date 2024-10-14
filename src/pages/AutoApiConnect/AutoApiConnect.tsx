import React, {useEffect, useState} from "react";
import LineTitle from "../../publicComponents/UI/LineTitle";
import styles from "./AutoApiConnect.module.scss";
import CreateApiFunction from "./Components/CreateApiFunction";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import ApiViewModal from "./Components/ApiViewModal";
import {deleteAPIConnCode, getAllAPIConnCodes} from "../../services/api";

interface AutoApiConnectProps {

}

const AutoApiConnect:React.FC<AutoApiConnectProps> = () => {
    const [apiData, setApiData] = useState<ApiConnInfoResponse[]>([]);
    const [selectedApiId, setSelectedApiId] = useState<number | null >(null);

    const [isOpenCreateApiFunctionModal, setIsOpenCreateApiFunctionModal] = useState<boolean>(false);
    const [isItemInfoModalOpen, setIsItemInfoModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const handleRemoveApi = () => {
        setQuestionMessage('해당 함수를 삭제하시겠습니까?');
    };

    const fetchGetApiInfos =  async () => {
        try {
            const response = await getAllAPIConnCodes();
            setApiData(response);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    }

    const fetchDeleteAPIConnCode =  async () => {
        if (!selectedApiId) return;
        try {
            await deleteAPIConnCode(selectedApiId);
            setApiData((prev) => prev.filter((api) => api.id !== selectedApiId));
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    }

    useEffect(() => {
        fetchGetApiInfos();
    }, [])

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
                        { apiData && apiData.map((api) =>
                            <div
                                className={styles.item}
                                onClick={() => {
                                    setSelectedApiId(api.id);
                                    setIsItemInfoModalOpen(true); // 클릭 시 모달 열기
                                }}
                            >
                                <h2>{api.functionTitle}</h2>
                                <p>{api.functionDescription}</p>
                                <button
                                    className={styles.closeButton}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 클릭 이벤트 전파 차단
                                        handleRemoveApi(); // 삭제 처리
                                    }}
                                >X</button>
                            </div>
                        )}
                    </main>
                </section>
            </div>

            <CreateApiFunction
                isOpenModal={isOpenCreateApiFunctionModal}
                onCloseModal={setIsOpenCreateApiFunctionModal}
                setApiData={setApiData}
            />

            {/* 선택된 아이템 정보 모달 */}
            <ApiViewModal
                isOpen={isItemInfoModalOpen}
                onClose={() => setIsItemInfoModalOpen(false)}
                apiId={selectedApiId}
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
                    fetchDeleteAPIConnCode();
                }}
            /> }
        </>
    );
};

export default AutoApiConnect;