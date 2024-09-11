import React, { useState, useEffect } from 'react';
import {copyToClipboard} from "../../utils/utils";
import styles from './Ui.module.scss';

const CopyButton: React.FC<{ url: string }> = ({ url }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleCopyClick = () => {
        copyToClipboard(url, () => setShowCopyMessage(true));
    };

    useEffect(() => {
        if (showCopyMessage) {
            const timer = setTimeout(() => setShowCopyMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showCopyMessage]);

    return (
        <div className={styles.copyButtonContainer}>
            <a className={styles.copyButton} onClick={handleCopyClick} >
                Copy
            </a>
            {showCopyMessage && <span className={styles.copyMessage}>복사 되었습니다.</span>}
        </div>
    );
};

export default CopyButton;
