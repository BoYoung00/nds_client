import React, {useState} from "react";
import styles from "../DBMSConnenct.module.scss";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import {createDBMSInfo, deleteDBMSInfo, updateDBMSInfo} from "../../../services/api";
import {Notification} from "../../../publicComponents/layout/modal/Notification";

interface DBMSModalProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    setDbmsInfos?: React.Dispatch<React.SetStateAction<DBMSDtoRequest[]>>;
    isUpdateModel?: boolean;
    selectedDbmsInfo? : DBMSDtoRequest;
}

const DBMSModal:React.FC<DBMSModalProps> = ({ isOpenModal, onCloseModal, setDbmsInfos, isUpdateModel, selectedDbmsInfo }) => {
    const [connType, setConnType] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.dbmsType : '');
    const [DBMSType, setDBMSType] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.dbmsType : '');
    const [name, setName] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.name : '');
    const [description, setDescription] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.description : '');
    const [url, setUrl] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.url : '');
    const [username, setUsername] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.username : '');
    const [password, setPassword] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.password : '');
    const [databaseName, setDatabaseName] = useState<string>(selectedDbmsInfo ? selectedDbmsInfo.databaseName : '');

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const handleConnTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnType(e.target.value);
    };
    const handleDBMSTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDBMSType(e.target.value);
    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleDatabaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatabaseName(e.target.value);
    };

    const fetchSaveAndUpdateDBMS = async (isSave: boolean = true) => {
        const dbmsInfo: DBMSDtoRequest = {
            description: description,
            name: name,
            connType: connType,
            dbmsType: DBMSType,
            url: url,
            databaseName: databaseName,
            password: password,
            username: username
        };
        try {
            if (isSave) {
                const response = await createDBMSInfo(dbmsInfo);
                console.log('response', response);
                setSuccessMessage('연결 정보 저장에 성공하셨습니다.')
            } else {
                // const response = await updateDBMSInfo(selectedDbmsInfo.id, dbmsInfo);
                // console.log('response', response);
                setSuccessMessage('연결 정보 수정에 성공하셨습니다.')
            }
        } catch (e) {
            console.error(e);
            setErrorMessage('알 수 없는 오류가 발생하였습니다.');
        }
    }

    // 삭제 로직
    const fetchDeleteDBMS = async (id: number) => {
        try {
            const response = await deleteDBMSInfo(id);
            console.log('response', response);
            setSuccessMessage('삭제에 성공하셨습니다.')
        } catch (e) {
            console.error(e);
            setErrorMessage('알 수 없는 오류가 발생하였습니다.');
        }
    }

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={70}
                height={60}
                onClose={onCloseModal}
            >
                <div className={styles.DbmsModal} >
                    <h2>{isUpdateModel ? 'Connector Information' : 'Add Connector'}</h2>
                    <section className={styles.inputContainer}>
                        <p>Configuration</p>
                        <div className={styles.inputBox}>
                            <span className={styles.modalGroup}>
                                <label htmlFor="connType">Conn Type</label>
                                <select value={connType} onChange={handleConnTypeChange} id='connType'>
                                    <option value={'default'}>{'default'}</option>
                                </select>
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="DBMSType">DBMS Type</label>
                                <select value={DBMSType} onChange={handleDBMSTypeChange} id='DBMSType'>
                                    <option value={'MySql'}>{'MySql'}</option>
                                    <option value={'Oracle'}>{'Oracle'}</option>
                                    <option value={'SQLite'}>{'SQLite'}</option>
                                    <option value={'MariaDB'}>{'MariaDB'}</option>
                                </select>
                            </span>
                        </div>
                    </section>
                    <section className={styles.inputContainer}>
                        <p>Metadata</p>
                        <div className={styles.inputBox}>
                            <span className={styles.modalGroup}>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="description">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </span>
                        </div>
                    </section>
                    <section className={styles.inputContainer}>
                        <p>Connection</p>
                        <div className={styles.inputBox}>
                            <span className={styles.modalGroup}>
                                <label htmlFor="url">URL</label>
                                <input
                                    id="url"
                                    type="text"
                                    value={url}
                                    onChange={handleUrlChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="text"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="databaseName">Database Name</label>
                                <input
                                    id="databaseName"
                                    type="text"
                                    value={databaseName}
                                    onChange={handleDatabaseNameChange}
                                />
                            </span>
                        </div>
                    </section>
                    <section className={styles.butContainer}>
                        { isUpdateModel ?
                            <div className={styles.leftButWrap} onClick={() => setQuestionMessage('해당 연결을 삭제 하시겠습니까?')}>
                                 <p>DELETE</p>
                            </div>
                            :
                            <></>
                        }
                        <div className={styles.rightButWrap}>
                            <button className={styles.testBut}>TEST</button>
                            <button className={styles.saveBut} onClick={() => fetchSaveAndUpdateDBMS(isUpdateModel)}>{isUpdateModel ? 'UPDATE' : 'SAVE'}</button>
                        </div>
                    </section>
                </div>
            </BackgroundModal>

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

            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={() => {
                    // fetchDeleteDBMS(selectedDbmsInfo.id);
                }}
            /> }
        </>
    );
};


export default DBMSModal;