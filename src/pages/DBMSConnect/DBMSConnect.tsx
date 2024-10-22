import React from "react";
import styles from "./DBMSConnenct.module.scss";
import LineTitle from "../../publicComponents/UI/LineTitle";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import DBMSModal from "./Components/DBMSModal";
import {useDBMSConnect} from "./useDBMSConnect";

const DBMSConnect: React.FC = () => {
    const {
        hooks: {
            dbmsInfos,
            setDbmsInfos,
            selectedDbmsInfo,
            setSelectedDbmsInfo,
            isOpenCreateDBConnectModal,
            setIsOpenCreateDBConnectModal,
            isItemInfoModalOpen,
            setIsItemInfoModalOpen,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
            isImportExportOpen,
            setIsImportExportOpen,
            selectedOption,
            setSelectedOption,
            selectedDatabaseId,
            setSelectedDatabaseId,
            tableNameInputValue,
            setTableNameInputValue,
            selectedTableId,
            setSelectedTableId,
            databases,
            tables,
        },
        handles: {
            handleRun
        }
    } = useDBMSConnect();

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
                        {dbmsInfos && dbmsInfos.length !== 0 ? (
                            dbmsInfos.map((info, index) => (
                                <div
                                    key={index}
                                    className={`${styles.item} ${isImportExportOpen === index ? styles.selectedItem : ''}`}
                                    onClick={() => {
                                        setSelectedDbmsInfo(info);
                                        setIsImportExportOpen(isImportExportOpen === index ? null : index);
                                    }}
                                >
                                    <section className={styles.itemInfo}>
                                        <h2>{info.name}</h2>
                                        <p>{info.description}</p>
                                    </section>
                                    <section className={styles.butWrap}>
                                        <p
                                            className={styles.updateBut}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDbmsInfo(info);
                                                setIsItemInfoModalOpen(true);
                                            }}>
                                            Connect Information
                                        </p>
                                        <button
                                            className={styles.runBut}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDbmsInfo(info);
                                                setIsImportExportOpen(isImportExportOpen === index ? null : index);
                                            }}
                                        >
                                            Import/Export Database ▼
                                        </button>
                                    </section>
                                    {isImportExportOpen === index && (
                                        <div className={styles.dropdown} onClick={(e) => { e.stopPropagation();} }>
                                            <div className={styles.dropdownContent}>
                                                <div className={styles.radioGroup}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="importExport"
                                                            value="Import"
                                                            checked={selectedOption === "Import"}
                                                            onChange={() => setSelectedOption("Import")}
                                                        />
                                                        Import
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="importExport"
                                                            value="Export"
                                                            checked={selectedOption === "Export"}
                                                            onChange={() => setSelectedOption("Export")}
                                                        />
                                                        Export
                                                    </label>
                                                </div>

                                                {selectedOption === "Import" ? (
                                                    <div className={styles.inputContainer}>
                                                        <div className={styles.inputBox}>
                                                            <label>Select Database</label>
                                                            <select
                                                                value={selectedDatabaseId}
                                                                onChange={(e) => setSelectedDatabaseId(Number(e.target.value))}  // e.target.value를 숫자로 변환
                                                            >
                                                                {databases.map(database => (
                                                                    <option key={database.id} value={database.id!}>{database.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className={styles.inputBox}>
                                                            <label>Enter Table Name</label>
                                                            <input
                                                                style={{padding: '.6rem'}}
                                                                type="text"
                                                                value={tableNameInputValue}
                                                                onChange={(e) => setTableNameInputValue(e.target.value)}
                                                            />
                                                        </div>
                                                        <p className={styles.DBMSComment}>※ DBMS에서 가져오고자 하는 테이블 이름을 작성해주세요.</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            <label>Select Database</label>
                                                            <select
                                                                value={selectedDatabaseId}
                                                                onChange={(e) => setSelectedDatabaseId(Number(e.target.value))}  // e.target.value를 숫자로 변환
                                                            >
                                                                {databases.map(database => (
                                                                    <option key={database.id} value={database.id!}>{database.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label>Select Table</label>
                                                            <select
                                                                value={selectedTableId}
                                                                onChange={(e) => setSelectedTableId(Number(e.target.value))}  // e.target.value를 숫자로 변환
                                                            >
                                                                {tables.map(table => (
                                                                    <option key={table.id} value={table.id!}>{table.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <p className={styles.DBMSComment}>※ D-SIM에서 DBMS에 보내고자 하는 테이블을 선택해주세요.</p>
                                                    </div>
                                                )}

                                                <button className={styles.runButton} onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRun();
                                                }}>
                                                    RUN
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
                                <p style={{ color: "gray" }}>DBMS 연결 정보가 없습니다.</p>
                            </div>
                        )}
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
                dbmsInfos={dbmsInfos}
                setDbmsInfos={setDbmsInfos}
                isUpdateModel={true}
                selectedDbmsInfo={selectedDbmsInfo}
            />

            {successMessage && (
                <Notification onClose={() => setSuccessMessage(null)} type="success" message={successMessage} />
            )}

            {errorMessage && (
                <Notification onClose={() => setErrorMessage(null)} type="error" message={errorMessage} />
            )}
        </>
    );
};

export default DBMSConnect;
