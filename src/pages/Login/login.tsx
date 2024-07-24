import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [userToken, setUserToken] = useState<string>('');
    const [isError, setIsError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(userToken);
        } catch (err) {
            setIsError('로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userToken">토큰</label>
                    <input
                        id="userToken"
                        type="text"
                        value={userToken}
                        onChange={(e) => setUserToken(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">인증</button>
            </form>
        </div>
    );
};

export default Login;
