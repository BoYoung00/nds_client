import React from 'react';
import styles from './Revision.module.scss';
import RevisionHeader from "./Components/RevisionHeader";
import HistoryTable from "./Components/HistoryTable";
import Information from "./Components/Information";

const Revision: React.FC = () => {

    return (
        <div className={styles.revision}>
            <RevisionHeader />
            <HistoryTable />
            <Information />
        </div>
    );
};

export default Revision;
