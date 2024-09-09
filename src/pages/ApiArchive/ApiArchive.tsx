import React, { useCallback, useEffect, useState } from 'react';
import styles from './ApiArchive.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import Dropdown from "./Components/Dropdown";
import Tester from "./Components/Tester";
import { getUserArchiveApis } from "../../services/api";
import TabButtons from "../../publicComponents/UI/TabButtons";
import { Notification } from "../../publicComponents/layout/modal/Notification";
import { extractLastSegment } from "../../utils/utils";

const ApiArchive: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Normal');
    const [onTester, setOnTester] = useState<boolean>(false);
    const [apis, setApis] = useState<UserAPIResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    const handleToggle = () => setOnTester(prevState => !prevState);

    const handleFetchArchiveApis = useCallback(async () => {
        try {
            const response: UserAPIResponse = await getUserArchiveApis();
            setApis(response);
        } catch (error) {
            const message = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(message);
        }
    }, []);

    useEffect(() => {
        handleFetchArchiveApis();
    }, [handleFetchArchiveApis]);

    useEffect(() => {
        // 탭 전환 시 드롭다운 상태 리셋
        setOpenDropdownIndex(null);
    }, [activeTab]);

    const handleDropdownToggle = (index: number) => {
        setOpenDropdownIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const renderDropdowns = (apiList: UserAPIDTO[], urlName: '' | 'like/') => {
        return apiList.map((api, index) => (
            <Dropdown
                key={index}
                title={`${api.dataBaseName}_${api.tableName}`}
                tableHash={extractLastSegment(api.api)}
                urlName={urlName}
                isOpen={openDropdownIndex === index}
                onToggle={() => handleDropdownToggle(index)}
            />
        ));
    };

    return (
        <>
            <div className={styles.apiArchive}>
                <section className={styles.apiArchive__container}>
                    <header>
                        <LineTitle
                            text="API 보관함"
                            fontSize="2rem"
                            smallText="REST API URL을 보관함에 저장하여 관리하세요."
                            isCenter
                        />
                        <div className={styles.tabContainer}>
                            <TabButtons
                                buttons={['Normal', 'Filter']}
                                activeTab={activeTab}
                                onTabClick={setActiveTab}
                            />
                        </div>
                        <p className={styles.testerBut} onClick={handleToggle}>
                            Tester
                        </p>
                        {onTester && <Tester />}
                    </header>
                    <main>
                        {activeTab === 'Normal'
                            ? apis && renderDropdowns(apis.basicAPIList, '')
                            : apis && renderDropdowns(apis.filterAPIList, 'like/')
                        }
                    </main>
                </section>
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

export default ApiArchive;
