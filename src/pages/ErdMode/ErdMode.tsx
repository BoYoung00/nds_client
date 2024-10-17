import React from 'react';
import styles from './ErdMode.module.scss';
import TabBar from '../../publicComponents/layout/TabBar';
import {Notification} from '../../publicComponents/layout/modal/Notification';
import ERDiagram from './Components/ERDiagram';
import LineTitle from '../../publicComponents/UI/LineTitle';
import RemoteControl from './Components/RemoteControl';
import {useErdMode} from './useErdMode';
import {formatDate} from "../../utils/utils";
import DataTab from "../DBMode/Components/DataTab";
import LikeTab from "../DBMode/Components/LikeTab";
import RestApiTab from "../DBMode/Components/RestApiTab";
import SQLTab from "../DBMode/Components/SQLTab";
import ExcelTab from "../DBMode/Components/ExcelTab";
import ResourceTab from "../DBMode/Components/ResourceTab";
import ClassTab from "../DBMode/Components/ClassTab";

const ErdMode: React.FC = () => {
    const {
        databaseNames,
        selectedTable,
        isVisible,
        selectedRemoteIndex,
        handelSelectedRemoteItem,
        selectedDatabaseIndex,
        setSelectedDatabaseIndex,
        errorMessage,
        setErrorMessage,
    } = useErdMode();

    const renderTabContent = () => {
        switch (selectedRemoteIndex) {
            case 0:
                return <DataTab />;
            case 1:
                return <RestApiTab />;
            case 2:
                return <LikeTab  />;
            case 3:
                return <SQLTab />;
            case 4:
                return <ClassTab />;
            case 5:
                return <ExcelTab />;
            case 6:
                return <ResourceTab />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.erdMode}>
                <RemoteControl
                    selectedIndex={selectedRemoteIndex}
                    onSelect={handelSelectedRemoteItem}
                />
                <TabBar
                    tabs={databaseNames}
                    prevSelectedIndex={selectedDatabaseIndex}
                    onTabSelect={setSelectedDatabaseIndex}
                    width={10}
                    background={'#F5F5F5'}
                />
                <main className={styles.erdMode__main}>
                    <div className={styles.cover}>
                        엔티티 관계 연결 하는 방법: <br />
                        1. Ctrl + 드래그 <br />
                        2. '부모 → 자식' 으로 드래그
                    </div>
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
