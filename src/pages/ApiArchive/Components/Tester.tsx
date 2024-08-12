import React, { useState } from 'react';
import styles from '../ApiArchive.module.scss';


const Tester: React.FC = () => {

    return (
        <div className={styles.tester}>
            <p>API Tester</p>
            <span>URL:</span>
            <input type="text" placeholder="Enter API URL" />
            <div className={styles.butBox}>
                <button>GET</button>
                <button>POST</button>
                <button>PUT</button>
                <button>DELETE</button>
            </div>
        </div>
    );
};

export default Tester;
