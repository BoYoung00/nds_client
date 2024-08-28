import styles from '../Revision.module.scss';
import TableListInfo from "../../../publicComponents/UI/TableListInfo";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";

const StampingChange = () => {

    return (
        <div className={styles.stampingChange}>
            <section className={styles.leftContainer}>
                <div>
                    <p className={styles.title} style={{borderTopLeftRadius: '4px'}}>Unstaged Changes</p>
                    <TableListInfo tableList={['테이블1', '테이블2']} />
                </div>
                <div>
                    <p className={styles.title}>Staged Information</p>
                    <StampingInfo />
                </div>
            </section>
            <section className={styles.rightContainer}>
                변경 사항 표 부분
           </section>
        </div>
    );
};

StampingChange.propTypes = {

};

export default StampingChange;