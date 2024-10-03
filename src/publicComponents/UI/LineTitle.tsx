import React from 'react';

interface TitleProps {
    text: string ;
    smallText?: string;
    isCenter?: boolean;
    fontSize?: string;
    children?: React.ReactNode;
}

const LineTitle: React.FC<TitleProps> = ({ text, smallText , isCenter = false, fontSize = '25px', children }) => {
    const commonStyles: React.CSSProperties = {
        width: `100%`,
        background: 'none',
        borderBottom: '1px solid #999999',
        textAlign: isCenter ? 'center' : 'left',
        display: isCenter ? 'block' : 'flex',
        alignItems: 'flex-end',
        fontFamily: 'KoPubWorld돋움체 Medium',
        paddingBottom: '.5rem'
    };

    const textContainerStyles: React.CSSProperties = {
        display: isCenter ? 'block' : 'flex',
        alignItems: 'flex-end',
        flexDirection: isCenter ? 'column' : 'row',
    };

    const titleStyle: React.CSSProperties = {
        fontWeight: '700',
        color: '#00A3FF',
        fontSize: `${fontSize}`,
        marginRight: '1rem'
    }

    const smallTextStyles: React.CSSProperties = {
        fontSize: '1rem',
        color: '#515151',
    };

    return (
        <div style={commonStyles}>
            <div style={textContainerStyles}>
                <div style={titleStyle}>{text}</div>
                {smallText && (
                    <span style={smallTextStyles}>
                        {smallText}
                    </span>
                )}
                {children && <div>{children}</div> }
            </div>
        </div>
    );
};

export default LineTitle;
