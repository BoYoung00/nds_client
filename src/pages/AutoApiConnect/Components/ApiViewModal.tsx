import React, {useEffect, useState} from "react";
import styles from "../AutoApiConnect.module.scss";
import CodeEditor from "../../../publicComponents/UI/CodeEditor";
import CopyButton from "../../../publicComponents/UI/CopyButton";
import BackgroundModal from "../../../publicComponents/UI/BackgroundModal";
import {getAPIConnCodeById} from "../../../services/api";
import {Notification} from "../../../publicComponents/layout/modal/Notification";

interface ApiViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiId: number | null;
}

const ApiViewModal: React.FC<ApiViewModalProps> = ({ isOpen, onClose, apiId }) => {
    const [apiInfo, setApiInfo] = useState<APIConnDetailsResponse>();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchGetApiInfo =  async () => {
        if (!apiId) return;
        try {
            const response = await getAPIConnCodeById(apiId);
            setApiInfo(response);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    }

    useEffect(() => {
        fetchGetApiInfo();
    }, [apiId]);

    if (!isOpen) return null;

    return (
        <>
            <BackgroundModal
                width={85}
                height={80}
                onClose={onClose}
            >
                <div className={styles.apiViewModal}>
                    <div className={styles.apiInfoBox}>
                        <h2>{apiInfo && apiInfo.functionTitle}</h2>
                        <p>{apiInfo && apiInfo.functionDescription}</p>
                    </div>
                    <section className={styles.codeEditorWrapper}>
                        <CodeEditor code={apiInfo ? apiInfo.programingCode : ''} />
                        <span className={styles.copyButtonWrap}>
                    <CopyButton url={apiInfo ? apiInfo.programingCode : ''} />
                </span>
                    </section>
                </div>
            </BackgroundModal>

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default ApiViewModal;
