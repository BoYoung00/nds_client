import React, {useState} from "react";
import styles from '../Template.module.scss';
import {TemplatePreview} from "../../../publicComponents/layout/modal/TemplatePreview";

interface TemplateCardProp {
    imgUrl: string;
    title: string;
    category: string[];
}

const TemplateCard: React.FC<TemplateCardProp> = ({ imgUrl, title, category}) => {
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

    return (
        <>
            <div className={styles.templateCard} onClick={() => setIsOpenPreviewModal(true)}>
                <section className={styles.templateCard__container}>
                    <img src={imgUrl} alt={title}/>
                    <hr/>
                    <h2>{title}</h2>
                    <div className={styles.category}>
                        { category.map(item =>
                            <p>#{item}</p>
                        )}
                    </div>
                </section>
            </div>

            <TemplatePreview title={title} isOpenModal={isOpenPreviewModal} onCloseModal={setIsOpenPreviewModal} />
        </>

    );
};


export default TemplateCard;