import { useState } from 'react';
import axios from 'axios';

const useUserAuth = () => {
    const [userToken, setUserToken] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [joinOrFindToken, setJoinOrFindToken] = useState<string>('');

    const [activeForm, setActiveForm] = useState<'login' | 'join' | 'findToken'>('login');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent, formType: string) => {
        event.preventDefault();
        try {
            if (formType === 'login') {
                await login(userToken);
            } else if (formType === 'join') {
                await join(userEmail);
            }
        } catch (err) {
            setErrorMessage('처리 실패. 정보를 확인하세요.');
        }
    };

    // 로그인
    const login = async (token: string) => {
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', { token });
            const authToken = response.data;
            localStorage.setItem('email', authToken.email);
            localStorage.setItem('token', authToken.token);
            window.location.href="/"
        } catch (error) {
            setErrorMessage('일치하는 토큰이 존재하지 않습니다.');
        }
    };

    // 회원가입
    const join = async (email: string) => {
        try {
            const response = await axios.post('http://localhost:8080/api/users', { email });
            const authToken = response.data;
            setJoinOrFindToken(authToken.userToken);
            setSuccessMessage("토큰 발급에 성공하셨습니다.");
        } catch (error) {
            setErrorMessage('이미 가입 되어 있거나, 이메일 양식이 틀립니다.');
        }
    };

    return {
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
        handleSubmit,
    };
};

export default useUserAuth;
