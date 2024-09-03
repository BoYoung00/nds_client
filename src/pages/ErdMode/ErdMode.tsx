import React, {useEffect, useState} from 'react';
import styles from './ErdMode.module.scss';
import TabBar from "../../publicComponents/layout/TabBar";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import {useDataBase} from "../../contexts/DataBaseContext";
import ERDiagram from "./Components/ERDiagram";
import LineTitle from "../../publicComponents/UI/LineTitle";
import {formatDate} from "../../utils/utils";
import DataTab from "../DBMode/Components/DataTab";
import LikeTab from "../DBMode/Components/LikeTab";
import RestApiTab from "../DBMode/Components/RestApiTab";
import QueryTab from "../DBMode/Components/QueryTab";
import ExcelTab from "../DBMode/Components/ExcelTab";
import ResourceTab from "../DBMode/Components/ResourceTab";
import {useTable} from "../../contexts/TableContext";
import RemoteControl from "./Components/RemoteControl";

const ErdMode: React.FC = () => {
    const { databases, setSelectedDataBase } = useDataBase();
    const { selectedTable } = useTable();

    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState(0);

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

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <DataTab />;
            case 1:
                return <LikeTab  />;
            case 2:
                return <RestApiTab  />;
            case 3:
                return <QueryTab />;
            case 4:
                return <ExcelTab />;
            case 5:
                return <ResourceTab />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.erdMode}>
                <RemoteControl
                    selectedIndex={selectedTab}
                    onSelect={(index) => setSelectedTab(index)}
                />
                <TabBar tabs={databaseNames} onTabSelect={(index) => setSelectedTabIndex(index)} width={10} background={'#F5F5F5'}/>
                <main className={styles.erdMode__main}>
                    <ERDiagram />
                    { selectedTable &&
                        <section className={styles.tabContent}>
                            <LineTitle text={selectedTable.name} smallText={formatDate(selectedTable.createTime)}/>
                            { renderTabContent() }
                        </section>
                    }
                </main>
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

export default ErdMode;
