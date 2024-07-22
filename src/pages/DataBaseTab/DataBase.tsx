import React, {useEffect, useState} from 'react';
import styles from './DataBase.module.scss';
import TabBar from "../../publicComponents/layout/TabBar/TabBar";
import DataBaseBlueSidebar from "./Components/DataBaseBlueSidebar";
import DataBaseWhiteSidebar from "./Components/DataBaseWhiteSidebar";
import LineTitle from "../../publicComponents/UI/LineTitle";
import DataTab from "./Components/DataTab";

// 데이터베이스 예시 데이터
const dataBaseEntities: DataBaseEntity[] = [
    {
        id: 1,
        name: "Entity One",
        comment: "This is the first dataBase",
        currentUserToken: "token123"
    },
    {
        id: 2,
        name: "Entity Two",
        comment: "This is the second dataBase",
        currentUserToken: "token456"
    },
];

// 테이블 예시 데이터
const tableData: TableData[] = [
    {
        id: 1,
        name: "StdInfoManagerTable",
        comment: "학생 정보 관리할 테이블",
        tableHash: "dfff94bd6070680fd62033b4569ad24652cafd68e900cd8f7a83ba642cc6bdb0",
        tableInnerStructure: {
            "ColumnResponse(id=2, name=ID, type=INTEGER, tableID=1)": [
                {
                    id: 13,
                    data: "1",
                    createTime: "2024-07-21T22:15:20.356003",
                    columnID: 2,
                    lineHash: "48ac7374-7a1a-4153-8e3a-c10aa904ddd7",
                    dataType: "INTEGER"
                },
                {
                    id: 16,
                    data: "2",
                    createTime: "2024-07-21T22:15:20.468383",
                    columnID: 2,
                    lineHash: "75ac0c0b-1dfd-422b-8fed-65d40032f08a",
                    dataType: "INTEGER"
                },
                {
                    id: 19,
                    data: "3",
                    createTime: "2024-07-21T22:42:36.127007",
                    columnID: 2,
                    lineHash: "4d04f64b-96ec-478f-92e6-918dfa5ef073",
                    dataType: "INTEGER"
                }
            ],
            "ColumnResponse(id=3, name=NAME, type=TEXT, tableID=1)": [
                {
                    id: 14,
                    data: "학생_A",
                    createTime: "2024-07-21T22:15:20.356003",
                    columnID: 3,
                    lineHash: "48ac7374-7a1a-4153-8e3a-c10aa904ddd7",
                    dataType: "TEXT"
                },
                {
                    id: 17,
                    data: "학생_B_2",
                    createTime: "2024-07-21T22:15:20.468383",
                    columnID: 3,
                    lineHash: "75ac0c0b-1dfd-422b-8fed-65d40032f08a",
                    dataType: "TEXT"
                },
                {
                    id: 20,
                    data: "학생_C",
                    createTime: "2024-07-21T22:42:36.127007",
                    columnID: 3,
                    lineHash: "4d04f64b-96ec-478f-92e6-918dfa5ef073",
                    dataType: "TEXT"
                }
            ],
            "ColumnResponse(id=4, name=LEVEL, type=REAL, tableID=1)": [
                {
                    id: 15,
                    data: "4.3",
                    createTime: "2024-07-21T22:15:20.356003",
                    columnID: 4,
                    lineHash: "48ac7374-7a1a-4153-8e3a-c10aa904ddd7",
                    dataType: "REAL"
                },
                {
                    id: 18,
                    data: "4.5",
                    createTime: "2024-07-21T22:15:20.468383",
                    columnID: 4,
                    lineHash: "75ac0c0b-1dfd-422b-8fed-65d40032f08a",
                    dataType: "REAL"
                },
                {
                    id: 21,
                    data: "4.3",
                    createTime: "2024-07-21T22:42:36.127007",
                    columnID: 4,
                    lineHash: "4d04f64b-96ec-478f-92e6-918dfa5ef073",
                    dataType: "REAL"
                }
            ]
        }
    },
];

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

    useEffect(()=> {
        console.log("선택된 DB : ", selectedDataBase)
        // 여기에 테이블 목록 가져와서 tableData 업데이트 로직
    }, [selectedDataBase]);

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <DataTab selectedTable={selectedTable} />;
            case 1:
                return ;
            case 2:
                return ;
        }
    };

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
                        tables={tableData}
                        setSelectedTable={setSelectedTable}
                        parentsDataBase={selectedDataBase}
                    />
                    { selectedTable &&
                        <section className={styles.tabContent}>
                            {/*<LineTitle text={selectedTable.name} smallText={formatDate(selectedTable.crateTime)}/>*/}
                            <LineTitle text={selectedTable.name} />
                            { renderTabContent() }
                        </section>
                    }
                </main>
            </div>
        </>
    );
};

export default DataBase;