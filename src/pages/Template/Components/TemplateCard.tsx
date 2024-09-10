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
            <Link className={styles.templateCard} to={`/workspace/${title}`}>
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
            </Link>
        </>
    );
};


export default TemplateCard;