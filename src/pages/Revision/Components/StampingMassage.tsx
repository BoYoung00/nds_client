import styles from '../Revision.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";

const StampingMassage = () => {
    return (
        <div className={styles.stampingMassage}>
            <section className={styles.stampingMassage__container}>
                <LineTitle text={'Stamping Message'} fontSize={'1.4rem'} />
                <textarea className={styles.messageInput} placeholder='메세지를 입력해주세요.'/>
                <div className={styles.stampingButWrap}>
                    <button className={styles.stampingBut}>내역 저장</button>
                </div>
            </section>
        </div>
    );
};

export default StampingMassage;