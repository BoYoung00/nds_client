import React, { useState } from 'react';
import styles from '../WebBuilder.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import doubleArrow from '../../../assets/images/doubleArrow.png';

const ApplyTableData: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className={`${styles.applyTableData} ${isVisible ? styles.show : ''}`}>
            <div className={styles.slideButtonContainer}>
                <div className={styles.slideButtonWrap}>
                    <img className={`${styles.slideButton} ${isVisible ? styles.show : ''}`}
                         onClick={handleToggle}
                         src={doubleArrow}
                    />
                </div>
            </div>
            <div className={styles.slideContainer}>
                <LineTitle text={'내 테이블 데이터 적용하기'} />
                <section className={styles.slideContainer__header}>
                    <input type="text" placeholder='데이터를 적용시킬 REST API URL을 붙여주세요. '/>
                    <button>적용</button>
                </section>
                <section className={styles.slideContainer__main}>
                    <div className={styles.headerTitle}>
                        <p>테이블 행 선택</p>
                    </div>
                    <div className={styles.columnContent}>
                        <ColumnSelect title={'헤더 이미지'}/>
                    </div>
                </section>
                <section className={styles.slideContainer__footer}>
                    <button>데이터 적용</button>
                </section>
            </div>
        </div>
    );
};

export default ApplyTableData;

interface ColumnSelectProps {
    title: string;
}

const ColumnSelect: React.FC<ColumnSelectProps> = ({ title }) => {
    return (
        <div className={styles.columnSelect}>
            <p>{title} 행</p>
            <select>
                <option value="">{title}로 사용할 행을 선택해주세요.</option>
            </select>
        </div>
    );
}