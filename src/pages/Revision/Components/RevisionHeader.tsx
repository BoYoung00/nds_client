import styles from '../Revision.module.scss';
import React, {useEffect, useState} from "react";
import {useDataBase} from "../../../contexts/DataBaseContext";
import TabButtons from "../../../publicComponents/UI/TabButtons";

const RevisionHeader: React.FC = () => {
    const { databases, selectedDataBase } = useDataBase();

    const [activeTab, setActiveTab] = useState<string>('History');
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<number | null>(null);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const sessionDBId: number = Number(sessionStorage.getItem("selectedProjectId"));
        if (sessionDBId !== null)
            setSelectedDatabaseId(sessionDBId);
        else if (databases.length > 0) {
            setSelectedDatabaseId(databases[0].id!);
        }
    }, []);

    const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId: number = parseInt(e.target.value);
        setSelectedDatabaseId(projectId);
        sessionStorage.setItem("selectedProjectId", String(projectId));
    };

    return (
        <div className={styles.revisionHeader}>
            <select className={styles.databaseSelectBox} value={selectedDatabaseId ? selectedDatabaseId : ''} onChange={handleDatabaseChange}>
                {databases.map(database => (
                    <option key={database.id} value={database.id!}>
                        {database.name}
                    </option>
                ))}
            </select>
            <div className={styles.tabContainer}>
                <TabButtons
                    buttons={['History', 'Stamping', 'Search']}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
            </div>
        </div>
    );
};

RevisionHeader.propTypes = {

};

export default RevisionHeader;