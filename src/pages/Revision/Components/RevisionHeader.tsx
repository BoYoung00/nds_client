import React, { useEffect, useState } from "react";
import styles from '../Revision.module.scss';
import { useDataBase } from "../../../contexts/DataBaseContext";
import TabButtons from "../../../publicComponents/UI/TabButtons";

interface RevisionHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const RevisionHeader: React.FC<RevisionHeaderProps> = ({ activeTab, setActiveTab }) => {
    const { databases, setSelectedDataBase } = useDataBase();
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<number | null>(() => {
        const sessionDBId = sessionStorage.getItem("selectedDatabaseId");
        return sessionDBId ? Number(sessionDBId) : null;
    });

    useEffect(() => {
        if (selectedDatabaseId === null && databases.length > 0) {
            const initialDatabaseId = databases[0].id!;
            setSelectedDatabaseId(initialDatabaseId);
            setSelectedDataBase(databases[0]);
        } else if (selectedDatabaseId !== null) {
            const sessionDB = databases.find(database => database.id === selectedDatabaseId);
            if (sessionDB) {
                setSelectedDataBase(sessionDB);
            }
        }
    }, [databases, selectedDatabaseId, setSelectedDataBase]);

    const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const databaseId = Number(e.target.value);
        const selectedDatabase = databases.find(database => database.id === databaseId);

        if (selectedDatabase) {
            setSelectedDatabaseId(databaseId);
            setSelectedDataBase(selectedDatabase);
            sessionStorage.setItem("selectedDatabaseId", String(databaseId));
        }
    };

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
