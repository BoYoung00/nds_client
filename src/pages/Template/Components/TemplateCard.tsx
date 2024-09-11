import React from "react";
import styles from '../Template.module.scss';
import {Link} from "react-router-dom";

interface TemplateCardProp {
    imgUrl: string;
    title: string;
    category: string[];
}

const TemplateCard: React.FC<TemplateCardProp> = ({ imgUrl, title, category}) => {
    const token = localStorage.getItem('token');

    return (
        <>
            <div className={styles.templateCard} >
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
                <section className={styles.templateCard__overlay}>
                    <Link className={styles.customPageBut} to={`/workspace/${title}`}>커스텀 페이지 생성</Link>
                    <button className={styles.codeDownloadBut}>코드 다운로드</button>
                </section>
            </div>
        </>
    );
};


export default TemplateCard;