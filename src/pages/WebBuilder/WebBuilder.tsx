import React, {useEffect, useState, useCallback, useMemo} from 'react';
import styles from './WebBuilder.module.scss';
import { Link, useParams } from 'react-router-dom';
import CopyButton from '../../publicComponents/UI/CopyButton';
import TabBar from '../../publicComponents/layout/TabBar';
import ApplyTableData from './Components/ApplyTableData';
import { Notification } from '../../publicComponents/layout/modal/Notification';
import { getWorkspaceData, userWorkspaceBuild } from '../../services/api';

const tabConfig: { [key: string]: string[] } = {
    Shop: ['main', 'cart', 'order-list'],
    Board: [
        'login',
        'sign-up',
        'main-notice',
        'main-list',
        'view-notice',
        'view-list',
        'after_login-notice',
        'after_login-list',
        'write-user',
        'write-admin',
    ],
};

const WebBuilder: React.FC = () => {
    const { template } = useParams<{ template: string }>();
    const [workspaceData, setWorkspaceData] = useState<WorkspaceResponse | null>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const tabs = useMemo(() => {
        if (!template) return [];
        return tabConfig[template] || [];
    }, [template]);

    const handleError = useCallback((error: unknown) => {
        const errorMsg = (error as Error).message || '알 수 없는 오류가 발생하였습니다.';
        setErrorMessage(errorMsg);
    }, []);

    // 템플릿 테이블 매핑 데이터 통신
    const fetchTemplateData = useCallback(async () => {
        const userEmail = localStorage.getItem('email');
        if (!template || !userEmail || tabs.length === 0 || selectedTabIndex >= tabs.length) return;

        try {
            const response = await getWorkspaceData(template.toLowerCase(), tabs[selectedTabIndex], userEmail);
            console.log('템플릿 테이블 매핑 데이터', response)
            setWorkspaceData(response);
        } catch (error) {
            handleError(error);
        }
    }, [template, tabs, selectedTabIndex, handleError]);

    // 템플릿 SSR 통신
    const fetchTemplateSSR = useCallback(async () => {
        const userEmail = localStorage.getItem('email');
        if (!template || !userEmail || tabs.length === 0 || selectedTabIndex >= tabs.length) return;

        try {
            const response = await userWorkspaceBuild(template.toLowerCase(), tabs[selectedTabIndex], userEmail);
            setHtmlContent(response);
        } catch (error) {
            handleError(error);
        }
    }, [template, tabs, selectedTabIndex, handleError]);

    useEffect(() => {
        if (template) {
            fetchTemplateSSR();
            fetchTemplateData();
        }
    }, [template, selectedTabIndex, fetchTemplateSSR]);

    return (
        <>
            <div className={styles.webBuilder}>
                <header className={styles.webBuilder__header}>
                    <Link to="/workspace">목록으로 <br /> 돌아가기</Link>
                    <div className={styles.urlWrap}>
                        <span>페이지 URL : </span>
                        <input type="text" value={workspaceData?.buildURL || ''} readOnly />
                    </div>
                    <CopyButton url={workspaceData?.buildURL || ''} />
                </header>
                <main className={styles.webBuilder__main}>
                    <TabBar
                        tabs={tabs}
                        onTabSelect={setSelectedTabIndex}
                        background={"#F5F5F5"}
                        width={3}
                    />
                    <section className={styles.pagePreview}>
                        {htmlContent ? (
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </section>
                    <ApplyTableData selectedTab={tabs[selectedTabIndex]} workspaceData={workspaceData} fetchTemplateSSR={fetchTemplateSSR} />
                </main>
            </div>
            {errorMessage && (
                <Notification
                    onClose={() => setErrorMessage(null)}
                    type="error"
                    message={errorMessage}
                />
            )}
        </>
    );
};

export default WebBuilder;
