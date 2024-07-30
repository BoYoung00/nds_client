import React from 'react';
import styles from '../DataBase.module.scss';

interface ResourceTabProps {
    selectedTable: TableData | null;
}

const ResourceTab: React.FC<ResourceTabProps> = ({  }) => {

    return (
        <div className={styles.ResourceTab}>

        </div>
    );
};

export default ResourceTab;
