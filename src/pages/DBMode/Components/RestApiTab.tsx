import React, {useState} from 'react';
import styles from '../DBMode.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";
import {useTable} from "../../../contexts/TableContext";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {registerApi} from "../../../services/api";

const RestApiTab: React.FC = () => {
    const { selectedTable } = useTable();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const apiUrl = process.env.REACT_APP_API_URL;
    const url = `${apiUrl}/api/json/${selectedTable?.tableHash}`;

    const handelSaveApiArchive = async () => {
        if (!selectedTable) return;

        try {
            await registerApi(selectedTable.tableHash)
            setSuccessMessage(`해당 URL들을 API 보관함에 저장하셨습니다. \n "API ARCHIVE"를 확인해주세요.`)
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    }

    return (
        <>
            <div className={styles.RestApiTab}>
                <section className={styles.urlContainer}>
                    <div className={styles.urlContainer__apiWrap}>
                        <ApiSection method="GET" url={url} />
                        <ApiSection method="POST" url={url} />
                        <ApiSection method="PUT" url={`${url}/{PK}`} />
                        <ApiSection method="DELETE" url={`${url}/{PK}`} />
                        <ApiSection method="WHERE" url={`${url}/{columnName}/{value}`} />
                    </div>
                    <div className={styles.urlContainer__butWrap}>
                        <button className={styles.ApiButton} onClick={handelSaveApiArchive}>API 보관함에 추가</button>
                    </div>
                </section>
            </div>

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

export default RestApiTab;
