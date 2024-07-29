import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.scss';
import {Notification} from "../../publicComponents/layout/modal/Notification";

const Login: React.FC = () => {
    const { login } = useAuth();
    const [userToken, setUserToken] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(userToken);
        } catch (err) {
            setErrorMessage('로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.imgEllipse}>
                <span />
            </div>
            <div className={styles.loginBox}>
                <section className={styles.imaSide}>
                    <span />
                </section>
                <section className={styles.formSide}>
                    <p>CONNECT</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                id="userToken"
                                type="text"
                                value={userToken}
                                onChange={(e) => setUserToken(e.target.value)}
                                placeholder={"Token"}
                                required
                            />
                        </div>
                        <button type="submit">로그인</button>
                        <a href="">토근 발급 받기 →</a>
                    </form>
                </section>
            </div>


            {errorMessage && <Notification
                type={"error"}
                onClose={() => setErrorMessage(null)}
                message={errorMessage}
            />}
        </div>
    );
};

export default Login;
