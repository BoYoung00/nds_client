import React from 'react';
import styles from './Template.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import TemplateCard from "./Components/TemplateCard";
import login from '../../assets/images/login_img1.png'

const Template: React.FC = () => {

    return (
        <div className={styles.template}>
            <section className={styles.template__container}>
                <header>
                    <LineTitle text={'내 작업 공간'}  fontSize={'2rem'} smallText={'본인만의 웹 사이트 템플릿을 선택하세요.'} isCenter={true} />
                </header>
                <main>
                    <TemplateCard imgUrl={login} title={'Board'} category={['게시판']} />
                    <TemplateCard imgUrl={login} title={'Shop'} category={['쇼핑몰']} />
                    <div className={`${styles.templateCard} ${styles.ready}`}>준비 중...</div>
                </main>
            </section>
        </div>
    );
};

export default Template;
