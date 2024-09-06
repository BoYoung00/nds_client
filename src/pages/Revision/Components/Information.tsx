import React, { useState } from "react";
import styles from '../Revision.module.scss';
import TabLines from "../../../publicComponents/UI/TabLines";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";
import TableListInfo from "../../../publicComponents/UI/TableListInfo";
import ChangePreviewTable from "./ChangePreviewTable";
import {useRevision} from "../../../contexts/RevisionContext";

const Information: React.FC = () => {
    const { stampingChanges } = useRevision();

    const [activeTab, setActiveTab] = useState<string>('Stamping');
    const [selectedTableName, setSelectedTableName] = useState<string | null>(null); // 선택된 key1 값을 관리

    const tableNames = stampingChanges ? Object.keys(stampingChanges) : [];

    return (
        <div className={styles.information}>
            <TabLines tabs={['Stamping', 'Changes']} activeTab={activeTab} onTabClick={setActiveTab} />

            { activeTab === 'Stamping' &&
                <StampingInfo />
            }

            { activeTab === 'Changes' &&
                <div className={styles.changes}>
                    <div className={styles.tableListInfoWrap}>
                        <TableListInfo
                            tableList={tableNames}
                            selectedTableName={selectedTableName}
                            setSelectedTableName={setSelectedTableName}
                        />
                    </div>
                    <div className={styles.tableChangeView}> {/*변경 사항 프리뷰*/}
                        <ChangePreviewTable
                            selectedTableName={selectedTableName}
                            stampingData={stampingChanges}
                        />
                    </div>
                </div>
            }
        </div>
    );
};

export default Information;
