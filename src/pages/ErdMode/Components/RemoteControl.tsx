import React, {useState} from 'react';
import styles from '../ErdMode.module.scss';
import addTable from '../../../assets/images/erd/addTable.png';
import RemoveTable from '../../../assets/images/erd/deleteTable.png';
import dataImage from '../../../assets/images/erd/data.png';
import likeImage from '../../../assets/images/erd/like.png';
import restApiImage from '../../../assets/images/erd/restApi.png';
import sqlImage from '../../../assets/images/erd/sql.png';
import classImage from '../../../assets/images/erd/class.png';
import excelImage from '../../../assets/images/erd/excel.png';
import resourceImage from '../../../assets/images/erd/resource.png';
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useTable} from "../../../contexts/TableContext";
import {deleteTable} from "../../../services/api";

interface RemoteControlProps {
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ selectedIndex, onSelect }) => {
    const { tables, setTables, selectedTable, setSelectedTable } = useTable();

    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);
    
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const items = [
        { image: dataImage, text: 'DATA' },
        { image: restApiImage, text: 'REST API' },
        { image: likeImage, text: 'CUSTOM API' },
        { image: sqlImage, text: 'SQL' },
        { image: classImage, text: 'CLASS' },
        { image: excelImage, text: 'EXCEL' },
        { image: resourceImage, text: 'RESOURCE' },
    ];

    const handleDelete = () => {
        if (selectedTable === null) {
            setErrorMessage("엔티티를 선택해주세요.");
        } else {
            setQuestionMessage(`${selectedTable.name} 엔티티를 삭제 하시겠습니까?`);
        }
    };

    const FetchDelete = async () => {
        if(!selectedTable) return;

        try {
            const response = await deleteTable(selectedTable.id!);
            await setTables(tables.filter(table => table !== selectedTable));
            setSelectedTable(null);
            setSuccessMessage(response.message);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return (
        <>
            <div className={styles.remoteControl}>
                <div className={styles.controlItem} onClick={() => setIsOpenCreateTableModal(true)}>
                    <img src={addTable} alt='add' className={styles.icon} />
                    <span className={styles.label}>CREATE<br />ENTITY</span>
                </div>
                <div className={styles.controlItem} onClick={handleDelete}>
                    <img src={RemoveTable} alt='remove' className={styles.icon} />
                    <span className={styles.label}>DELETE<br />ENTITY</span>
                </div>
                <hr />
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.controlItem} ${selectedIndex === index ? styles.selected : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        <img src={item.image} alt={item.text} className={styles.icon} />
                        <span className={styles.label}>{item.text}</span>
                    </div>
                ))}
            </div>

            {/* 테이블 생성 모달 */}
            <CreateTable
                isOpenModal={isOpenCreateTableModal}
                onCloseModal={() => setIsOpenCreateTableModal(false)}
                isEntity={true}
            />

            {/*테이블 삭제*/}
            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={FetchDelete}
            /> }

            {/*성공 모달*/}
            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            {/* 오류 모달 */}
            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}
        </>
    );
};

export default RemoteControl;
