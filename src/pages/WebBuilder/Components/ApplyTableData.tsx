import React, { useState } from 'react';
import styles from '../WebBuilder.module.scss';

const ApplyTableData: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className={`${styles.applyTableData} ${isVisible ? styles.show : ''}`}>
            <div className={styles.slideButtonWrap}>
                <button onClick={handleToggle}>
                    {isVisible ? '<' : '>'}
                </button>
            </div>
            <div className={styles.slideContainer}>
                <span>Content to slide</span>
            </div>
        </div>
    );
};

export default ApplyTableData;
