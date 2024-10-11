import React from "react";
import styles from "../AutoApiConnect.module.scss";
import CodeEditor from "../../../publicComponents/UI/CodeEditor";
import CopyButton from "../../../publicComponents/UI/CopyButton";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import LineTitle from "../../../publicComponents/UI/LineTitle";

interface ApiViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiId: number | null;
    apiInfo: ApiConnCodeResponse | null;
}

const ApiViewModal: React.FC<ApiViewModalProps> = ({ isOpen, onClose, apiId, apiInfo }) => {
    if (!isOpen || !apiInfo) return null;

    return (
        <BackgroundModal
            width={85}
            height={80}
            onClose={onClose}
        >
            <div className={styles.apiViewModal}>
                <div className={styles.apiInfoBox}>
                    <h2>{apiInfo.title}</h2>
                    <p>{apiInfo.description}</p>
                </div>
                <section className={styles.codeEditorWrapper}>
                    <CodeEditor code={apiInfo.createCode} />
                    <span className={styles.copyButtonWrap}>
                    <CopyButton url={apiInfo.createCode} />
                </span>
                </section>
            </div>
        </BackgroundModal>

    );
};

export default ApiViewModal;
