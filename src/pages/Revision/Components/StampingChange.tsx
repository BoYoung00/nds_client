import React from "react";
import styles from '../Revision.module.scss';
import TableListInfo from "../../../publicComponents/UI/TableListInfo";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";
import ChangePreviewTable from './ChangePreviewTable';
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import {useStampingChange} from "../hooks/useStampingChange";
import {useRevision} from "../../../contexts/RevisionContext";
import StampingMassage from "./StampingMassage";

const StampingChange = () => {
    const { currentStamping } = useRevision();

    const {
        selectedTableName,
        setSelectedTableName,
        stampingData,
        tableNames,
        isStampingPossible,
        errorMessage,
        setErrorMessage,
    } = useStampingChange();

    return (
        <>
            <div className={styles.stampingChange}>
                <section className={styles.leftContainer}>
                    <div>
                        <p className={styles.title} style={{borderTopLeftRadius: '4px'}}>Tables State</p>
                        <TableListInfo
                            tableList={tableNames}
                            selectedTableName={selectedTableName}
                            setSelectedTableName={setSelectedTableName}
                        />
                    </div>
                    <div>
                        <p className={styles.title}>Staged Information</p>
                        <StampingInfo stampingInfo={currentStamping}/>
                    </div>
                </section>
                <section className={styles.rightContainer}>
                    <ChangePreviewTable
                        selectedTableName={selectedTableName}
                        stampingData={stampingData}
                    />
                </section>
            </div>
            <StampingMassage isStampingPossible={isStampingPossible} />

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default StampingChange;
