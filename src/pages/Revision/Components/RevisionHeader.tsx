import React from "react";
import styles from '../Revision.module.scss';
import TabButtons from "../../../publicComponents/UI/TabButtons";
import {useRevisionHeader} from "../hooks/useRevisionHeader";

interface RevisionHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const RevisionHeader: React.FC<RevisionHeaderProps> = ({ activeTab, setActiveTab }) => {
    const { databases, selectedDatabaseId, handleDatabaseChange } = useRevisionHeader();

    return (
        <div className={styles.revisionHeader}>
            <select
                className={styles.databaseSelectBox}
                value={selectedDatabaseId ?? ''}
                onChange={handleDatabaseChange}
            >
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
                    onTabClick={setActiveTab}
                />
            </div>
        </div>
    );
};

export default RevisionHeader;
