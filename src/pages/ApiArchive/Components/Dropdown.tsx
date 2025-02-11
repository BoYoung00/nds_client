import React, {useState} from 'react';
import styles from '../ApiArchive.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {restApiDelete} from "../../../services/api";

interface DropdownProps {
    id: number;
    title?: string;
    tableHash?: string;
    urlName?: '' | 'like/';
    isOpen: boolean;
    onToggle: () => void;
    apis: UserAPIResponse | null;
    setApis: (api: UserAPIResponse | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ id, title = "REST API", tableHash = 'tableHash', urlName = '', isOpen, onToggle, setApis, apis }) => {
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
            await restApiDelete(id);
            setSuccessMessage('보관함에서 API 삭제를 완료하였습니다.');
            if (apis) setApis(removeUserAPIDTOById(apis, id))
        } catch (error) {
            const message = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(message);
        }
    }

    // 리스트에서 삭제
    function removeUserAPIDTOById(response: UserAPIResponse, idToRemove: number): UserAPIResponse {
        const filteredFilterAPIList = response.filterAPIList.filter(api => api.id !== idToRemove);
        const filteredBasicAPIList = response.basicAPIList.filter(api => api.id !== idToRemove);

        return {
            filterAPIList: filteredFilterAPIList,
            basicAPIList: filteredBasicAPIList,
        };
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
