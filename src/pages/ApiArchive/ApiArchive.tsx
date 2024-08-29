import React, {useState} from 'react';
import styles from './ApiArchive.module.scss';
import LineTitle from "../../publicComponents/UI/LineTitle";
import Dropdown from "./Components/Dropdown";
import Tester from "./Components/Tester";

const ApiArchive: React.FC = () => {
    const [onTester, setOnTester] = useState<boolean>(false);

    const handleToggle = () => setOnTester(!onTester);

    return (
        <div className={styles.apiArchive}>
            <section className={styles.apiArchive__container}>
                <header>
                    <LineTitle text={'API 보관함'}  fontSize={'2rem'} smallText={'REST API URL을 보관함에 저장하여 관리하세요.'} isCenter={true} />
                    <p className={styles.testerBut} onClick={handleToggle} >Tester</p>
                    { onTester && <Tester /> }
                </header>
                <main>
                    <Dropdown title={'DATABASE_TABLE'} tableHash={'tableHash'} />
                    <Dropdown title={'DATABASE_TABLE'} tableHash={'tableHash'} />
                </main>
            </section>
        </div>
    );
};

export default ApiArchive;
