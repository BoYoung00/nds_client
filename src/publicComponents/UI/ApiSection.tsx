import React from 'react';
import CopyButton from "./CopyButton";
import styles from './Ui.module.scss';

interface ApiSectionProps {
    method: string;
    url: string;
}

const ApiSection: React.FC<ApiSectionProps> = ({ method, url }) => {

    return (
        <section className={styles.ApiSection}>
            <h3>{method} URL</h3>
            <p>{url}</p>
            <span>
                <CopyButton url={url} />
            </span>
        </section>
    );
};

export default ApiSection;
