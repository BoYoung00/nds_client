import React, { useState } from 'react';
import styles from '../Revision.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {revisionDataFirstCommit} from "../../../services/api";
import {useDataBase} from "../../../contexts/DataBaseContext";

const StampingMassage: React.FC = () => {
    const { selectedDataBase } = useDataBase();

    const [stampingMessage, setStampingMessage] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStampingMessage(event.target.value);
    };

    // 커밋 저장
    const handleSave = async () => {
        if (!selectedDataBase) return;
        console.log('통신된 현재 데이터베이스 ID : ', selectedDataBase.id!);
        console.log('통신된 커밋 메세지 : ', stampingMessage);
        try {
            const response = await revisionDataFirstCommit(selectedDataBase.id!, stampingMessage);
            console.log('스탬핑 저장 반환', response)
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return (
        <>
            <div className={styles.stampingMassage}>
                <section className={styles.stampingMassage__container}>
                    <LineTitle text={'Stamping Message'} fontSize={'1.4rem'} />
                    <textarea
                        className={styles.messageInput}
                        placeholder='메세지를 입력해주세요.'
                        value={stampingMessage}
                        onChange={handleChange}
                    />
                    <div className={styles.stampingButWrap}>
                        <button
                            className={styles.stampingBut}
                            onClick={handleSave}
                        >
                            내역 저장
                        </button>
                    </div>
                </section>
            </div>

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default StampingMassage;
