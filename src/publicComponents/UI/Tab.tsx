import React, { useState } from 'react';

interface TabComponentProps {
    tabs: string[];
    onTabSelect: (index: number) => void;
    width?: number;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, onTabSelect, width = 5 }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleTabClick = (index: number) => {
        setSelectedIndex(index);
        onTabSelect(index);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'end', margin: '10px'}}>
            {tabs.map((tab, index) => (
                <div
                    key={index}
                    onClick={() => handleTabClick(index)}
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        fontFamily: 'KoPubWorld Bold',
                        cursor: 'pointer',
                        width: `${width}em`,
                        padding: '.5em .8em 1em .8em',
                        border: '1px solid #ECECEC',
                        background: index === selectedIndex ? 'white' : '#ECECEC',
                        color: index === selectedIndex ? '#00A3FF' : '#808080',
                        height: index === selectedIndex ? '1.5em' : '1em',
                        borderRadius: '6px 6px 0 0',
                        marginRight: '5px',
                    }}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default TabComponent;
