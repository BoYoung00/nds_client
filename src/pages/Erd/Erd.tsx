import React, {useEffect, useState} from 'react';
import styles from './Erd.module.scss';
import TabBar from "../../publicComponents/layout/TabBar";
import {getDataBasesForCurrentUser} from "../../services/api";
import {Notification} from "../../publicComponents/layout/modal/Notification";

const Erd: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
    const [databaseNames, setDatabaseNames] = useState<string[]>([]);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchDatabases();
    }, []);

    useEffect(() => {
        const names = databases.map(db => db.name);

        if (names.length < 4) names.push('');

        setDatabaseNames(names);
    }, [databases]);

    const fetchDatabases = async () => {
        try {
            setLoading(true);
            const data = await getDataBasesForCurrentUser();
            setDatabases(data);
        } catch (error) {
            setErrorMessage('데이터베이스를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

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
