import styles from "./Ui.module.scss";
import React from "react";

interface StampingInfoProps {
    tableList: any[];
}

const StampingInfo: React.FC = () => {
    return (
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
    );
};

export default StampingInfo;