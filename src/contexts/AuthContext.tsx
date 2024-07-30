import React, { createContext, ReactNode, useContext, useState } from 'react';
import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/users',
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 인증 컨텍스트 및 제공자 설정
interface AuthContextProps {
    login: (email: string, token: string) => void;
    logout: (email: string, token: string) => void;
    join: (email: string) => void;
    isAuthenticated: boolean;
    errorMessage: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const login = async (email: string, token: string) => {
        try {
            const response = await apiClient.post('/login', { email, token });
            const { token: authToken } = response.data;
            localStorage.setItem('authToken', authToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('로그인 실패', error);
            setErrorMessage('로그인 실패. 정보를 확인하세요.');
        }
    };

    const logout = async (email: string, token: string) => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                await apiClient.post('/logout', { email, token }); // email이 필요 없는 경우 빈 문자열 사용
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('로그아웃 실패', error);
            setErrorMessage('로그아웃 실패. 다시 시도해 주세요.');
        }
    };

    const join = async (email: string) => {
        try {
            const joinData = await apiClient.post('/', { email });
            console.log('회원가입 성공', joinData);
        } catch (error) {
            console.error('회원가입 실패', error);
            setErrorMessage('회원가입 실패. 정보를 확인하세요.');
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout, join, isAuthenticated, errorMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
