import React from 'react';
import styles from './Template.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import TemplateCard from "./Components/TemplateCard";
import board from '../../assets/images/workspace/board.png'
import gallery from '../../assets/images/workspace/gallery.png'
import shop from '../../assets/images/workspace/shop.png'
import todo from '../../assets/images/workspace/todo.png'


const Template: React.FC = () => {

    return (
        <div className={styles.template}>
            <section className={styles.template__container}>
                <header>
                    <LineTitle text={'내 작업 공간'}  fontSize={'2rem'} smallText={'본인만의 웹 사이트 템플릿을 선택하세요.'} isCenter={true} />
                </header>
                <main>
                    <TemplateCard imgUrl={board} title={'Board'} category={['게시판']} />
                    <TemplateCard imgUrl={shop} title={'Shop'} category={['쇼핑몰', '장바구니']} />
                    <TemplateCard imgUrl={todo} title={'Todo'} category={['일정 관리']} />
                    <TemplateCard imgUrl={gallery} title={'Gallery'} category={['작품 전시', '작품 관리']} />
                    <div className={`${styles.templateCard} ${styles.ready}`}>준비 중...</div>
                </main>
            </section>
        </div>
    );
};

export default Template;
