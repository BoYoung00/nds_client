import React, { useEffect, useState } from "react";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import LineTitle from "../../../publicComponents/UI/LineTitle";
import styles from "../AutoApiConnect.module.scss";
import CodeEditor from "../../../publicComponents/UI/CodeEditor";
import CopyButton from "../../../publicComponents/UI/CopyButton";
import { useDataBase } from "../../../contexts/DataBaseContext";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import { getTablesForDataBaseID } from "../../../services/api";

interface CreateApiFunctionProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const CreateApiFunction: React.FC<CreateApiFunctionProps> = ({ isOpenModal, onCloseModal }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { databases } = useDataBase();

    const [tables, setTables] = useState<TableData[]>([]);
    const [code, setCode] = useState<string>('');

    const [selectedDatabaseId, setSelectedDatabaseId] = useState<number>(databases[0]?.id!);
    const [selectedTableHash, setSelectedTableHash] = useState<string>(tables[0]?.tableHash);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("JAVA");
    const [functionName, setFunctionName] = useState<string>("");
    const [functionDescription, setFunctionDescription] = useState<string>("");

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTables = async () => {
        if (!selectedDatabaseId) return;
        try {
            setLoading(true);
            const data = await getTablesForDataBaseID(selectedDatabaseId);
            setTables(data);

            if (data.length > 0) {
                setSelectedTableHash(data[0].tableHash);
            }
        } catch (error) {
            setErrorMessage('테이블 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchApiConnectCode = async () => {
        if (!selectedTableHash) {
            setErrorMessage('테이블을 선택해주세요.');
            return;
        }

        const apiConnCodeRequest: ApiConnCodeRequest = {
            dataBaseId: selectedDatabaseId,
            tableHash: selectedTableHash,
            title: functionName,
            description: functionDescription,
            programmingLanguages: selectedLanguage
        }
        console.log('apiConnCodeRequest', apiConnCodeRequest);

        try {
            // 여기에 API 호출 로직을 추가
            // const response = await someApiCall(apiConnCodeRequest);
            // setCode(response.data);
        } catch (e) {
            setErrorMessage('API 연결 코드를 생성하는 데 실패했습니다.');
        }
    }

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

    useEffect(() => {
        setSelectedDatabaseId(databases[0]?.id!);
    }, [databases]);

    useEffect(() => {
        fetchTables();
    }, [selectedDatabaseId]);

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={60}
                height={60}
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
                        <button className={styles.saveFunctionBut}>함수 저장하기</button>
                    </main>
                </div>
            </BackgroundModal>

            {successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            />}

            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}
        </>
    );
}

export default CreateApiFunction;
