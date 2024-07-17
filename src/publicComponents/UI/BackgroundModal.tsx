import React from 'react';

interface BackgroundModalProps {
    width: number;
    height: number;
    onClose(isOpenModal: boolean): void;
    element: React.FC;
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({ width = 80, height = 80, onClose, element: Element }) => {
    const modalBackdropStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    };

    const modalContentStyle: React.CSSProperties = {
        width: `${width}vmin`,
        height: `${height}%`,
        minWidth: '400px',
        minHeight: '500px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        background: 'white',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: '20px',
        zIndex: 100,
    };

    const closeButtonStyle: React.CSSProperties = {
        fontSize: '15px',
        fontFamily: 'KoPubWorld Bold',
        cursor: 'pointer',
    };

    const elementBoxStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    };

    return (
        <>
            <div
                onClick={() => onClose(false)}
                style={modalBackdropStyle}
            />
            <div style={modalContentStyle}>
                <div
                    onClick={() => onClose(false)}
                    style={closeButtonStyle}
                >
                    X
                </div>
                <div style={elementBoxStyle}>
                    <Element />
                </div>
            </div>
        </>
    );
};

export default BackgroundModal;
