import React, {useEffect, useState} from 'react';
import styles from '../DBMode.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useQueryTab} from "../hooks/useQueryTab";

interface QueryTabProps {
    isSQL?: boolean;
}

const QueryTab: React.FC<QueryTabProps> = ({isSQL = true}) => {
    const [activeTab, setActiveTab] = useState<string>('');
    const [dbType, setDbType] = useState<'MySQL' | 'Oracle'>('MySQL');  // DB 타입 상태 추가

    const { query, downloadSQLFile } = useQueryTab(activeTab, dbType);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleDbTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDbType(e.target.value as 'MySQL' | 'Oracle');
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
                { isSQL &&
                    <div className={styles.sqlFileDownloadBox}>
                        <select id="dbTypeSelect" value={dbType} onChange={handleDbTypeChange}>
                            <option value="MySQL">MySQL</option>
                            <option value="Oracle">Oracle</option>
                            <option value="Oracle">MariaDB</option>
                            <option value="Oracle">SQLite</option>
                        </select>
                        <button onClick={() => downloadSQLFile()}>.sql 파일 <br/> 다운로드</button>
                    </div>
                }
            </div>
            <div className={styles.codeEditorWrapper}>
                <CodeEditor code={query} />
                <span className={styles.copyButtonWrap}>
                    <CopyButton url={query} />
                </span>
            </div>
        </div>
    );
};

export default QueryTab;
