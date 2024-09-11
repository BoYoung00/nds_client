import React, {useState} from 'react';
import styles from './DataBase.module.scss';
import {DBMode} from "../DBMode";
import ErdMode from "../ErdMode";

const DataBase:React.FC = () => {
    const getInitialMode = () => {
        const savedMode = localStorage.getItem('appMode');
        return savedMode ? (savedMode as 'DB' | 'ERD') : 'DB';
    };
    const [mode, setMode] = useState<'ERD' | 'DB'>(getInitialMode);

    const handleToggle = () => {
        const newMode = mode === 'ERD' ? 'DB' : 'ERD';
        setMode(newMode);
        localStorage.setItem('appMode', newMode);
    };

    return (
        <div className={styles.dataBase}>
            <div className={styles.toggleContainer}>
                <span className={styles.toggleLabel}>
                    {mode === 'ERD' ? 'ERD Mode' : 'DB Mode'}
                </span>
                    <div
                        className={`${styles.toggleSwitch} ${mode === 'ERD' ? styles.toggleOn : styles.toggleOff}`}
                        onClick={handleToggle}
                    />
            </div>

            {mode === 'ERD' ?
                <ErdMode />
                :
                <DBMode />
            }
        </div>
    );
};

export default DataBase;