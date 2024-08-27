import React, { useState } from "react";
import styles from '../Revision.module.scss';
import TabLines from "../../../publicComponents/UI/TabLines";

const Information: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Stamping');
    const [selectedTable, setSelectedTable] = useState<number | null>(null); // 선택된 li의 인덱스를 관리

    return (
        <div className={styles.information}>
            <TabLines tabs={['Stamping', 'Changes', 'Tables']} activeTab={activeTab} onTabClick={setActiveTab} />

            {activeTab === 'Stamping' &&
                <div className={styles.stamping}>
                    <p>
                        <span>SHA</span>
                        <span>12313212</span>
                    </p>
                    <p>
                        <span>CREATE</span>
                        <span>2024-02-21 오후 14:09</span>
                    </p>
                    <p>
                        <span>MESSAGE</span>
                        <span>커밋 메세지</span>
                    </p>
                </div>
            }

            {activeTab === 'Changes' &&
                <div className={styles.changes}>
                    <div className={styles.tableListBox}>
                        <ul>
                            {['테이블1', '테이블2', '테이블3'].map((table, index) => (
                                <li
                                    key={index}
                                    className={selectedTable === index ? styles.selected : ''}
                                    onClick={() => setSelectedTable(index)} // 통신 연결하면 바꾸기
                                >
                                    {table}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.tableChangeView}>
                        테이블 뷰 부분
                    </div>
                </div>
            }

            {activeTab === 'Tables' &&
                <div className={styles.tables}>
                    <div className={styles.tableListBox}>
                        <ul>
                            {['테이블1', '테이블2', '테이블3'].map((table, index) => (
                                <li
                                    key={index}
                                    className={selectedTable === index ? styles.selected : ''}
                                    onClick={() => setSelectedTable(index)} // 통신 연결하면 바꾸기
                                >
                                    {table}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.tablePreView}>
                        테이블 프리뷰 부분
                    </div>
                </div>
            }
        </div>
    );
};

export default Information;
