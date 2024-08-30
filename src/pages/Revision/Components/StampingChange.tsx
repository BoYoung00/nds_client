import styles from '../Revision.module.scss';
import TableListInfo from "../../../publicComponents/UI/TableListInfo";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";
import { revisionDataDiffData } from "../../../services/api";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import { useEffect, useState } from "react";
import { useDataBase } from "../../../contexts/DataBaseContext";
import ChangePreviewTable from './ChangePreviewTable';

const StampingChange = () => {
    const { selectedDataBase } = useDataBase();

    const [selectedTableName, setSelectedTableName] = useState<string | null>(null); // 선택된 테이블 이름(key1) 값을 관리
    const [stampingData, setStampingData] = useState<StampingDataMap | null>(null); // StampingDataMap 타입의 데이터를 관리

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        handleFetchDiffData();
    }, [selectedDataBase]);

    // 변경 사항 프리뷰 통신
    const handleFetchDiffData = async () => {
        if (!selectedDataBase) return;

        try {
            const response: StampingDataMap = await revisionDataDiffData(selectedDataBase.id!);
            setStampingData(response);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 테이블 이름 (key1) 리스트를 추출
    const tableNames = stampingData ? Object.keys(stampingData) : [];

    return (
        <>
            <div className={styles.stampingChange}>
                <section className={styles.leftContainer}>
                    <div>
                        <p className={styles.title} style={{borderTopLeftRadius: '4px'}}>Unstaged Changes</p>
                        <TableListInfo
                            tableList={tableNames}
                            selectedTableName={selectedTableName}
                            setSelectedTableName={setSelectedTableName}
                        />
                    </div>
                    <div>
                        <p className={styles.title}>Staged Information</p>
                        <StampingInfo />
                    </div>
                </section>
                <section className={styles.rightContainer}> {/*변경 사항 프리뷰*/}
                    <ChangePreviewTable
                        selectedTableName={selectedTableName}
                        stampingData={stampingData}
                    />
                </section>
            </div>

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default StampingChange;
