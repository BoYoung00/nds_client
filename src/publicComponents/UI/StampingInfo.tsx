import styles from "./Ui.module.scss";
import React from "react";
import {formatDate} from "../../utils/utils";

interface StampingInfoProps {
    stampingInfo: StampingEntity | null;
}

const StampingInfo: React.FC<StampingInfoProps> = ({stampingInfo}) => {

    return (
        <div className={styles.stamping}>
            <p>
                <span>SHA</span>
                <span>{stampingInfo?.stampingHash}</span>
            </p>
            <p>
                <span>CREATE</span>
                <span>{stampingInfo ? formatDate(stampingInfo.createTime) : ''}</span>
            </p>
            <p>
                <span>MESSAGE</span>
                <span>{stampingInfo?.message}</span>
            </p>
        </div>
    );
};

export default StampingInfo;