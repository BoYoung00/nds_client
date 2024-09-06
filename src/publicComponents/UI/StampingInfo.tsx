import styles from "./Ui.module.scss";
import React from "react";
import {useRevision} from "../../contexts/RevisionContext";
import {formatDate} from "../../utils/utils";

interface StampingInfoProps {
    tableList: any[];
}

const StampingInfo: React.FC = () => {
    const { selectedStamping } = useRevision();

    return (
        <div className={styles.stamping}>
            <p>
                <span>SHA</span>
                <span>{selectedStamping?.stampingHash}</span>
            </p>
            <p>
                <span>CREATE</span>
                <span>{selectedStamping ? formatDate(selectedStamping.createTime) : ''}</span>
            </p>
            <p>
                <span>MESSAGE</span>
                <span>{selectedStamping?.message}</span>
            </p>
        </div>
    );
};

export default StampingInfo;