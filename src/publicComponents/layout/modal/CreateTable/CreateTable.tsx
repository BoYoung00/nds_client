import React from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './CreateTable.module.scss';
import LineTitle from "../../../UI/LineTitle";

interface CreateDBProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const CreateTable: React.FC<CreateDBProps> = ({ isOpenModal, onCloseModal }) => {
    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={90}
                height={60}
                onClose={onCloseModal}
                element={CreateDBForm}
            />
        </>
    );
};

const CreateDBForm: React.FC = () => {


    return (
        <></>
        // <div className={styles.modal}>
        //     <LineTitle text={"새로운 데이터베이스 생성"} />
        //     <form className={styles.modal__form} onSubmit={handleSubmit}>
        //         <div className={styles.modal__form__group}>
        //             <label htmlFor="name">데이터베이스명</label>
        //             <input
        //                 type="text"
        //                 id="name"
        //                 name="name"
        //                 required
        //                 onChange={handleChange}
        //                 value={dataBaseData.name}
        //             />
        //         </div>
        //         <div className={styles.modal__form__group}>
        //             <label htmlFor="comment">설명 <span>(선택 사항)</span></label>
        //             <textarea
        //                 id="comment"
        //                 name="comment"
        //                 onChange={handleChange}
        //                 value={dataBaseData.comment}
        //             />
        //         </div>
        //         <button className={styles.modal__form__submit} type="submit">데이터베이스 생성</button>
        //     </form>
        //     <div className={styles.modal__fileUploader}>
        //         <label className={styles.modal__fileUploader__label}>
        //             파일 스크립트로 생성하기
        //             <input
        //                 type="file"
        //                 accept=".nds"
        //                 onChange={handleFileChange}
        //                 className={styles.fileInput}
        //             />
        //         </label>
        //         {selectedFile && <span className={styles['modal__fileUploader--selectedFileName']}>{selectedFile.name}</span>}
        //     </div>
        // </div>
    );
};

export default CreateTable;
