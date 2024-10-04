import React, {useEffect, useState} from 'react';
import styles from '../DBMode.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useQueryTab} from "../hooks/useQueryTab";

interface QueryTabProps {
    isSQL?: boolean;
}

const QueryTab: React.FC<QueryTabProps> = ({isSQL=true}) => {
    const [activeTab, setActiveTab] = useState<string>('');

    const { query } = useQueryTab(activeTab);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (isSQL)
            setActiveTab('create')
        else
            setActiveTab('DTO')
    }, [isSQL])

    return (
        <div className={styles.QueryTab}>
            <div className={styles.tabContainer}>
                <TabButtons
                    buttons={isSQL ? ['create', 'insert'] : ['DTO']}
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
