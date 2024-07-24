import React, {createContext, ReactNode, useContext, useState} from 'react';
import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
    baseURL: 'https://api.example.com',
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
    login: (userToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));

    const login = async (userToken: string) => {
        try {
            const response = await apiClient.post('/login', { userToken: userToken });
            const { token } = response.data;
            localStorage.setItem('authToken', token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('로그인 실패', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
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
