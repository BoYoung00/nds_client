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
                    <TemplateCard imgUrl={login} title={'Test'} category={['테스트1', '테스트2']} />
                    <TemplateCard imgUrl={login} title={'Test'} category={['테스트1', '테스트2']} />
                    <TemplateCard imgUrl={login} title={'Test'} category={['테스트1', '테스트2']} />
                    <TemplateCard imgUrl={login} title={'Test'} category={['테스트1', '테스트2']} />
                </main>
            </section>
        </div>
    );
};

export default Template;
