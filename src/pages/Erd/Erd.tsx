import React, {useEffect, useState} from 'react';
import styles from './Erd.module.scss';
import TabBar from "../../publicComponents/layout/TabBar";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import {useDataBase} from "../../contexts/DataBaseContext";
import ERDiagram from "./Components/ERDiagram";

const Erd: React.FC = () => {
    const { databases, setSelectedDataBase } = useDataBase();

    const [loading, setLoading] = useState<boolean>(false);

    const [databaseNames, setDatabaseNames] = useState<string[]>([]);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const names = databases.map(db => db.name);
        if (names.length < 4) names.push('');
        setDatabaseNames(names);
    }, [databases]);

    useEffect(() => {
        if (databases.length > 0) {
            setSelectedDataBase(databases[selectedTabIndex]);
        }
    }, [databases, selectedTabIndex, setSelectedDataBase]);

    return (
        <>
            <div className={styles.erd}>
                <TabBar tabs={databaseNames} onTabSelect={(index) => setSelectedTabIndex(index)} width={10}/>
                <ERDiagram />
            </div>
            {/* 오류 모달 */}
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default Erd;
