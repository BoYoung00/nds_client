import React from 'react';
import styles from './Ui.module.scss';

interface TabButtonsProps {
    buttons: string[];
    activeTab: string;
    onTabClick: (tab: string) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ buttons, activeTab, onTabClick }) => {
    return (
        <div className={styles.tabButtonsContainer}>
            {buttons.map(button => (
                <button
                    key={button}
                    className={`${styles.tabButton} ${activeTab === button ? styles.active : ''}`}
                    onClick={() => onTabClick(button)}
                >
                    {button}
                </button>
            ))}
        </div>
    );
};

export default TabButtons;
