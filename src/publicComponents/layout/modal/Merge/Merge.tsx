import React, {ChangeEvent, useState} from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './Merge.module.scss';
import {useDataBase} from "../../../../contexts/DataBaseContext";
import LineTitle from "../../../UI/LineTitle";
import doubleArrow from "../../../../assets/images/doubleArrow.png";
import TableView from "../../TableView";

interface MergeProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

interface TableInfo {
    name: string;
    comment: string;
}

const Merge: React.FC<MergeProps> = ({ isOpenModal, onCloseModal }) => {
    const { selectedDataBase, tables } = useDataBase();
    const [filteredTableStructure, setFilteredTableStructure] = useState<TableInnerStructure | null>(null);
    const [tableInfo, setTableInfo] = useState<TableInfo>({
        name: '',
        comment: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTableInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    if (!isOpenModal) return null;

    return (
        <BackgroundModal
            width={90}
            height={60}
            onClose={onCloseModal}
        >
            <div className={styles.merge}>
                <LineTitle text={"테이블 병합하기"} />
                <div className={styles.merge__container}>
                    <main className={styles.mergeChoiceContainer}>
                        <section className={styles.headerTitle}>
                            <p>병합 테이블 선택</p>
                        </section>
                        <section className={styles.tableChoiceMainBox}>
                            <div className={styles.tableChoiceBox}>
                                <div className={styles.tables}>
                                    <span className={styles.table}>
                                        <input type="checkbox" id="scales" name="scales" defaultChecked />
                                        <label htmlFor="scales">테이블</label>
                                    </span>
                                </div>
                                <button className={styles.previewBut}>프리뷰 보기</button>
                            </div>
                            <img className={styles.doubleArrowImg} src={doubleArrow} alt="화살표" />
                            <div className={styles.previewBox} style={{ padding: '0' }}>
                                <TableView tableStructure={filteredTableStructure} />
                            </div>
                        </section>
                    </main>
                    <aside className={styles.mergeInfoContainer}>
                        <section className={styles.mergeInfoBox}>
                            <section className={styles.headerTitle}>
                                <p>병합 테이블 선택</p>
                            </section>
                            <div className={styles.mergeInfoBox__group}>
                                <label htmlFor="name">테이블명</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    onChange={handleChange}
                                    value={tableInfo.name}
                                />
                            </div>
                            <div className={styles.mergeInfoBox__group}>
                                <label htmlFor="comment">설명 <span>(선택 사항)</span></label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    onChange={handleChange}
                                    value={tableInfo.comment}
                                />
                            </div>
                        </section>
                        <button className={styles.mergeBut}>병합하기</button>
                    </aside>
                </div>
            </div>
        </BackgroundModal>
    );
};

export default Merge;
