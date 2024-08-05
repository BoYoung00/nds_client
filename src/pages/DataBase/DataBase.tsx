import React, {useEffect, useState} from 'react';
import styles from './DataBase.module.scss';
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
import {getTablesForDataBaseID} from "../../services/api";
import {Notification} from "../../publicComponents/layout/modal/Notification";

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
    const [tables, setTables] = useState<TableData[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 테이블 리스트 통신
    const fetchTables = async (databaseID: number) => {
        try {
            setLoading(true);
            const data = await getTablesForDataBaseID(databaseID);
            console.log("통신 테이블 리스트", data)
            setTables(data);
        } catch (error) {
            setErrorMessage('테이블 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTables = () => {
        if (selectedDataBase)
            fetchTables(selectedDataBase.id!)
    }

    useEffect(() => {
        handleFetchTables();
    }, [selectedDataBase]);

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <DataTab selectedTable={selectedTable} setTables={setTables} handleFetchTables={handleFetchTables}/>;
            case 1:
                return <LikeTab selectedTable={selectedTable} />;
            case 2:
                return <RestApiTab selectedTable={selectedTable} isExpanded={true} endpoint={"endpoint"} localPort={"url"} />;
            case 3:
                return <QueryTab selectedTable={selectedTable}/>;
            case 4:
                return <ExcelTab selectedTable={selectedTable}/>;
            case 5:
                return <ResourceTab selectedTable={selectedTable}/>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.dataBase}>
                <TabBar tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
                <main className={styles.dataBase__content}>
                    <DataBaseBlueSidebar
                        setSelectedDataBase={setSelectedDataBase}
                    />
                    <DataBaseWhiteSidebar
                        tables={tables}
                        setTables={setTables}
                        setSelectedTable={setSelectedTable}
                        parentsDataBase={selectedDataBase}
                    />
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

export default DataBase;