import React, {useEffect, useState} from 'react';
import styles from './ApiArchive.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import Dropdown from "./Components/Dropdown";
import Tester from "./Components/Tester";
import {getUserArchiveApis} from "../../services/api";
import TabButtons from "../../publicComponents/UI/TabButtons";

const ApiArchive: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('Normal');
    const [onTester, setOnTester] = useState<boolean>(false);

    const handleToggle = () => setOnTester(!onTester);

    useEffect(() => {
        handelFetchArchiveApis();
    }, []);

    const handelFetchArchiveApis = async () => {
        try {
            const response = await getUserArchiveApis();
            console.log('API 보관함 리스트', response)
        }catch (e) {

        }
    }

    return (
        <div className={styles.apiArchive}>
            <section className={styles.apiArchive__container}>
                <header>
                    <LineTitle text={'API 보관함'}  fontSize={'2rem'} smallText={'REST API URL을 보관함에 저장하여 관리하세요.'} isCenter={true} />
                    <div className={styles.tabContainer}>
                        <TabButtons
                            buttons={['Normal', 'Filter']}
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                    </div>
                    <p className={styles.testerBut} onClick={handleToggle} >Tester</p>
                    { onTester && <Tester /> }
                </header>
                <main>
                    { activeTab === 'Normal' ?
                        <>
                            <Dropdown title={'DATABASE_TABLE'} tableHash={'tableHash'} />
                            <Dropdown title={'DATABASE_TABLE'} tableHash={'tableHash'} />
                        </>

                        :

                        <>
                        </>
                    }

                </main>
            </section>
        </div>
    );
};

export default ApiArchive;
