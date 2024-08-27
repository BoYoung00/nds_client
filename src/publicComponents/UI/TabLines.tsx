import React, { useState } from 'react';
import styles from './Ui.module.scss';

interface TabLinesProps {
    tabs: string[];
    activeTab: string;
    onTabClick: (tab: string) => void;
}

const TabLines: React.FC<TabLinesProps> = ({ tabs, onTabClick, activeTab }) => {

    return (
        <div className={styles.tabLinesContainer}>
            {tabs.map((tab, index) => (
                <div
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => onTabClick(tab)}
                >
                    {tab}
                </div>
            ))}
            <div
                className={styles.activeLine}
                style={{
                    transform: `translateX(${tabs.indexOf(activeTab) * 7}rem)`, // 고정된 탭 너비만큼 이동
                }}
            />
        </div>
    );
};

export default TabLines;
