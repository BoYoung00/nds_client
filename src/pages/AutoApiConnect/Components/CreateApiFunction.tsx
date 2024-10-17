import React, { useEffect } from "react";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import LineTitle from "../../../publicComponents/UI/LineTitle";
import styles from "../AutoApiConnect.module.scss";
import CodeEditor from "../../../publicComponents/UI/CodeEditor";
import CopyButton from "../../../publicComponents/UI/CopyButton";
import {useApiFunction} from "../hooks/useCreateApiFunction";
import {useDataBase} from "../../../contexts/DataBaseContext";
import {Notification} from "../../../publicComponents/layout/modal/Notification";

interface CreateApiFunctionProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    setApiData: React.Dispatch<React.SetStateAction<ApiConnInfoResponse[]>>;
}

const CreateApiFunction: React.FC<CreateApiFunctionProps> = ({ isOpenModal, onCloseModal, setApiData }) => {
    const { databases } = useDataBase();

    const {
        hooks: {
            tables,
            code,
            selectedDatabaseId,
            selectedTableHash,
            selectedLanguage,
            functionName,
            functionDescription,
            successMessage,
            errorMessage,
            setSelectedDatabaseId,
            setSelectedTableHash,
            setSelectedLanguage,
            setFunctionName,
            setFunctionDescription,
            setSuccessMessage,
            setErrorMessage,
        },
        handles: {
            fetchApiConnectCode,
            fetchApiConnectCodeSave,
        }
    } = useApiFunction(setApiData);

    const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDatabaseId(Number(e.target.value));
    };

    const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTableHash(e.target.value);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(e.target.value);
    };

    const handleFunctionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFunctionName(e.target.value);
    };

    const handleFunctionDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFunctionDescription(e.target.value);
    };

    // 초기화
    useEffect(() => {
        setSelectedDatabaseId(0);
    }, []);

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={85}
                height={85}
                onClose={onCloseModal}
            >
                <div className={styles.createApiFunction}>
                    <LineTitle text={"새로운 REST API 연결 함수 생성"} />
                    <main className={styles.createApiFunction__main}>
                        <section className={styles.createFunctionWrap}>
                            <div className={styles.modalGroup}>
                                <label htmlFor="name">데이터베이스</label>
                                <select value={selectedDatabaseId} onChange={handleDatabaseChange}>
                                    {databases.map(database =>
                                        <option key={database.id} value={database.id!}>{database.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className={styles.modalGroup}>
                                <label htmlFor="name">테이블</label>
                                <select value={selectedTableHash} onChange={handleTableChange}>
                                    {tables.map(table =>
                                        <option key={table.id} value={table.tableHash}>{table.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className={styles.modalGroup}>
                                <label htmlFor="name">언어</label>
                                <select value={selectedLanguage} onChange={handleLanguageChange}>
                                    <option value="JAVA">Java</option>
                                    <option value="KOTLIN">Kotlin</option>
                                    <option value="C++">C++</option>
                                    <option value="JS">JS</option>
                                </select>
                            </div>
                            <div className={styles.createFunctionBtuWrap}>
                                <button className={styles.createFunctionBtu} onClick={fetchApiConnectCode}>함수 생성하기</button>
                            </div>
                        </section>
                        <section className={styles.codeEditorWrapper}>
                            <CodeEditor code={code === '' ? '함수를 생성해주세요.' : code} />
                            <span className={styles.copyButtonWrap}>
                                <CopyButton url={code} />
                            </span>
                        </section>
                        <section className={styles.functionInfoWrap}>
                            <div className={styles.modalGroup}>
                                <label htmlFor="name">함수명</label>
                                <input
                                    type="text"
                                    value={functionName}
                                    onChange={handleFunctionNameChange}
                                />
                            </div>
                            <div className={styles.modalGroup}>
                                <label htmlFor="name">함수 설명</label>
                                <input
                                    type="text"
                                    value={functionDescription}
                                    onChange={handleFunctionDescriptionChange}
                                />
                            </div>
                        </section>
                        <button className={styles.saveFunctionBut} onClick={fetchApiConnectCodeSave}>함수 저장</button>
                    </main>
                </div>
            </BackgroundModal>

            {errorMessage && <Notification type={"error"} message={errorMessage} onClose={() => setErrorMessage(null)} />}
            {successMessage && <Notification type={"success"} message={successMessage} onClose={() => setSuccessMessage(null)} />}
        </>
    );
};

export default CreateApiFunction;