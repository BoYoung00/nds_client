import React from 'react';
import styles from '../ErdMode.module.scss';
import addTable from '../../../assets/images/erd/addTable.webp';
import RemoveTable from '../../../assets/images/erd/deleteTable.webp';
import dataImage from '../../../assets/images/erd/data.webp';
import likeImage from '../../../assets/images/erd/like.webp';
import restApiImage from '../../../assets/images/erd/restApi.webp';
import sqlImage from '../../../assets/images/erd/sql.webp';
import classImage from '../../../assets/images/erd/class.webp';
import excelImage from '../../../assets/images/erd/excel.webp';
import resourceImage from '../../../assets/images/erd/resource.webp';
import { CreateTable } from "../../../publicComponents/layout/modal/CreateTable";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import {useRemoteControl} from "../hooks/useRemoteControl";

interface RemoteControlProps {
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ selectedIndex, onSelect }) => {
    const {
        isOpenCreateTableModal,
        setIsOpenCreateTableModal,
        questionMessage,
        setQuestionMessage,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        handleDelete,
        fetchDelete,
    } = useRemoteControl();

    const items = [
        { image: dataImage, text: 'DATA' },
        { image: restApiImage, text: 'REST API' },
        { image: likeImage, text: 'CUSTOM API' },
        { image: sqlImage, text: 'SQL' },
        { image: classImage, text: 'CLASS' },
        { image: excelImage, text: 'EXCEL' },
        { image: resourceImage, text: 'RESOURCE' },
    ];

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
            {questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={fetchDelete}
            />}

            {/*성공 모달*/}
            {successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            />}

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
