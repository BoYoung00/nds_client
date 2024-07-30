import React from 'react';
import styles from '../DataBase.module.scss';

interface ExcelTabProps {
    selectedTable: TableData | null;
}

const ExcelTab: React.FC<ExcelTabProps> = ({  }) => {

    return (
        <div className={styles.ExcelTab}>

        </div>
    );
};

export default ExcelTab;
