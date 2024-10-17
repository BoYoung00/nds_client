import React from "react";
import LineTitle from "../../publicComponents/UI/LineTitle";
import styles from "./AutoApiConnect.module.scss";
import CreateApiFunction from "./Components/CreateApiFunction";
import { Notification } from "../../publicComponents/layout/modal/Notification";
import ApiViewModal from "./Components/ApiViewModal";
import { useAutoApiConnect } from "./hooks/useAutoApiConnect";

interface AutoApiConnectProps {}

const AutoApiConnect: React.FC<AutoApiConnectProps> = () => {
    const {
        hooks: {
            apiData,
            setApiData,
            selectedApiId,
            setSelectedApiId,
            isOpenCreateApiFunctionModal,
            setIsOpenCreateApiFunctionModal,
            isItemInfoModalOpen,
            setIsItemInfoModalOpen,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
            questionMessage,
            setQuestionMessage
        },
        handles: {
            handleRemoveApi,
            fetchDeleteAPIConnCode
        }
    } = useAutoApiConnect();

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
                                <button
                                    className={styles.createFunBut}
                                    onClick={() => setIsOpenCreateApiFunctionModal(true)}
                                >
                                    ADD FUNCTION
                                </button>
                            </div>
                        </LineTitle>
                    </header>
                    <main>
                        {apiData.length !== 0 ?
                            apiData.map((api) => (
                                <div
                                    key={api.id}
                                    className={styles.item}
                                    onClick={() => {
                                        setSelectedApiId(api.id);
                                        setIsItemInfoModalOpen(true);
                                    }}
                                >
                                    <h2>{api.functionTitle}</h2>
                                    <p>{api.functionDescription}</p>
                                    <button
                                        className={styles.closeButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveApi();
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))
                        :
                            <div style={{width:'100%', height: '100%', textAlign:'center'}}>
                                <p style={{color: 'gray'}}>저장된 함수가 없습니다.</p>
                            </div>
                        }
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

            {questionMessage && (
                <Notification
                    onClose={() => setQuestionMessage(null)}
                    type="question"
                    message={questionMessage}
                    onConfirm={() => {
                        fetchDeleteAPIConnCode();
                    }}
                />
            )}
        </>
    );
};

export default AutoApiConnect;
