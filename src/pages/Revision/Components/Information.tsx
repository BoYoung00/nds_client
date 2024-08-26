import React from "react";
import styles from '../Revision.module.scss';
import TabLines from "../../../publicComponents/UI/TabLines";

const Information:React.FC = () => {
    return (
        <div className={styles.information}>
            <TabLines tabs={['Stamping', 'Changes', 'Tables']} />
        </div>
    );
};

Information.propTypes = {

};

export default Information;