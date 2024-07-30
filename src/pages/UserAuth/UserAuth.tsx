import React, { useState } from 'react';
import axios from 'axios';
import styles from './UserAuth.module.scss';
import { Notification } from "../../publicComponents/layout/modal/Notification";
import login_img1 from '../../assets/images/login_img1.png';
import login_img2 from '../../assets/images/login_img2.png';
import CopyButton from "../../publicComponents/UI/CopyButton";

const UserAuth: React.FC = () => {
    const [userToken, setUserToken] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [joinToken, setJoinToken] = useState<string>('');

    const [activeForm, setActiveForm] = useState<'login' | 'join' | 'findToken'>('login');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent, formType: string) => {
        event.preventDefault();
        try {
            if (formType === 'login') { // 로그인 로직
                await loginUser(userEmail, userToken);
            } else if (formType === 'join') { // 회원가입 로직
                await joinUser(userEmail);
            }
        } catch (err) {
            setErrorMessage('처리 실패. 정보를 확인하세요.');
        }
    };

    const loginUser = async (email: string, token: string) => {
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', { email, token });
            const { authToken } = response.data;
            localStorage.setItem('authToken', authToken);
            console.log('로그인 성공');
        } catch (error) {
            console.error('로그인 실패', error);
            setErrorMessage('로그인 실패. 정보를 확인하세요.');
        }
    };

    const joinUser = async (email: string) => {
        try {
            const response = await axios.post('http://localhost:8080/api/users', { email });
            const token = response.data;
            setJoinToken(token.userToken);
            setSuccessMessage("토큰 발급에 성공하셨습니다.")
            console.log('토큰 발급 성공', token);
        } catch (error) {
            console.error('토큰 발급 실패', error);
            setErrorMessage('토큰 발급 실패. 이미 가입 되어 있거나, 이메일 양식이 틀립니다.');
        }
    };

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
                {activeForm === 'join' && (
                    <section className={styles.userAuth__container__formSide}>
                        <p>GENERATE</p>
                        <form onSubmit={(e) => handleSubmit(e, 'join')}>
                            <input
                                id="userEmail"
                                type="text"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder={"Email"}
                                required
                            />
                            <button type="submit">발급 받기</button>
                            <span>
                                이메일 입력 시 발급 되는 개인 토큰으로 로그인하세요. <br /> 토큰을 꼭 기억해주세요.
                            </span>
                            <div className={styles.tokenCopyBox}>
                                <span>
                                    <CopyButton url={joinToken} />
                                </span>
                                <input
                                    id="joinToken"
                                    type="text"
                                    value={joinToken}
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
                {activeForm === 'findToken' && (
                    <section className={styles.userAuth__container__formSide}>
                        <p>FIND TOKEN</p>
                        <form onSubmit={(e) => handleSubmit(e, 'findToken')}>
                            <input
                                id="userEmail"
                                type="text"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder={"Email"}
                                required
                            />
                            <button type="submit">토큰 찾기</button>
                            <span>
                                이메일 입력 시 발급 되는 개인 토큰으로 로그인하세요. <br /> 토큰을 꼭 기억해주세요.
                            </span>
                            <div className={styles.tokenCopyBox}>
                                <span>
                                    <CopyButton url={joinToken} />
                                </span>
                                <input
                                    id="joinToken"
                                    type="text"
                                    value={joinToken}
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
