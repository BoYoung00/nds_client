import React, {useState} from "react";
import styles from "../DBMSConnenct.module.scss";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";

interface DBMSModalProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    setDbmsInfos?: React.Dispatch<React.SetStateAction<DBMSDtoRequest[]>>;
}

const DBMSModal:React.FC<DBMSModalProps> = ({ isOpenModal, onCloseModal, setDbmsInfos }) => {
    const [connType, setConnType] = useState<string>();
    const [DBMSType, setDBMSType] = useState<string>();
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [url, setUrl] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [databaseName, setDatabaseName] = useState<string>();

    const handleConnTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnType(e.target.value);
    };
    const handleDBMSTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDBMSType(e.target.value);
    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };
    const handleDatabaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDBMSType(e.target.value);
    };

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={70}
                height={60}
                onClose={onCloseModal}
            >
                <div className={styles.DbmsModal} >
                    <section className={styles.inputContainer}>
                        <p>Configuration</p>
                        <div className={styles.inputBox}>
                            <span className={styles.modalGroup}>
                                <label htmlFor="connType">ConnType</label>
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
                                    <option value={'MySql'}>{'MySql'}</option>
                                </select>
                            </span>
                        </div>
                    </section>
                    <section className={styles.inputContainer}>
                        <p>Metadata</p>
                        <div className={styles.inputBox}>
                            <span className={styles.modalGroup}>
                                <label htmlFor="name">name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="description">description</label>
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
                                <label htmlFor="url">url</label>
                                <input
                                    id="url"
                                    type="text"
                                    value={url}
                                    onChange={handleUrlChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="username">username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="password">password</label>
                                <input
                                    id="password"
                                    type="text"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </span>
                            <span className={styles.modalGroup}>
                                <label htmlFor="databaseName">databaseName</label>
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
                        <button className={styles.testBut}>TEST</button>
                        <button className={styles.saveBut}>SAVE</button>
                    </section>
                </div>
            </BackgroundModal>
        </>
    );
};


export default DBMSModal;