import React from 'react';
import styles from './WebBuilder.module.scss';
import { Link, useParams } from 'react-router-dom';
import CopyButton from '../../publicComponents/UI/CopyButton';
import TabBar from '../../publicComponents/layout/TabBar';
import ApplyTableData from './Components/ApplyTableData';
import { Notification } from '../../publicComponents/layout/modal/Notification';
import { useWebBuilder } from './useWebBuilder'; // 훅 import

const WebBuilder: React.FC = () => {
    const { template } = useParams<{ template: string }>();
    const {
        workspaceData,
        selectedTabIndex,
        setSelectedTabIndex,
        errorMessage,
        setErrorMessage,
        iframeSrc,
        tabs,
    } = useWebBuilder(template); // 훅 사용

    const apiUrl = process.env.REACT_APP_API_URL;
    const pageUrl = `${apiUrl}/workspace/${template?.toLowerCase()}/${tabs[selectedTabIndex]}/${localStorage.getItem('email')}`;

    return (
        <>
            <div className={styles.webBuilder}>
                <header className={styles.webBuilder__header}>
                    <Link to="/workspace">목록으로 <br /> 돌아가기</Link>
                    <div className={styles.urlWrap}>
                        <span>페이지 URL : </span>
                        <input type="text" value={pageUrl} readOnly />
                    </div>
                    <CopyButton url={pageUrl} />
                </header>
                <main className={styles.webBuilder__main}>
                    <TabBar
                        tabs={tabs}
                        onTabSelect={setSelectedTabIndex}
                        background={"#F5F5F5"}
                        width={3}
                    />
                    <section className={styles.pagePreview}>
                        {iframeSrc ? ( // iframeSrc가 설정된 후에 iframe을 렌더링
                            <iframe
                                src={iframeSrc}
                                title="Page Preview"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </section>
                    <ApplyTableData selectedTab={tabs[selectedTabIndex]} workspaceData={workspaceData} />
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
