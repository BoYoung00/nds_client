import React, {ChangeEvent, useState} from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './Merge.module.scss';
import LineTitle from "../../../UI/LineTitle";
import doubleArrow from "../../../../assets/images/doubleArrow.png";
import {tableMergeConfirm, tableMergePreview, tableMergeSave} from "../../../../services/api";
import {Notification} from "../Notification";
import {useTable} from "../../../../contexts/TableContext";

interface MergeProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

interface TableInfo {
    name: string;
    comment: string;
}

const Merge: React.FC<MergeProps> = ({ isOpenModal, onCloseModal }) => {
    const { tables, setTables } = useTable();
    const [tableInfo, setTableInfo] = useState<TableInfo>({
        name: '',
        comment: '',
    });
    const [selectedTables, setSelectedTables] = useState<TableData[]>([]); // 테이블 2개 선택
    const [isMergePossibility, setIsMergePossibility] = useState<boolean | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTableInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (table: TableData) => {
        console.log('선택',table)
        setSelectedTables(prevSelectedTables => {
            if (prevSelectedTables.includes(table)) {
                // 이미 선택된 테이블이면 제거
                return prevSelectedTables.filter(name => name !== table);
            } else if (prevSelectedTables.length < 2) {
                // 선택된 테이블이 2개 미만이면 추가
                return [...prevSelectedTables, table];
            } else {
                // 3개째 선택 시, 가장 처음 선택된 테이블의 선택을 해제
                const [first, ...rest] = prevSelectedTables; // 첫번째 데이터: first, 그 뒤의 데이터: ...rest
                return [...rest, table];
            }
        });
    };

    // 병합 가능 여부 통신
    const handleFetchTableMergeConfirm = async (isSaveDirect: boolean) => {
        if (selectedTables.length !== 2) {
            setErrorMessage('두 개의 테이블을 선택해주세요.');
            return;
        }

        const tableMergeConfirmRequest: TableMergeConfirmRequest = {
            parentTableID: selectedTables[0].id,
            childTableID: selectedTables[1].id
        };

        try {
            const response: TableMergeConfirmResponse = await tableMergeConfirm(tableMergeConfirmRequest);
            if (response.tableConfirmResult) {
                setIsMergePossibility(true);

                if (!isSaveDirect) // 프리뷰 보기 버튼 눌렀을 시
                   await handleFetchTableMergePreview(tableMergeConfirmRequest);
            } else {
                setErrorMessage('두 테이블은 병합이 불가능 합니다. (이유 : PK 중복 또는 행 중복)')
            }
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 프리뷰 통신
    const handleFetchTableMergePreview = async (tableMergeConfirmRequest: TableMergeConfirmRequest) => {
        try {
            const response = await tableMergePreview(tableMergeConfirmRequest);
            const mergePreviewElement = document.getElementById('merge-preview');
            if (mergePreviewElement) mergePreviewElement.innerHTML = response;
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 병합 저장
    const handleFetchTableMergeSave = async () => {
        if (tableInfo.name === '') {
            setErrorMessage('테이블 이름을 작성해주세요.');
            return;
        }
        if (tableInfo.comment === '') {
            setErrorMessage('테이블 설명을 작성해주세요.');
            return;
        }
        if (isMergePossibility === null) // 프리뷰 안 보고 실행 시
            await handleFetchTableMergeConfirm(true);

        const tableMergeSaveRequest: TableMergeSaveRequest = {
            parentTableID: selectedTables[0].id,
            childTableID: selectedTables[1].id,
            newTableName: tableInfo.name,
            newTableComment: tableInfo.comment,
        };
        // console.log('tableMergeSaveRequest', tableMergeSaveRequest);
        try {
            const response = await tableMergeSave(tableMergeSaveRequest);
            setTables((prevTables) => {
                const filteredTables = prevTables.filter(item =>
                    !selectedTables.some(selected => selected.id === item.id)
                );
                return [...filteredTables, response];
            });
            setSuccessMessage('병합에 성공하셨습니다.')
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

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
                                            { tables.map((table, index) => (
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
                                            <p style={{fontSize: '.8rem', color: 'gray'}}>※ 해당 병합은 부모 테이블에 자식 테이블의 데이터가 합쳐 저장되며, 자식 테이블은 삭제 됩니다.</p>
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

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
                onConfirm={() => onCloseModal(false)}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default Merge;
