import React from "react";
import styles from "../DBMSConnenct.module.scss";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import LoadingSpinner from "../../../publicComponents/UI/LoadingSpinner";
import {useDBMSModal} from "../hooks/useDBMSModal";

interface DBMSModalProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    dbmsInfos?: DBMSInfoResponse[];
    setDbmsInfos?: React.Dispatch<React.SetStateAction<DBMSInfoResponse[]>>;
    isUpdateModel?: boolean;
    selectedDbmsInfo? : DBMSInfoResponse;
}

const DBMSModal:React.FC<DBMSModalProps> = ({ isOpenModal, onCloseModal, dbmsInfos, setDbmsInfos, isUpdateModel, selectedDbmsInfo }) => {
    const {
        hooks: {
            loading,
            successConnect,
            successMessage,
            errorMessage,
            questionMessage,
            connType,
            DBMSType,
            name,
            description,
            url,
            username,
            password,
            databaseName,
            setSuccessMessage,
            setErrorMessage,
            setQuestionMessage,
        },
        handles: {
            fetchSaveAndUpdateDBMS,
            fetchTestDbmsConnection,
            fetchDeleteDBMS,
            handleConnTypeChange,
            handleDBMSTypeChange,
            handleNameChange,
            handleUsernameChange,
            handleDescriptionChange,
            handleDatabaseNameChange,
            handleUrlChange,
            handlePasswordChange,
        }
    } = useDBMSModal(selectedDbmsInfo, setDbmsInfos);


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
                                    <option value={'JDBC'}>{'JDBC'}</option>
                                    <option value={'ODBC'}>{'ODBC'}</option>
                                </select>
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="DBMSType">DBMS Type</label>
                                <select value={DBMSType} onChange={handleDBMSTypeChange} id='DBMSType'>
                                    <option value={'MySQL'}>{'MySQL'}</option>
                                    <option value={'Oracle'}>{'Oracle'}</option>
                                    <option value={'PostgreSQL'}>{'PostgreSQL'}</option>
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
                                    type="password"
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
                        <div className={styles.leftButWrap}>
                            { isUpdateModel ? <p onClick={() => setQuestionMessage('해당 연결 정보를 삭제 하시겠습니까?')}>DELETE</p> : '' }
                        </div>
                        <div className={styles.rightButWrap}>
                            <div className={styles.loading}>
                                {loading && <LoadingSpinner /> }
                                {successConnect && <p className={successConnect ? styles.visible : ''}>연결 성공</p>}
                            </div>
                            <button className={styles.testBut} onClick={fetchTestDbmsConnection}>TEST</button>
                            <button className={styles.saveBut} onClick={() => fetchSaveAndUpdateDBMS(!isUpdateModel)}>{isUpdateModel ? 'UPDATE' : 'SAVE'}</button>
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
                    fetchDeleteDBMS(selectedDbmsInfo!.id);
                }}
            /> }
        </>
    );
};


export default DBMSModal;