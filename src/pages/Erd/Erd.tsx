import React, {useEffect, useState} from 'react';
import styles from './Erd.module.scss';
import TabBar from "../../publicComponents/layout/TabBar";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import {useDataBase} from "../../contexts/DataBaseContext";

const Erd: React.FC = () => {
    const { databases } = useDataBase();

    const [loading, setLoading] = useState<boolean>(false);

    const [databaseNames, setDatabaseNames] = useState<string[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const names = databases.map(db => db.name);
        if (names.length < 4) names.push('');
        setDatabaseNames(names);
    }, [databases]);

    return (
        <>
            <div className={styles.erd}>
                <TabBar tabs={databaseNames} onTabSelect={(index) => setSelectedTab(index)} width={10}/>
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
