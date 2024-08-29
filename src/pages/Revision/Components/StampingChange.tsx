import styles from '../Revision.module.scss';
import TableListInfo from "../../../publicComponents/UI/TableListInfo";
import StampingInfo from "../../../publicComponents/UI/StampingInfo";
import {getDiffsPage, tableMergePreview} from "../../../services/api";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useEffect, useState} from "react";
import {useDataBase} from "../../../contexts/DataBaseContext";

const StampingChange = () => {
    const { selectedDataBase } = useDataBase();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // handleFetchStampingPreview();
    }, []);

    // 변경 사항 프리뷰 통신
    const handleFetchStampingPreview = async () => {
        if (!selectedDataBase) return;

        try {
            const response = await getDiffsPage(selectedDataBase.id!);
            const mergePreviewElement = document.getElementById('change-preview');
            if (mergePreviewElement) mergePreviewElement.innerHTML = response;
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return (
        <>
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
                    <div id='change-preview'></div>
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

StampingChange.propTypes = {

};

export default StampingChange;