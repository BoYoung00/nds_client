import React from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './Merge.module.scss';
import LineTitle from "../../../UI/LineTitle";
import doubleArrow from "../../../../assets/images/doubleArrow.png";
import { Notification } from "../Notification";
import {useTable} from "../../../../contexts/TableContext";
import {useMerge} from "./useMerge"; // 훅 임포트

interface MergeProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const Merge: React.FC<MergeProps> = ({ isOpenModal, onCloseModal }) => {
    const { tables } = useTable();

    const {
        tableInfo,
        selectedTables,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        handleChange,
        handleCheckboxChange,
        handleFetchTableMergeConfirm,
        handleFetchTableMergeSave
    } = useMerge();

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={90}
                height={80}
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
                                <section className={styles.tableChoiceBox}>
                                    <div className={styles.tableBox}>
                                        <div className={styles.tables}>
                                            {tables.map((table, index) => (
                                                <span key={index} className={styles.table}>
                                                    <input
                                                        type="checkbox"
                                                        id={table.name}
                                                        checked={selectedTables.includes(table)}
                                                        onChange={() => handleCheckboxChange(table)}
                                                    />
                                                    <label htmlFor={table.name}>{table.name}</label>
                                                </span>
                                            ))}
                                        </div>
                                        <span className={styles.comment}>
                                            <p>부모 테이블 : {selectedTables[0] && selectedTables[0].name }</p>
                                            <p>자식 테이블 : {selectedTables[1] && selectedTables[1].name}</p>
                                            <p style={{ fontSize: '.8rem', color: 'gray' }}>※ 해당 병합은 부모 테이블에 자식 테이블의 데이터가 합쳐 저장되며, 자식 테이블은 삭제 됩니다.</p>
                                        </span>
                                    </div>
                                    <button className={styles.previewBut} onClick={() => handleFetchTableMergeConfirm(false)}>프리뷰 보기</button>
                                </section>
                                <section className={styles.doubleArrowImgBox}>
                                    <img className={styles.doubleArrowImg} src={doubleArrow} alt="화살표" />
                                </section>
                                <section className={styles.previewBox} style={{ padding: '0' }}>
                                    <div id='merge-preview' />
                                </section>
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
                                    <label htmlFor="comment">설명</label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        onChange={handleChange}
                                        value={tableInfo.comment}
                                    />
                                </div>
                            </section>
                            <button className={styles.mergeBut} onClick={handleFetchTableMergeSave}>병합하기</button>
                        </aside>
                    </div>
                </div>
            </BackgroundModal>

            {successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
                onConfirm={() => onCloseModal(false)}
            />}

            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}
        </>
    );
};

export default Merge;