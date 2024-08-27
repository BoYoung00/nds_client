import React, {useState} from 'react';
import styles from './Revision.module.scss';
import RevisionHeader from "./Components/RevisionHeader";
import HistoryTable from "./Components/HistoryTable";
import Information from "./Components/Information";
import SearchBar from "./Components/SearchBar";

const Revision: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('History');

    return (
        <div className={styles.revision}>
            <div className={styles.revisionContainer}>
                <RevisionHeader activeTab={activeTab} setActiveTab={setActiveTab}/>

                { activeTab === 'History' &&
                    <>
                        {/*<SearchBar />*/}
                        <HistoryTable />
                        <Information />
                    </>
                }

            </div>
        </div>
    );
};

export default Revision;
