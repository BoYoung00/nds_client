import styles from '../Revision.module.scss';
import React, { useState, MouseEvent, useEffect } from "react";
import { formatDate } from "../../../utils/utils";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import {useRevision} from "../../../contexts/RevisionContext";

const HistoryTable: React.FC = () => {
    const { stampings, currentStampingID } = useRevision();
    const [selectedStampingID, setSelectedStampingID] = useState<number | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null); // 클릭 위치

    // 문서 클릭 이벤트 리스너 등록 및 제거
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    // 커밋 선택
    const handleRowClick = (StampingID: number) => {
        setSelectedStampingID(StampingID);
    };

    // 체크아웃 (더블 클릭)
    const handleRowDoubleClick = (StampingID: number) => {
        setQuestionMessage('해당 분기로 변경 하시겠습니까?');
    };

    // 오른쪽 클릭 시 컨텍스트 메뉴 표시
    const handleContextMenu = (event: MouseEvent, StampingID: number) => {
        event.preventDefault();
        setSelectedStampingID(StampingID);
        setContextMenu({ x: event.clientX, y: event.clientY});
        handleRowClick(StampingID); // 오른쪽 클릭 시 왼쪽 클릭 핸들러도 호출
    };

    // 문서 클릭 시 컨텍스트 메뉴 닫기
    const handleDocumentClick = () => {
        setContextMenu(null);
    };

    // 메뉴 옵션 클릭 핸들러
    const handleMenuOptionClick = (option: string) => {
        switch (option) {
            case 'reset':
                console.log('reset', selectedStampingID)
                break;
            case 'change':
                console.log('change', selectedStampingID)
                break;
            case 'export':
                console.log('export', selectedStampingID)
                break;
            default:
                break;
        }

        setContextMenu(null); // 메뉴 숨기기
    };

    return (
        <>
            <div className={styles.historyTable}>
                <div className={styles.historyTable__container}>
                    <table>
                        <thead>
                        <tr>
                            <th scope="col" className={styles.checkout}>check<br />out</th>
                            <th scope="col" className={styles.message}>stamping message</th>
                            <th scope="col" className={styles.date}>create date</th>
                            <th scope="col" className={styles.hash}>hash</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stampings && stampings.map((stamping) => (
                            <tr
                                key={stamping.id}
                                className={selectedStampingID === stamping.id ? styles.selected : ''}
                                onClick={() => handleRowClick(stamping.id!)}
                                onDoubleClick={() => handleRowDoubleClick(stamping.id!)}
                                onContextMenu={(e) => handleContextMenu(e, stamping.id!)} // 오른쪽 클릭 핸들러 추가
                            >
                                <td className={styles.StampingNow}>{currentStampingID === stamping.id ? '●' : ''}</td>
                                <td className={styles.StampingMsg}>{stamping.stampingMessage}</td>
                                <td className={styles.StampingDate}>{formatDate(stamping.createTime)}</td>
                                <td className={styles.StampingNum}>{stamping.checkSum}</td>
                            </tr>
                        ))}


                        </tbody>
                    </table>
                    { stampings.length === 0 &&
                        <p className={styles.centeredText}>내역이 없습니다.</p>
                    }
                </div>
            </div>

            {questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={() => {
                    console.log('Confirmed');
                }}
            />}

            {/* 컨텍스트 메뉴 */}
            {contextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <ul>
                        <li onClick={() => handleMenuOptionClick('reset')}>reset <span>(HARD)</span></li>
                        <li onClick={() => handleMenuOptionClick('change')}>change</li>
                        <li onClick={() => handleMenuOptionClick('export')}>export <span>(file)</span></li>
                    </ul>
                </div>
            )}
        </>
    );
};

export default HistoryTable;


