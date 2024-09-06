import React from 'react';

interface TitleProps {
    text: string ;
    smallText?: string;
    isCenter?: boolean;
    fontSize?: string;
}

const LineTitle: React.FC<TitleProps> = ({ text, smallText , isCenter = false, fontSize = '25px' }) => {
    const commonStyles: React.CSSProperties = {
        width: `100%`,
        background: 'none',
        borderBottom: '1px solid #999999',
        textAlign: isCenter ? 'center' : 'left',
        display: isCenter ? 'block' : 'flex',
        fontFamily: 'KoPubWorld Bold',
        color: '#00A3FF',
        fontSize: `${fontSize}`,
        alignItems: 'flex-end',
        paddingBottom: isCenter ? '3.5rem' : '0',
    };

    const textContainerStyles: React.CSSProperties = {
        display: isCenter ? 'block' : 'flex',
        alignItems: 'flex-end',
        flexDirection: isCenter ? 'column' : 'row',
    };

    const smallTextStyles: React.CSSProperties = {
        fontSize: '1rem',
        color: '#515151',
        marginTop: isCenter ? '.5rem' : '0',
        marginLeft: isCenter ? '0' : '1rem',
        paddingBottom: '.3rem',
        fontFamily: 'KoPubWorld Bold',
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
