import React from 'react';

interface TitleProps {
    text: string ;
    smallText?: string ;
    isCenter?: boolean;
}

const LineTitle: React.FC<TitleProps> = ({ text, smallText , isCenter = false }) => {
    const commonStyles: React.CSSProperties = {
        width: `100%`,
        background: 'none',
        borderBottom: '1px solid #999999',
        textAlign: isCenter ? 'center' : 'left',
        display: isCenter ? 'block' : 'flex',
        fontFamily: 'KoPubWorld Bold',
        color: '#00A3FF',
        fontSize: '25px',
        alignItems: 'flex-end'
    };

    const textContainerStyles: React.CSSProperties = {
        display: isCenter ? 'block' : 'flex',
        alignItems: 'flex-end',
        flexDirection: isCenter ? 'column' : 'row',
    };

    const smallTextStyles: React.CSSProperties = {
        fontSize: '14px',
        color: 'gray',
        marginTop: isCenter ? '5px' : '0',
        marginLeft: isCenter ? '0' : '15px',
        paddingBottom: '5px',
        fontFamily: 'KoPubWorld Light',
    };

    return (
        <div style={commonStyles}>
            <div style={textContainerStyles}>
                <div>{text}</div>
                {smallText && (
                    <span style={smallTextStyles}>
                        {smallText}
                    </span>
                )}
            </div>
        </div>
    );
};

export default LineTitle;
