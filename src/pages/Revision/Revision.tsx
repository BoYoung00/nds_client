import React, {useState} from 'react';
import styles from './Revision.module.scss';
import RevisionHeader from "./Components/RevisionHeader";
import HistoryTable from "./Components/HistoryTable";
import Information from "./Components/Information";
import SearchBar from "./Components/SearchBar";
import StampingChange from "./Components/StampingChange";
import StampingMassage from "./Components/StampingMassage";

const Revision: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('History');

    return (
        <div className={styles.revision}>
            <div className={styles.revisionContainer}>
                <RevisionHeader activeTab={activeTab} setActiveTab={setActiveTab}/>

                { activeTab === 'History' &&
                    <>
                        <HistoryTable />
                        <Information />
                    </>
                }
                { activeTab === 'Stamping' && <StampingChange /> }
                { activeTab === 'Search' &&
                    <>
                        <SearchBar />
                        <HistoryTable />
                        <Information />
                    </>
                }
            </div>
        </div>
    );
};

export default Revision;
