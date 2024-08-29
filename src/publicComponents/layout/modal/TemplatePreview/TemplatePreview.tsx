import React from 'react';
import styles from './TemplatePreview.module.scss';


interface TemplatePreviewProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    title: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ isOpenModal, onCloseModal, title }) => {


    if (!isOpenModal) return null;

    return (
        <div className={styles.templatePreview}>
            <section className={styles.templatePreview__background} onClick={() => onCloseModal(false)}>
                <p>X</p>
            </section>
            <section className={styles.templatePreview__container}>
                <header>
                    <button className={styles.dataEditBut}>데이터로 편집</button>
                    <button className={styles.downloadBut}>다운받기</button>
                </header>
                <main>
                    웹 템플릿 뷰 부분 ({title})
                </main>
            </section>
        </div>

    );
};

export default TemplatePreview;
