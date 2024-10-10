import React, {useState} from 'react';
import styles from '../DBMode.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useSQLTab} from "../hooks/useSQLTab";

const SQLTab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('create');
    const [dbType, setDbType] = useState<'MySQL' | 'Oracle' | 'MariaDB' | 'SQLite' >('MySQL');  // DB 타입 상태 추가

    const { query, downloadSQLFile } = useSQLTab(activeTab, dbType);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleDbTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDbType(e.target.value as 'MySQL' | 'Oracle');
    };

    return (
        <div className={styles.QueryTab}>
            <div className={styles.tabContainer}>
                <TabButtons
                    buttons={['create', 'insert']}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
                <div className={styles.sqlFileDownloadBox}>
                    <select id="dbTypeSelect" value={dbType} onChange={handleDbTypeChange}>
                        <option value="MySQL">MySQL</option>
                        <option value="Oracle">Oracle</option>
                        <option value="MariaDB">MariaDB</option>
                        <option value="SQLite">SQLite</option>
                    </select>
                    <button onClick={() => downloadSQLFile()}>.sql 파일 <br/> 다운로드</button>
                </div>
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

export default SQLTab;
