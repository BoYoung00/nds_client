import React, {useState} from 'react';
import styles from './WebBuilder.module.scss';
import {Link, useParams} from "react-router-dom";
import CopyButton from "../../publicComponents/UI/CopyButton";
import TabBar from "../../publicComponents/layout/TabBar";
import ApplyTableData from "./Components/ApplyTableData";


const WebBuilder: React.FC = () => {
    const { page } = useParams();
    const [selectedTab, setSelectedTab] = useState<number>(-1);

    return (
        <div className={styles.webBuilder}>
            <header className={styles.webBuilder__header}>
                <Link to={'/workspace'}>목록으로 <br/> 돌아가기</Link>
                <div className={styles.urlWrap}>
                    <span>페이지 URL : </span>
                    <input type="text" value={'http://'}/>
                </div>
                <CopyButton url={'http://'} />
            </header>
            <main className={styles.webBuilder__main}>
                <TabBar tabs={['Main', 'List']} onTabSelect={(index) => setSelectedTab(index)} background={'#F5F5F5'}/>
                <section className={styles.pagePreview}>
                    {page} html 프리뷰
                </section>
                <ApplyTableData />
            </main>
        </div>
    );
};

export default WebBuilder;
