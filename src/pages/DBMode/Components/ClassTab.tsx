import React, {useState} from 'react';
import styles from '../DBMode.module.scss';
import CodeEditor from '../../../publicComponents/UI/CodeEditor';
import CopyButton from '../../../publicComponents/UI/CopyButton';
import TabButtons from '../../../publicComponents/UI/TabButtons';
import {useClassTab} from "../hooks/useClassTab";

const SQLTab: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('DTO');
    const [LanguageType, setLanguageType] = useState<'Java' | 'Kotlin' | 'C++' | 'JS'>('Java');  // DB 타입 상태 추가

    const { query } = useClassTab(activeTab, LanguageType);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleDbTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguageType(e.target.value as 'Java' | 'Kotlin' | 'C++' | 'JS');
    };

    return (
        <div className={styles.QueryTab}>
            <div className={styles.tabContainer}>
                <TabButtons
                    buttons={['DTO']}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
                <div className={styles.sqlFileDownloadBox}>
                    <select id="dbTypeSelect" value={LanguageType} onChange={handleDbTypeChange}>
                        <option value="Java">Java</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="C++">C++</option>
                        <option value="JS">JS</option>
                    </select>
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
