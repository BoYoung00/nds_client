import React from 'react';
import styles from '../DataBase.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import csv from '../../../assets/images/CSV.png';

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
