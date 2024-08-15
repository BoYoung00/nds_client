import React from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './CreateDB.module.scss';
import LineTitle from "../../../UI/LineTitle";
import {useDatabaseForm, useFileUpload} from "./useCreateDB";
import {Notification} from "../Notification";
import {tab} from "@testing-library/user-event/dist/tab";
import {saveStructureToDatabase} from "../../../../services/api";

interface CreateDBProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const CreateDB: React.FC<CreateDBProps> = ({ isOpenModal, onCloseModal }) => {
    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={60}
                height={60}
                onClose={onCloseModal}
            >
                <CreateDBForm onCloseModal={onCloseModal} />
            </BackgroundModal>
        </>
    );
};

interface CreateDBFormProps {
    onCloseModal(isOpenModal: boolean): void;
}


const CreateDBForm: React.FC<CreateDBFormProps> = ({ onCloseModal }) => {
    const {
        dataBaseData,
        handleChange,
        handleFetchCreateDB,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useDatabaseForm();

    const {
        selectedFile,
        handleFileChange,
        convertedData
    } = useFileUpload();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (selectedFile && convertedData) { // 파일로 생성
                handleFetchCreateDB(selectedFile);
            } else { // 일반 생성
                handleFetchCreateDB(null);
            }
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className={styles.modal}>
            <LineTitle text={"새로운 데이터베이스 생성"} />
            <form className={styles.modal__form} onSubmit={handleFormSubmit}>
                <div className={styles.modal__form__group}>
                    <label htmlFor="name">데이터베이스명</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={handleChange}
                        value={convertedData ? convertedData.name : dataBaseData.name}
                    />
                </div>
                <div className={styles.modal__form__group}>
                    <label htmlFor="comment">설명 <span>(선택 사항)</span></label>
                    <textarea
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={convertedData ? convertedData.comment : dataBaseData.comment}
                    />
                </div>

                {/* 파일 업로더 */}
                <div className={styles.modal__fileUploader}>
                    <label className={styles.modal__fileUploader__label}>
                        파일 스크립터로 생성하기
                        <input
                            type="file"
                            accept=".nds"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                    </label>
                    {selectedFile && <span className={styles['modal__fileUploader--selectedFileName']}>{selectedFile.name}</span>}
                </div>

                {/* FileTableSet 데이터 표시 */}
                {convertedData?.tableList.map((table, index) => (
                    <div key={index} className={styles.modal__form__group}>
                        <h4>테이블 정보 - {table.name}</h4>
                        <p>{table.comment}</p>
                        <table className={styles.modal__table}>
                            <thead>
                            <tr>
                                <th>행 이름</th>
                                <th>데이터 타입</th>
                                <th>PK</th>
                                <th>FK</th>
                                <th>UK</th>
                                <th>NN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {table.columnList.map((column, columnIndex) => (
                                <tr key={columnIndex}>
                                    <td>{column.name}</td>
                                    <td>{column.dataType}</td>
                                    <td>{column.isPkActive ? 'yes' : 'no'}</td>
                                    <td>{column.isFkActive ? 'yes' : 'no'}</td>
                                    <td>{column.isUkActive ? 'yes' : 'no'}</td>
                                    <td>{column.isNotNullActive ? 'yes' : 'no'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                {/* 데이터베이스 생성 버튼 */}
                <button className={styles.modal__form__submit} type="submit">데이터베이스 생성</button>
            </form>

            {/* 성공 모달 */}
            { successMessage &&
                <Notification
                    onClose={() => setSuccessMessage(null)}
                    onConfirm={() => onCloseModal(false)}
                    type={'success'}
                    message={successMessage}
                />
            }

            {/* 에러 모달 */}
            { errorMessage &&
                <Notification
                    onClose={() => setErrorMessage(null)}
                    type={'error'}
                    message={errorMessage}
                />
            }
        </div>
    );
};

export default CreateDB;
