import React, { useState } from 'react';
import styles from './Ui.module.scss';

interface TabLinesProps {
    tabs: string[];
}

const TabLines: React.FC<TabLinesProps> = ({ tabs }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className={styles.tabLinesContainer}>
            {tabs.map((tab, index) => (
                <div
                    key={tab}
                    className={`${styles.tab} ${activeIndex === index ? styles.active : ''}`}
                    onClick={() => handleTabClick(index)}
                >
                    {tab}
                </div>
            ))}
            <div
                className={styles.activeLine}
                style={{
                    transform: `translateX(${activeIndex * 7}rem)`, // 고정된 탭 너비만큼 이동
                }}
            />
        </div>
    );
};

export default TabLines;
