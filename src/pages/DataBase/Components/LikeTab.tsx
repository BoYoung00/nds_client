import React from 'react';
import styles from '../DataBase.module.scss';

interface LikeTabProps {
    selectedTable: TableData | null;
}

const LikeTab: React.FC<LikeTabProps> = ({  }) => {

    return (
        <div className={styles.LikeTab}>

        </div>
    );
};

export default LikeTab;
