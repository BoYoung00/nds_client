import React from 'react';
import styles from '../ApiArchive.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";

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

    const handleDelete = () => {
        console.log('삭제 로직');
    }

    return (
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
    );
};

export default Dropdown;
