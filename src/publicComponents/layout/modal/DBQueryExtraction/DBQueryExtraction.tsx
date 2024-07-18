import React from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './DBQueryExtraction.module.scss';
import LineTitle from "../../../UI/LineTitle";
import {} from "./useDBQueryExtraction";

interface DBQueryExtractionProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const DBQueryExtraction: React.FC<DBQueryExtractionProps> = ({ isOpenModal, onCloseModal }) => {
    if (!isOpenModal) return null;

    const ModalContent = () => (
        <div className={styles.modal}>
            <LineTitle text={"데이터베이스 쿼리 추출"} />
            <section className={styles.modal__query}>
                쿼리 들어갈거임
            </section>
        </div>
    );

    return (
        <>
            <BackgroundModal
                width={70}
                height={60}
                onClose={onCloseModal}
            >
                <ModalContent />
            </BackgroundModal>
        </>
    );
};

export default DBQueryExtraction;
