import styles from '../Revision.module.scss';
import React, {useState} from "react";
import {formatDate} from "../../../utils/utils";
import {Notification} from "../../../publicComponents/layout/modal/Notification";

const exampleCommits: VcsFileEntity[] = [
    {
        id: 1,
        path: "/src/components/HistoryTable.tsx",
        checkSum: "abcd1234",
        createTime: "2024-08-23T10:00:00Z",
        isCurrent: "Y",
        databaseID: 101
    },
    {
        id: 2,
        path: "/src/utils/helpers.ts",
        checkSum: "efgh5678",
        createTime: "2024-08-22T14:32:00Z",
        isCurrent: "N",
        databaseID: 101
    },
    {
        id: 3,
        path: "/src/services/api.ts",
        checkSum: "ijkl9101",
        createTime: "2024-08-21T08:45:00Z",
        isCurrent: "N",
        databaseID: 101
    },
    {
        id: 4,
        path: "/src/index.tsx",
        checkSum: "mnop1121",
        createTime: "2024-08-20T16:20:00Z",
        isCurrent: "Y",
        databaseID: 101
    }
];

const HistoryTable: React.FC = () => {
    const [commits, setCommits] = useState<VcsFileEntity[] | null>(exampleCommits);

    const [selectedCommitID, setSelectedCommitID] = useState<number | null>(null);
    const [checkoutCommitId , setCheckoutCommitId] = useState<number | null>(null);

    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    // 커밋 선택
    const handleRowClick = (commitID: number) => {
        setSelectedCommitID(commitID);
    };

    // 체크아웃 (더블 클릭)
    const handleRowDoubleClick = (commitID: number) => {
        setQuestionMessage('해당 분기로 체크아웃 하시겠습니까?')
    };

    return (
        <>
            <div className={styles.historyTable}>
                <div className={styles.historyTable__container}>
                    <table>
                        <thead>
                        <tr>
                            <th scope="col" className={styles.checkout}>check<br/>out</th>
                            <th scope="col" className={styles.message}>stamping message</th>
                            <th scope="col" className={styles.date}>create date</th>
                            <th scope="col" className={styles.hash}>hash</th>
                        </tr>
                        </thead>
                        <tbody>
                        {commits && commits.map((commit, index) => (
                            <tr key={index}
                                className={`${styles.item} ${selectedCommitID === commit.id ? styles.selected : ''}`}
                                onClick={() => handleRowClick(commit.id)}
                                onDoubleClick={() => handleRowDoubleClick(index)}
                            >
                                <td className={styles.CommitChartTitleNow}>{checkoutCommitId === commit.id ? '●' : ''}</td>
                                <td className={styles.CommitChartTitleMsg}>{commit.path}</td>
                                <td className={styles.CommitChartTitleDate}>{formatDate(commit.createTime)}</td>
                                <td className={styles.CommitChartTitleNum}>{commit.checkSum}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>

            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={() => {
                    console.log('Confirmed');
                }}
            /> }
        </>
    );
};

HistoryTable.propTypes = {

};

export default HistoryTable;