import React, {useState} from 'react';
import styles from './DBMode.module.scss';
import TabBar from "../../publicComponents/layout/TabBar/TabBar";
import DataBaseBlueSidebar from "./Components/DataBaseBlueSidebar";
import DataBaseWhiteSidebar from "./Components/DataBaseWhiteSidebar";
import LineTitle from "../../publicComponents/UI/LineTitle";
import DataTab from "./Components/DataTab";
import {formatDate} from "../../utils/utils";
import RestApiTab from "./Components/RestApiTab";
import QueryTab from "./Components/QueryTab";
import LikeTab from "./Components/LikeTab";
import ExcelTab from "./Components/ExcelTab";
import ResourceTab from "./Components/ResourceTab";
import {useTable} from "../../contexts/TableContext";

const DBMode:React.FC = () => {
    const { selectedTable } = useTable();
    const [selectedTab, setSelectedTab] = useState(0);

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
        <div className={styles.dbMode}>
            <TabBar tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
            <main className={styles.dbMode__content}>
                <DataBaseBlueSidebar /> {/* 데이터베이스 사이드바 */}
                <DataBaseWhiteSidebar /> {/* 테이블 사이드바 */}
                { selectedTable &&
                    <section className={styles.tabContent}>
                        <LineTitle text={selectedTable.name} smallText={formatDate(selectedTable.createTime)}/>
                        { renderTabContent() }
                    </section>
                }
            </main>
        </div>
    );
};

export default DBMode;