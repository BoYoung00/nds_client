import React from 'react';
import styles from './ErdMode.module.scss';
import TabBar from '../../publicComponents/layout/TabBar';
import { Notification } from '../../publicComponents/layout/modal/Notification';
import ERDiagram from './Components/ERDiagram';
import LineTitle from '../../publicComponents/UI/LineTitle';
import RemoteControl from './Components/RemoteControl';
import { useErdMode } from './useErdMode';
import {formatDate} from "../../utils/utils";
import DataTab from "../DBMode/Components/DataTab";
import LikeTab from "../DBMode/Components/LikeTab";
import RestApiTab from "../DBMode/Components/RestApiTab";
import QueryTab from "../DBMode/Components/QueryTab";
import ExcelTab from "../DBMode/Components/ExcelTab";
import ResourceTab from "../DBMode/Components/ResourceTab";

const ErdMode: React.FC = () => {
    const {
        databaseNames,
        selectedTable,
        isVisible,
        selectedTab,
        setSelectedTab,
        setSelectedDatabaseIndex,
        errorMessage,
        setErrorMessage,
    } = useErdMode();

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
                    onSelect={setSelectedTab}
                />
                <TabBar
                    tabs={databaseNames}
                    onTabSelect={setSelectedDatabaseIndex}
                    width={10}
                    background={'#F5F5F5'}
                />
                <main className={styles.erdMode__main}>
                    <ERDiagram />
                    {selectedTable && (
                        <section className={`${styles.tabContent} ${isVisible ? styles.tabContentVisible : ''}`}>
                            <LineTitle
                                text={selectedTable.name}
                                smallText={formatDate(selectedTable.createTime)}
                            />
                            { renderTabContent() }
                        </section>
                    )}
                </main>
            </div>

            {/* Error Modal */}
            {errorMessage && (
                <Notification
                    onClose={() => setErrorMessage(null)}
                    type="error"
                    message={errorMessage}
                />
            )}
        </>
    );
};

export default ErdMode;
