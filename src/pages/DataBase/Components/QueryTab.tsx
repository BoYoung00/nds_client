import React, { useState } from 'react';
import styles from '../DataBase.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useQueryTab} from "../hooks/useQueryTab";

interface QueryTabProps {
    selectedTable: TableData | null;
}

const QueryTab: React.FC<QueryTabProps> = ({ selectedTable }) => {
    const [activeTab, setActiveTab] = useState<string>('SQL');

    const { query } = useQueryTab(selectedTable, activeTab);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.QueryTab}>
            <div className={styles.tabContainer}>
                <TabButtons
                    buttons={['SQL', 'DTO']}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
                <CopyButton url={query} />
            </div>
            <CodeEditor code={query} />
        </div>
    );
};

export default QueryTab;
