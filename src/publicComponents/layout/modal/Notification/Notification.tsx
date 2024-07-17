import React, {useState} from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
    isOpen: boolean;
    onClose(): void;
    type: 'success' | 'question' | 'error';
    message: string;
    onConfirm?(): void;
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose, type, message, onConfirm }) => {
    if (!isOpen) return null;

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
        zIndex: 99,
    };

    return (
        <>
            <div
                onClick={handleClose}
                style={modalBackdropStyle}
            />

            <div className={`${styles.notification} ${getNotificationStyle(type)}`}>
                <h3>{getNotificationTitle(type)}</h3>
                <p>{message}</p>
                {type === 'question' && (
                    <div className={styles.buttonGroup}>
                        <button onClick={handleConfirm}>Confirm</button>
                        <button onClick={handleClose}>Cancel</button>
                    </div>
                )}
                {type !== 'question' && (
                    <button className={styles.closeButton} onClick={handleClose}>
                        Close
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


// 사용 방법
// const [successOpen, setSuccessOpen] = useState(false);
// const [questionOpen, setQuestionOpen] = useState(false);
// const [errorOpen, setErrorOpen] = useState(false);
//
// const openSuccessNotification = () => {
//     setSuccessOpen(true);
// };
//
// const openQuestionNotification = () => {
//     setQuestionOpen(true);
// };
//
// const openErrorNotification = () => {
//     setErrorOpen(true);
// };
//
// <div>
//     <button onClick={openSuccessNotification}>Open Success Notification</button>
//     <button onClick={openQuestionNotification}>Open Question Notification</button>
//     <button onClick={openErrorNotification}>Open Error Notification</button>
//
//     <Notification
//         isOpen={successOpen}
//         onClose={() => setSuccessOpen(false)}
//         type="success"
//         message="This is a success notification!"
//     />
//
//     <Notification
//         isOpen={questionOpen}
//         onClose={() => setQuestionOpen(false)}
//         type="question"
//         message="Do you want to proceed?"
//         onConfirm={() => {
//             console.log('Confirmed');
//         }}
//     />
//
//     <Notification
//         isOpen={errorOpen}
//         onClose={() => setErrorOpen(false)}
//         type="error"
//         message="An error occurred!"
//     />
// </div>
