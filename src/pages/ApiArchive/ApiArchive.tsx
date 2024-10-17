import React from 'react';
import styles from './ApiArchive.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import Dropdown from "./Components/Dropdown";
import Tester from "./Components/Tester";
import { extractLastSegment } from "../../utils/utils";
import TabButtons from "../../publicComponents/UI/TabButtons";
import { Notification } from "../../publicComponents/layout/modal/Notification";
import {useApiArchive} from "./useApiArchive";

const ApiArchive: React.FC = () => {
    const {
        activeTab,
        setActiveTab,
        onTester,
        handleToggle,
        apis,
        setApis,
        errorMessage,
        setErrorMessage,
        openDropdownIndices,
        handleDropdownToggle,
    } = useApiArchive();

    const renderDropdowns = (apiList: UserAPIDTO[], urlName: '' | 'like/') => {
        if (apiList.length === 0)
            return (
                <div style={{width:'100%', height: '100%', textAlign:'center'}}>
                    <p style={{color: 'gray'}}>저장된 REST API가 없습니다.</p>
                </div>
            )

        return apiList.map((api, index) => (
            <Dropdown
                id={api.id}
                key={index}
                title={`${api.dataBaseName}_${api.tableName}`}
                tableHash={extractLastSegment(api.api)}
                urlName={urlName}
                isOpen={openDropdownIndices.has(index)}
                onToggle={() => handleDropdownToggle(index)}
                apis={apis}
                setApis={setApis}
            />
        ));
    };

    return (
        <>
            <div className={styles.apiArchive}>
                <section className={styles.apiArchive__container}>
                    <header>
                        <LineTitle
                            text="API ARCHIVE"
                            fontSize="2rem"
                            smallText="REST API URL을 보관함에 저장하여 관리하세요."
                            isCenter
                        >
                            <section className={styles.wrap}>
                                <div className={styles.tabContainer}>
                                    <TabButtons
                                        buttons={['Normal', 'Filter']}
                                        activeTab={activeTab}
                                        onTabClick={setActiveTab}
                                    />
                                </div>
                                <p className={styles.testerBut} onClick={handleToggle}>
                                    API Tester
                                </p>
                                {onTester && <Tester />}
                            </section>
                        </LineTitle>
                    </header>
                    <main>
                        {activeTab === 'Normal'
                            ?
                                apis && renderDropdowns(apis.basicAPIList, '')
                            :
                                apis && renderDropdowns(apis.filterAPIList, 'like/')
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
