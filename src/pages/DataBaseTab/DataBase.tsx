import React, {useState} from 'react';
import Tab from "../../publicComponents/UI/Tab";

const DataBase:React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div>
            <Tab tabs={['Data', 'Like', 'Rest API', 'Query', 'Excel', 'Resource']} onTabSelect={(index) => setSelectedTab(index)}/>
        </div>
    );
};

export default DataBase;