import React, {useEffect, useState} from 'react';
import styles from './DataBase.module.scss';
import TabBar from "../../publicComponents/layout/TabBar/TabBar";
import DataBaseBlueSidebar from "./Components/DataBaseBlueSidebar";
import DataBaseWhiteSidebar from "./Components/DataBaseWhiteSidebar";

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

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
    const [selectedTableID, setSelectedTableID] = useState<TableEntity | null>(null);

    useEffect(()=> {
        console.log("선택된 DB : ",selectedDataBase)
        // 여기에 테이블 목록 가져와서 tableEntities 업데이트 로직
    }, [selectedDataBase]);

    return (
        <>
            <div className={styles.dataBase}>
                <TabBar tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
                <div className={styles.content}>
                    <DataBaseBlueSidebar
                        dataBases={dataBaseEntities}
                        setSelectedDataBase={setSelectedDataBase}
                    />
                    <DataBaseWhiteSidebar
                        tables={tableEntities}
                        setSelectedTable={setSelectedTableID}
                        parentsDataBase={selectedDataBase}
                    />
                </div>
            </div>
        </>
    );
};

export default DataBase;