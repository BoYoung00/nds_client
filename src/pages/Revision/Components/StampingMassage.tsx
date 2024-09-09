import React from 'react';
import styles from '../Revision.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import {useStampingMassage} from "../hooks/useStampingMassage";

interface StampingMassageProp {
    isStampingPossible?: boolean;
}

const StampingMassage: React.FC<StampingMassageProp> = ({ isStampingPossible=false }) => {
    const {
        stampingMessage,
        successMessage,
        errorMessage,
        handleChange,
        handleSave,
        setSuccessMessage,
        setErrorMessage,
    } = useStampingMassage(isStampingPossible);

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

            { successMessage && <Notification
                onClose={() => {setSuccessMessage(null); window.location.reload(); }}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default StampingMassage;
