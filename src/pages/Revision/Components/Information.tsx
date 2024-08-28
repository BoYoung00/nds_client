import React, { useState } from "react";
import styles from '../Revision.module.scss';
import TabLines from "../../../publicComponents/UI/TabLines";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";
import TableListInfo from "../../../publicComponents/UI/TableListInfo";

const Information: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Stamping');

    return (
        <div className={styles.information}>
            <TabLines tabs={['Stamping', 'Changes', 'Tables']} activeTab={activeTab} onTabClick={setActiveTab} />

            { activeTab === 'Stamping' &&
                <StampingInfo />
            }

            { activeTab === 'Changes' &&
                <div className={styles.changes}>
                    <div className={styles.tableListInfoWrap}>
                        <TableListInfo tableList={['table1', 'table2']} />
                    </div>
                    <div className={styles.tableChangeView}>
                        테이블 뷰 부분
                    </div>
                </div>
            }

            { activeTab === 'Tables' &&
                <div className={styles.tables}>
                    <div className={styles.tableListInfoWrap}>
                        <TableListInfo tableList={['table1', 'table2']} />
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
