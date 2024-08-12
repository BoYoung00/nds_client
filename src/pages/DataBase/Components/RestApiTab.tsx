import React from 'react';
import styles from '../DataBase.module.scss';
import ApiSection from "../../../publicComponents/UI/ApiSection";
import {useDataBase} from "../../../contexts/DataBaseContext";

const RestApiTab: React.FC = () => {
    const { selectedTable } = useDataBase();

    const apiUrl = process.env.REACT_APP_API_URL;
    const url = `${apiUrl}/api/json/${selectedTable?.tableHash}`;

    return (
        <div className={styles.RestApiTab}>
            <section className={styles.urlContainer}>
                <div>
                    <ApiSection method="GET" url={url} />
                    <ApiSection method="POST" url={url} />
                    <ApiSection method="PUT" url={`${url}/[PK]`} />
                    <ApiSection method="DELETE" url={`${url}/[PK]`} />
                </div>
                <button className={styles.ApiButton}>API 보관함에 추가</button>
            </section>
        </div>
    );
};

export default RestApiTab;
