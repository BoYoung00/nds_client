import React, {useEffect} from "react";
import { formatDate } from "../../../utils/utils";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import styles from '../Revision.module.scss';
import {useHistoryTable} from "../hooks/useHistoryTable";
import {useRevision} from "../../../contexts/RevisionContext";

const HistoryTable: React.FC = () => {
    const {
        searchStampings,
        currentStamping,
        selectedStamping,
        handelResetSearchStamping
    } = useRevision();

    const {
        questionMessage,
        successMessage,
        errorMessage,
        contextMenu,
        handleRowClick,
        handleRowDoubleClick,
        handleContextMenu,
        handleMenuOptionClick,
        setQuestionMessage,
        setSuccessMessage,
        setErrorMessage,
        confirmAction,
    } = useHistoryTable();

    useEffect(() => {
        handelResetSearchStamping();
    }, [])

    return (
        <>
            <div className={styles.historyTable}>
                <div className={styles.historyTable__container}>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col" className={styles.state}>state</th>
                                <th scope="col" className={styles.message}>stamping message</th>
                                <th scope="col" className={styles.date}>create date</th>
                                <th scope="col" className={styles.hash}>hash</th>
                            </tr>
                        </thead>
                        <tbody>
                        {searchStampings && searchStampings.map((stamping) => (
                            <tr
                                key={stamping.stampingId}
                                className={selectedStamping === stamping ? styles.selected : ''}
                                onClick={() => handleRowClick(stamping)}
                                onDoubleClick={() => handleRowDoubleClick()}
                                onContextMenu={(e) => handleContextMenu(e, stamping)} // 오른쪽 클릭 핸들러 추가
                            >
                                <td className={styles.StampingNow}>{currentStamping === stamping ? '●' : ''}</td>
                                <td className={styles.StampingMsg}>{stamping.message}</td>
                                <td className={styles.StampingDate}>{formatDate(stamping.createTime)}</td>
                                <td className={styles.StampingNum}>{stamping.stampingHash.slice(0, 6)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {searchStampings.length === 0 && (
                        <p className={styles.centeredText}>내역이 없습니다.</p>
                    )}
                </div>
            </div>

            {questionMessage && (
                <Notification
                    onClose={() => setQuestionMessage(null)}
                    type="question"
                    message={questionMessage}
                    onConfirm={() => {
                        if (confirmAction) confirmAction(); // 해당 기능 실행
                    }}
                />
            )}

            {successMessage && (
                <Notification
                    onClose={() => { setSuccessMessage(null); window.location.reload() }}
                    type="success"
                    message={successMessage}
                />
            )}

            {errorMessage && (
                <Notification
                    onClose={() => setErrorMessage(null)}
                    type="error"
                    message={errorMessage}
                />
            )}

            {/* 컨텍스트 메뉴 */}
            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <ul>
                        <li onClick={() => handleMenuOptionClick('reset')}>
                            reset <span>(HARD)</span>
                        </li>
                        <li onClick={() => handleMenuOptionClick('change')}>
                            change
                        </li>
                        {/*<li onClick={() => handleMenuOptionClick('export')}>*/}
                        {/*    export <span>(file)</span>*/}
                        {/*</li>*/}
                    </ul>
                </div>
            )}
        </>
    );
};

export default HistoryTable;
