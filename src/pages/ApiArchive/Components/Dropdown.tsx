import React, {useState} from 'react';
import styles from '../ApiArchive.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";
import {Notification} from "../../../publicComponents/layout/modal/Notification";

interface DropdownProps {
    title?: string;
    tableHash?: string;
    urlName?: '' | 'like/';
    isOpen: boolean;
    onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title = "REST API", tableHash = 'tableHash', urlName = '', isOpen, onToggle }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const url = `${apiUrl}/api/json/${urlName}${tableHash}`;

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        setQuestionMessage('해당 API를 보관함에서 삭제하시겠습니까?')
    }

    const handleFetchApiDelete = async () => {
        try {
            // const response: UserAPIResponse = await restApiDelete();
            setSuccessMessage('보관함에서 API 삭제를 완료하였습니다.');
        } catch (error) {
            const message = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(message);
        }
    }

    return (
        <>
            <div className={styles.dropdown}>
                <div className={styles.dropdownHeader} onClick={onToggle}>
                    <span>{title}</span>
                    <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
                </div>
                {isOpen && (
                    <div className={styles.dropdownMain}>
                        {urlName === 'like/' ?
                            <ApiSection method="GET" url={url} />
                            :
                            <>
                                <ApiSection method="GET" url={url} />
                                <ApiSection method="POST" url={url} />
                                <ApiSection method="PUT" url={`${url}/{PK}`} />
                                <ApiSection method="DELETE" url={`${url}/{PK}`} />
                                <ApiSection method="WHERE" url={`${url}/{columnName}/{value}`} />
                            </>
                        }
                        <p className={styles.deleteBut} onClick={handleDelete}>보관함에서 지우기</p>
                    </div>
                )}
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

            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={handleFetchApiDelete}
            /> }
        </>

    );
};

export default Dropdown;
