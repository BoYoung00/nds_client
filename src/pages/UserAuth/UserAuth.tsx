import React from 'react';
import styles from './UserAuth.module.scss';
import { Notification } from "../../publicComponents/layout/modal/Notification";
import login_img1 from '../../assets/images/login_img1.png';
import login_img2 from '../../assets/images/login_img2.png';
import CopyButton from "../../publicComponents/UI/CopyButton";
import useUserAuth from './useUserAuth';

const UserAuth: React.FC = () => {
    const {
        userToken,
        setUserToken,
        userEmail,
        setUserEmail,
        joinOrFindToken,
        activeForm,
        setActiveForm,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        handleSubmit
    } = useUserAuth();

    return (
        <div className={styles.userAuth}>
            <div className={styles.userAuth__imgEllipse}>
                <span />
            </div>
            <div className={styles.userAuth__container}>
                <section className={styles.userAuth__container__imaSide}>
                    <span
                        style={{
                            background: `url(${activeForm === 'login' ? login_img1 : login_img2}) no-repeat center center`
                        }}
                    />
                </section>
                {activeForm === 'login' && (
                    <section className={styles.userAuth__container__formSide}>
                        <p>CONNECT</p>
                        <form onSubmit={(e) => handleSubmit(e, 'login')}>
                            <input
                                id="userToken"
                                type="text"
                                value={userToken}
                                onChange={(e) => setUserToken(e.target.value)}
                                placeholder={"Token"}
                                required
                            />
                            <button type="submit">로그인</button>
                            <span>
                                <a onClick={() => setActiveForm('join')}>토큰 발급 받기 →</a>
                                <a onClick={() => setActiveForm('findToken')}>토큰 찾기 →</a>
                            </span>
                        </form>
                    </section>
                )}
                { (activeForm === 'join' || activeForm === 'findToken') && (
                    <section className={styles.userAuth__container__formSide}>
                        <p>{ activeForm === 'join' ? <>GENERATE</> : <>FIND TOKEN</> }</p>
                        <form onSubmit={(e) => { activeForm === 'join' ? handleSubmit(e, 'join') : handleSubmit(e, 'findToken')} }>
                            <input
                                id="userEmail"
                                type="text"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder={"Email"}
                                required
                            />
                            <button type="submit">
                                { activeForm === 'join' ? <>발급 받기</> : <>토큰 찾기</> }
                            </button>
                            <span>
                                이메일 입력 시 발급 되는 개인 토큰으로 로그인하세요. <br /> 토큰을 꼭 기억해주세요.
                            </span>
                            <div className={styles.tokenCopyBox}>
                                <span>
                                    <CopyButton url={joinOrFindToken} />
                                </span>
                                <input
                                    id="joinToken"
                                    type="text"
                                    value={joinOrFindToken}
                                    placeholder={"Token"}
                                    readOnly
                                />
                            </div>
                            <span>
                                <a onClick={() => setActiveForm('login')}>로그인 →</a>
                            </span>
                        </form>
                    </section>
                )}
            </div>

            {errorMessage && <Notification
                type={"error"}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />}

            {successMessage && <Notification
                type={"success"}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
            />}
        </div>
    );
};

export default UserAuth;
