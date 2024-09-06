import { useEffect, useState } from "react";
import { useDataBase } from "../../../contexts/DataBaseContext";

export const useRevisionHeader = () => {
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

    return {
        databases,
        selectedDatabaseId,
        handleDatabaseChange,
    };
};
