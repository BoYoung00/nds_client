import React, {useEffect, useState} from 'react';
import styles from './DataBase.module.scss';
import TabBar from "../../publicComponents/layout/TabBar/TabBar";
import DataBaseBlueSidebar from "./Components/DataBaseBlueSidebar";
import DataBaseWhiteSidebar from "./Components/DataBaseWhiteSidebar";
import LineTitle from "../../publicComponents/UI/LineTitle";
import {formatDate} from "../../utils/utils";
import DataTab from "./Components/DataTab";

// 데이터베이스 예시 데이터
const dataBaseEntities: DataBaseEntity[] = [
    {
        id: 1,
        name: "Entity One",
        comment: "This is the first entity",
        currentUserToken: "token123"
    },
    {
        id: 2,
        name: "Entity Two",
        comment: "This is the second entity",
        currentUserToken: "token456"
    },
];

// 테이블 예시 데이터
const tableEntities: TableEntity[] = [
    {
        id: 1,
        tableHash: "abc123",
        dataBaseID: 1,
        name: "Users",
        comment: "This table stores user information",
        crateTime: "2024-01-01T10:00:00Z",
        updateTime: "2024-01-01T10:00:00Z",
        currentUserToken: "token123",
    },
    {
        id: 2,
        tableHash: "def456",
        dataBaseID: 1,
        name: "Orders",
        comment: "This table stores order information",
        crateTime: "2024-02-01T10:00:00Z",
        updateTime: "2024-02-01T10:00:00Z",
        currentUserToken: "token456",
    },
    {
        id: 3,
        tableHash: "ghi789",
        dataBaseID: 2,
        name: "Products",
        comment: "This table stores product information",
        crateTime: "2024-03-01T10:00:00Z",
        updateTime: "2024-03-01T10:00:00Z",
        currentUserToken: "token789",
    }
];

// 행 예시 데이터
const exampleColumnEntities: ExColumnEntity[] = [
    {
        id: 1,
        type: 'int',
        name: 'exampleColumn1',
        tableID: 100,
        columnHash: 'abcd1234',
        isNotNull: 1,
        isPrimaryKey: 0,
        isForeignKey: 0,
        isUniqueKey: 0,
        intDataList: [
            {
                id: 1,
                data: 10,
                createTime: 1627889183,
                columnID: 1,
                lineHash: 'lineHash1',
            },
            {
                id: 2,
                data: 20,
                createTime: 1627889283,
                columnID: 1,
                lineHash: 'lineHash2',
            },
            {
                id: 3,
                data: 30,
                createTime: 1627889383,
                columnID: 1,
                lineHash: 'lineHash3',
            },
        ],
    },
    {
        id: 2,
        type: 'int',
        name: 'exampleColumn2',
        tableID: 200,
        columnHash: 'efgh5678',
        isNotNull: 1,
        isPrimaryKey: 0,
        isForeignKey: 0,
        isUniqueKey: 1,
        intDataList: [
            {
                id: 4,
                data: 40,
                createTime: 1627889483,
                columnID: 2,
                lineHash: 'lineHash4',
            },
            {
                id: 5,
                data: 50,
                createTime: 1627889583,
                columnID: 2,
                lineHash: 'lineHash5',
            },
            {
                id: 6,
                data: 60,
                createTime: 1627889683,
                columnID: 2,
                lineHash: 'lineHash6',
            },
        ],
    },
];

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
    const [selectedTable, setSelectedTable] = useState<TableEntity | null>(null);

    useEffect(()=> {
        console.log("선택된 DB : ",selectedDataBase)
        // 여기에 테이블 목록 가져와서 tableEntities 업데이트 로직
    }, [selectedDataBase]);

    return (
        <>
            <div className={styles.dataBase}>
                <TabBar tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
                <main className={styles.content}>
                    <DataBaseBlueSidebar
                        dataBases={dataBaseEntities}
                        setSelectedDataBase={setSelectedDataBase}
                    />
                    <DataBaseWhiteSidebar
                        tables={tableEntities}
                        setSelectedTable={setSelectedTable}
                        parentsDataBase={selectedDataBase}
                    />
                    { selectedTable &&
                        <section className={styles.tabContent}>
                            <LineTitle text={selectedTable.name} smallText={formatDate(selectedTable.crateTime)}/>
                            <DataTab />
                        </section>
                    }
                </main>
            </div>
        </>
    );
};

export default DataBase;