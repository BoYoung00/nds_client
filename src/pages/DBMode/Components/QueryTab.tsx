import React, { useState } from 'react';
import styles from '../DBMode.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useQueryTab} from "../hooks/useQueryTab";
import {useDataBase} from "../../../contexts/DataBaseContext";

const QueryTab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('SQL');

    const { query } = useQueryTab(activeTab);

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
            <div className={styles.codeEditorWrapper}>
                <CodeEditor code={query} />
            </div>
        </div>
    );
};

export default QueryTab;
