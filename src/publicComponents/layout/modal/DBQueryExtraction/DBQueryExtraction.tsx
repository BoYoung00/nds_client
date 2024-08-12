import React, { useEffect, useState } from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './DBQueryExtraction.module.scss';
import LineTitle from "../../../UI/LineTitle";
import CodeEditor from "../../../UI/CodeEditor";
import CopyButton from "../../../UI/CopyButton";
import { useDataBase } from "../../../../contexts/DataBaseContext";

interface DBQueryExtractionProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const DBQueryExtraction: React.FC<DBQueryExtractionProps> = ({ isOpenModal, onCloseModal }) => {
    const { tables } = useDataBase();
    const [sqlQuery, setSqlQuery] = useState<string>("");

    useEffect(() => {

    }, [tables]);


    if (!isOpenModal) return null;

    const ModalContent = () => (
        <div className={styles.dbQueryExtraction}>
            <LineTitle text={"데이터베이스 쿼리 추출"} />
            <span className={styles.dbQueryExtraction__copyButBox}>
                <CopyButton url={sqlQuery} />
            </span>
            <span className={styles.dbQueryExtraction__codeEditorWrapper}>
                <CodeEditor code={sqlQuery} />
            </span>
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
