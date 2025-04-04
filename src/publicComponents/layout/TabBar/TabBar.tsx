import React, {useState} from 'react';
import {useTabBar} from './useTabBar';
import styles from './TabBar.module.scss';
import CreateDB from "../modal/CreateDB/CreateDB";

interface TabBarProps {
    tabs: string[];
    onTabSelect: (index: number) => void;
    prevSelectedIndex?: number;
    width?: number;
    background?: string;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onTabSelect, width = 5, background='#D8D8D8', prevSelectedIndex }) => {
    const { selectedIndex, handleTabClick } = useTabBar({
        initialIndex: prevSelectedIndex ? prevSelectedIndex : 0,
        onTabSelect,
    });
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);

    return (
        <div className={styles.tabBar} style={{background: `${background}`}}>
            {tabs.map((tab, index) => (
                // 비어있는 탭이라면 CREATE DATABASE +
                tab === "" ?
                <div
                    className={`${styles.tabBar__tab} ${styles['create-db-tab']}`}
                    onClick={()=>setIsOpenCreateDBModal(true)}
                    style={{minWidth: `${width}em`}}
                >
                    CREATE DATABASE +
                </div>
                :
                <div
                    key={index}
                    className={`${styles.tabBar__tab} ${index === selectedIndex ? styles.active : ''}`}
                    onClick={() => handleTabClick(index)}
                    style={{minWidth: `${width}em`}}
                >
                    {tab}
                </div>
            ))}

            <CreateDB
                isOpenModal={isOpenCreateDBModal}
                onCloseModal={() => setIsOpenCreateDBModal(false)}
            />
        </div>
    );
};

export default TabBar;
