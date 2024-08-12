import React from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './CreateDB.module.scss';
import LineTitle from "../../../UI/LineTitle";
import {useDatabaseForm, useFileUpload} from "./useCreateDB";
import {Notification} from "../Notification";

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
        handleSubmit, 
        successMessage, 
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useDatabaseForm();
    
    const { selectedFile, handleFileChange } = useFileUpload();

    return (
        <div className={styles.modal}>
            <LineTitle text={"새로운 데이터베이스 생성"} />
            <form className={styles.modal__form} onSubmit={handleSubmit}>
                <div className={styles.modal__form__group}>
                    <label htmlFor="name">데이터베이스명</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={handleChange}
                        value={dataBaseData.name}
                    />
                </div>
                <div className={styles.modal__form__group}>
                    <label htmlFor="comment">설명 <span>(선택 사항)</span></label>
                    <textarea
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={dataBaseData.comment}
                    />
                </div>
                <button className={styles.modal__form__submit} type="submit">데이터베이스 생성</button>
            </form>
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

            {/*성공 모달*/}
            { successMessage &&
            <Notification
                onClose={()=> setSuccessMessage(null) }
                onConfirm={()=> onCloseModal(false) }
                type={'success'}
                message={successMessage}
            /> }
            
            {/*에러 모달*/}
            { errorMessage &&
                <Notification
                    onClose={()=> setErrorMessage(null) }
                    type={'error'}
                    message={errorMessage}
                />}
        </div>
    );
};

export default CreateDB;
