import React, {useEffect, useState} from 'react';
import styles from './WebBuilder.module.scss';
import {Link, useParams} from "react-router-dom";
import CopyButton from "../../publicComponents/UI/CopyButton";
import TabBar from "../../publicComponents/layout/TabBar";
import ApplyTableData from "./Components/ApplyTableData";
import {Notification} from "../../publicComponents/layout/modal/Notification";
import {userWorkspaceBuild} from "../../services/api";

// 임시 데이터
const exampleWorkspaceRequest: WorkspaceResponse = {
    connectURL: 'http://localhost:8080/api/json/8281d79bfeaebf8131d0e9b39e4e26a7026f4763232254d758ec6e6b36c4817',
    templateName: 'Board',
    page: 'main-list',
    buildURL: 'http//',
    columns: {
        itemImg: 'itemImg',
        itemName: 'itemName',
        itemPrice: 'itemPrice',
        itemCount: '2',
        shopName: 'Shop1',        // 추가된 예제
        shopComment: 'Great Shop', // 추가된 예제
        mainImgUrl: 'http://example.com/main.jpg', // 추가된 예제
        orderData: 'Order1' // 추가된 예제
    },
    htmlCode: '<div>Hello World</div>'
};

const WebBuilder: React.FC = () => {
    const { template } = useParams<{ template: string }>();

    const [workspaceData, setWorkspaceData] = useState<WorkspaceResponse | null>(null);

    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [tabs, setTabs] = useState<string[]>([]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!template) return;

        // 페이지 템플릿에 따른 탭 설정
        if (template === 'Shop') {
            setTabs(['main', 'cart', 'order', 'order-list']);
        } else if (template === 'Board') {
            setTabs(['login', 'sign-up', 'main-notice', 'main-list', 'view-notice', 'view-list', 'after_login-notice', 'after_login-list', 'write-user', 'write-admin']);
        }
    }, [template]);

    useEffect(() => {
        // handelFetchTemplateSSR();
        setWorkspaceData(exampleWorkspaceRequest); // 임시 데이터 사용
    }, [selectedTabIndex]);

    const handelFetchTemplateSSR = async () => {
        const userEmail = localStorage.getItem('email')
        if (!template || !userEmail || tabs.length === 0 || selectedTabIndex >= tabs.length) return; // 방어 코드 추가
        try {
            const response = await userWorkspaceBuild(template.toLowerCase(), tabs[selectedTabIndex], userEmail )
            setWorkspaceData(response);
            const mergePreviewElement = document.getElementById('template-preview');
            if (mergePreviewElement) mergePreviewElement.innerHTML = response.buildURL;
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    }

    return (
        <>
            <div className={styles.webBuilder}>
                <header className={styles.webBuilder__header}>
                    <Link to={'/workspace'}>목록으로 <br/> 돌아가기</Link>
                    <div className={styles.urlWrap}>
                        <span>페이지 URL : </span>
                        <input type="text" value={workspaceData?.buildURL ? workspaceData.buildURL : ''} readOnly />
                    </div>
                    <CopyButton url={workspaceData?.buildURL ? workspaceData.buildURL : ''} />
                </header>
                <main className={styles.webBuilder__main}>
                    <TabBar tabs={tabs} onTabSelect={(index) => setSelectedTabIndex(index)} background={'#F5F5F5'} width={3}/>
                    <section className={styles.pagePreview}>
                        <div id='template-preview'></div>
                        {/*{template} html 프리뷰 : {tabs[selectedTabIndex]}*/}
                    </section>
                    <ApplyTableData selectedTab={tabs[selectedTabIndex]} workspaceData={workspaceData}/>
                </main>
            </div>
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default WebBuilder;
