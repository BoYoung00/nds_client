import React, {useState} from 'react';
import styles from '../ErdMode.module.scss';
import addTable from '../../../assets/images/erd/addTable.png';
import deleteTable from '../../../assets/images/erd/deleteTable.png';
import dataImage from '../../../assets/images/erd/data.png';
import likeImage from '../../../assets/images/erd/like.png';
import restApiImage from '../../../assets/images/erd/restApi.png';
import queryImage from '../../../assets/images/erd/query.png';
import excelImage from '../../../assets/images/erd/excel.png';
import resourceImage from '../../../assets/images/erd/resource.png';
import {CreateTable} from "../../../publicComponents/layout/modal/CreateTable";

interface RemoteControlProps {
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ selectedIndex, onSelect }) => {
    const [isOpenCreateTableModal, setIsOpenCreateTableModal] = useState<boolean>(false);

    const items = [
        { image: dataImage, text: 'DATA' },
        { image: likeImage, text: 'LIKE' },
        { image: restApiImage, text: 'REST API' },
        { image: queryImage, text: 'QUERY' },
        { image: excelImage, text: 'EXCEL' },
        { image: resourceImage, text: 'RESOURCE' },
    ];

    return (
        <>
            <div className={styles.remoteControl}>
                <div className={styles.controlItem} onClick={() => setIsOpenCreateTableModal(true)}>
                    <img src={addTable} alt='add' className={styles.icon} />
                    <span className={styles.label}>CREATE<br />TABLE</span>
                </div>
                <div className={styles.controlItem}>
                    <img src={deleteTable} alt='delete' className={styles.icon} />
                    <span className={styles.label}>DELETE<br />TABLE</span>
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
            />
        </>
    );
};

export default RemoteControl;
