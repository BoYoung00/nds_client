import React, {useEffect, useState} from 'react';
import styles from './WebBuilder.module.scss';
import {Link, useParams} from "react-router-dom";
import CopyButton from "../../publicComponents/UI/CopyButton";
import TabBar from "../../publicComponents/layout/TabBar";
import ApplyTableData from "./Components/ApplyTableData";

const WebBuilder: React.FC = () => {
    const { page } = useParams<{ page: string }>();
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [tabs, setTabs] = useState<string[]>([]);

    useEffect(() => {
        if (!page) return;

        // 페이지 템플릿에 따른 탭 설정
        if (page === 'Shop') {
            setTabs(['main', 'cart', 'order', 'order-list']);
        } else if (page === 'Board') {
            setTabs(['login', 'sign-up', 'main-notice', 'main-list', 'view-notice', 'view-list', 'after_login-notice', 'after_login-list', 'write-user', 'write-admin']);
        }
    }, [page]);

    return (
        <div className={styles.webBuilder}>
            <header className={styles.webBuilder__header}>
                <Link to={'/workspace'}>목록으로 <br/> 돌아가기</Link>
                <div className={styles.urlWrap}>
                    <span>페이지 URL : </span>
                    <input type="text" value={'http://'} readOnly/>
                </div>
                <CopyButton url={'http://'} />
            </header>
            <main className={styles.webBuilder__main}>
                <TabBar tabs={tabs} onTabSelect={(index) => setSelectedTabIndex(index)} background={'#F5F5F5'} width={3}/>
                <section className={styles.pagePreview}>
                    {page} html 프리뷰 : {tabs[selectedTabIndex]}
                </section>
                <ApplyTableData selectedTab={tabs[selectedTabIndex]} />
            </main>
        </div>
    );
};

export default WebBuilder;
