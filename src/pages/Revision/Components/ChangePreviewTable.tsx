import React from 'react';
import styles from '../Revision.module.scss';

interface StampingDiffDTO {
    data: string;
    state: number;
}

type StampingDataMap = Record<string, Record<string, StampingDiffDTO[]>>;

interface ChangePreviewTableProps {
    selectedTableName: string | null;
    stampingData: StampingDataMap | null;
}

const ChangePreviewTable: React.FC<ChangePreviewTableProps> = ({ selectedTableName, stampingData }) => {
    if (!selectedTableName || !stampingData) {
        return <p className={styles.centeredText}>테이블을 선택해주세요.</p>;
    }

    const tableData = stampingData[selectedTableName];
    const key2List = Object.keys(tableData);
    const maxRows = Math.max(...key2List.map(key2 => tableData[key2].length));

    return (
        <div className={styles.changePreviewTable}>
            <table>
                <thead>
                <tr>
                    {key2List.map(key2 => (
                        <th key={key2}>{key2}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {Array.from({ length: maxRows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {key2List.map(key2 => {
                            const item = tableData[key2][rowIndex];
                            return (
                                <td key={key2}>
                                    {item ? (
                                        <div
                                            className={`${styles.stampingItem} 
                                                        ${item.state === 0 ? styles.stampingItemGreen :
                                                        item.state === 1 ? styles.stampingItemRed :
                                                        styles.stampingItemTransparent}`}
                                        >
                                            {item.data}
                                        </div>
                                    ) : (
                                        <div className={styles.stampingItem}></div> // 빈 셀
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChangePreviewTable;
