import React, {useState} from 'react';
import styles from './DataBase.module.scss';
import TabBar from "../../publicComponents/layout/TabBar/TabBar";
import DataBaseSidebar from "./Components/DataBaseSidebar";
import {Notification} from "../../publicComponents/layout/modal/Notification";

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

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDataBaseID, setSelectedDataBaseID] = useState(-1);

    return (
        <>
            <div className={styles.dataBase}>
                <TabBar tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
                <div className={styles.content}>
                    <DataBaseSidebar
                        dataBases={dataBaseEntities}
                        setSelectedDataBaseID={()=> setSelectedDataBaseID}
                    />
                </div>
            </div>
        </>
    );
};

export default DataBase;