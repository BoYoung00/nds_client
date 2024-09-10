import React, { useState, useEffect } from 'react';

interface CSSProperties {
    [key: string]: React.CSSProperties[keyof React.CSSProperties];
}

const styles: { [key: string]: CSSProperties } = {
    copyButtonContainer: {
        position: 'relative',
        display: 'inline-block',
    },
    copyButton: {
        backgroundColor: '#00A3FF',
        color: 'white',
        border: 'none',
        padding: '.3rem .8rem',
        borderRadius: '4px',
        cursor: 'pointer',
        // fontSize: `${fontSize}`
    },
    copyMessage: {
        width: '6.7rem',
        position: 'absolute',
        top: '0',
        left: '0',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        opacity: 1,
        animation: 'fadeOut 1.5s forwards',
    },
};

const fadeOutKeyframes = `
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    80% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
`;

const CopyButton: React.FC<{ url: string }> = ({ url }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleCopyClick = (url: string) => {
        if (navigator.clipboard !== undefined) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    setShowCopyMessage(true);
                });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            try {
                document.execCommand('copy');
                setShowCopyMessage(true);
            } catch (err) {
                console.error('복사 실패', err);
            }
            textArea.setSelectionRange(0, 0);
            document.body.removeChild(textArea);
        }
    };

    useEffect(() => {
        if (showCopyMessage) {
            const timer = setTimeout(() => setShowCopyMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showCopyMessage]);

    return (
        <div style={styles.copyButtonContainer}>
            <style>{fadeOutKeyframes}</style> {/* Keyframes 정의 */}
            <a style={styles.copyButton} onClick={() => handleCopyClick(url)} >
                Copy
            </a>
            {showCopyMessage && <span style={styles.copyMessage}>복사 되었습니다.</span>}
        </div>
    );
};

export default CopyButton;
