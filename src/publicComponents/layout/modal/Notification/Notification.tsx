import React from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
    onClose(): void;
    type: 'success' | 'question' | 'error';
    message: string | null;
    onConfirm?: ConfirmFunction | null;
}

const Notification: React.FC<NotificationProps> = ({ onClose, type, message, onConfirm }) => {

    const handleClose = () => {
        onClose();
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

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
        zIndex: 100,
    };

    return (
        <>
            <div
                onClick={handleClose}
                style={modalBackdropStyle}
            />

            <div className={`${styles.notification} ${getNotificationStyle(type)}`}>
                <h3>{getNotificationTitle(type)}</h3>
                <p>{formatMessage(message)}</p>
                {type === 'question' && (
                    <div className={styles.buttonGroup}>
                        <button onClick={handleConfirm}>실행</button>
                        <button onClick={handleClose}>취소</button>
                    </div>
                )}
                {type !== 'question' && (
                    <button className={styles.closeButton} onClick={handleClose}>
                        닫기
                    </button>
                )}
            </div>
        </>
    );
};

function getNotificationStyle(type: NotificationProps['type']): string {
    switch (type) {
        case 'success':
            return styles.success;
        case 'question':
            return styles.question;
        case 'error':
            return styles.error;
        default:
            return '';
    }
}

function getNotificationTitle(type: NotificationProps['type']): string {
    switch (type) {
        case 'success':
            return 'Success';
        case 'question':
            return 'Question';
        case 'error':
            return 'Error';
        default:
            return '';
    }
}

export default Notification;

function formatMessage(message: string | null): JSX.Element | null {
    if (!message) return null;

    return (
        <>
            {message.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))}
        </>
    );
}


// 사용 방법
/*
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    { successMessage && <Notification
        onClose={() => setSuccessMessage(null)}
        type="success"
        message={successMessage}
    /> }

    { errorMessage && <Notification
        onClose={() => setErrorMessage(null)}
        type="error"
        message={errorMessage}
    /> }

    { questionMessage && <Notification
        onClose={() => setQuestionMessage(null)}
        type="question"
        message={questionMessage}
        onConfirm={() => {
            console.log('Confirmed');
        }}
    /> }

*/
