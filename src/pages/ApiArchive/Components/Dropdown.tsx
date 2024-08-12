import React, { useState } from 'react';
import styles from '../ApiArchive.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";

interface DropdownProps {
    title?: string;
    tableHash?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title = "REST API", tableHash='tableHash'}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const url = `${apiUrl}/api/json/${tableHash}`;

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleDelete = () => {
        console.log('삭제 로직');
    }

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownHeader} onClick={handleToggle}>
                <span>{title}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
            </div>
            {isOpen && (
                <div className={styles.dropdownMain}>
                    <ApiSection method="GET" url={url} />
                    <ApiSection method="POST" url={url} />
                    <ApiSection method="PUT" url={`${url}/[PK]`} />
                    <ApiSection method="DELETE" url={`${url}/[PK]`} />
                    <p className={styles.deleteBut} onClick={handleDelete} >보관함에서 지우기</p>
                </ div>
            )}
        </div>
    );
};

export default Dropdown;
