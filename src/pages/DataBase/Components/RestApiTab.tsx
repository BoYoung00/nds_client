import React from 'react';
import styles from '../DataBase.module.scss';
import CopyButton from "../../../publicComponents/UI/CopyButton";

interface RestApiTabProps {
    isExpanded?: boolean;
    localPort: string;
    endpoint: string;
}

const RestApiTab: React.FC<RestApiTabProps> = ({ isExpanded = true, localPort, endpoint }) => {
    const url = `${localPort}${endpoint}`;

    return (
        <div className={styles.RestApiTab}>
            <section className={`${styles.urlContainer} ${isExpanded ? styles.visible : ''}`}>
                {isExpanded && (
                    <div>
                        <ApiSection method="GET" url={url} />
                        <ApiSection method="POST" url={url} />
                        <ApiSection method="UPDATE" url={`${url}/[PK]`} />
                        <ApiSection method="DELETE" url={`${url}/[PK]`} />
                    </div>
                )}
                <button className={styles.ApiButton}>API 보관함에 추가</button>
            </section>
        </div>
    );
};

interface ApiSectionProps {
    method: string;
    url: string;
}

const ApiSection: React.FC<ApiSectionProps> = ({ method, url }) => (
    <section className={styles.ApiSection}>
        <h3>{method} URL</h3>
        <p>{url}</p>
        <span>
            <CopyButton url={url} />
        </span>
    </section>
);

export default RestApiTab;
