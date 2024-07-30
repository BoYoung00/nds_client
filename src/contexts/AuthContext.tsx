import axios from "axios";

// Axios 인스턴스 생성 (기본 설정)
export const client = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
    },
    responseType: "json",
});

// 요청 인터셉터 추가 (서버로 전송되기 전에 호출)
client.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);




// import React, { createContext, ReactNode, useContext, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
//
// // Axios 인스턴스 생성
// export const apiClient = axios.create({
//     baseURL: 'http://localhost:8080/api/users',
// });
//
// // 요청 인터셉터 설정
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );
//
// // 인증 컨텍스트 및 제공자 설정
// interface AuthContextProps {
//     login: (email: string, token: string) => void;
//     logout: () => void;
//     join: (email: string) => void;
//     isAuthenticated: boolean;
//     errorMessage: string | null;
//     setErrorMessage: (message: string | null) => void;
//     successMessage: string | null;
//     setSuccessMessage: (message: string | null) => void;
//     userToken: string;
//     setUserToken: (token: string) => void;
//     userEmail: string;
//     setUserEmail: (email: string) => void;
//     joinOrFindToken: string;
//     setJoinOrFindToken: (token: string) => void;
//     activeForm: 'login' | 'join' | 'findToken';
//     setActiveForm: (form: 'login' | 'join' | 'findToken') => void;
//     handleSubmit: (event: React.FormEvent, formType: string) => Promise<void>;
// }
//
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);
//
// interface AuthProviderProps {
//     children: ReactNode;
// }
//
// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     // const navigate = useNavigate();
//
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('authToken'));
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [successMessage, setSuccessMessage] = useState<string | null>(null);
//     const [userToken, setUserToken] = useState<string>('');
//     const [userEmail, setUserEmail] = useState<string>('');
//     const [joinOrFindToken, setJoinOrFindToken] = useState<string>('');
//     const [activeForm, setActiveForm] = useState<'login' | 'join' | 'findToken'>('login');
//
//     const handleSubmit = async (event: React.FormEvent, formType: string) => {
//         event.preventDefault();
//         try {
//             if (formType === 'login') {
//                 await login(userEmail, userToken);
//             } else if (formType === 'join') {
//                 await join(userEmail);
//             }
//         } catch (err) {
//             setErrorMessage('처리 실패. 정보를 확인하세요.');
//         }
//     };
//
//     const login = async (email: string, token: string) => {
//         try {
//             const response = await apiClient.post('/login', { email, token });
//             const { token: authToken } = response.data;
//             localStorage.setItem('authToken', authToken);
//             setIsAuthenticated(true);
//             // navigate('/database');
//         } catch (error) {
//             console.error('로그인 실패', error);
//             setErrorMessage('로그인 실패. 정보를 확인하세요.');
//         }
//     };
//
//     const logout = async () => {
//         try {
//             const token = localStorage.getItem('authToken');
//             if (token) {
//                 await apiClient.post('/logout', { email: userEmail, token });
//                 localStorage.removeItem('authToken');
//                 setIsAuthenticated(false);
//                 // navigate('/auth');
//             }
//         } catch (error) {
//             console.error('로그아웃 실패', error);
//             setErrorMessage('로그아웃 실패. 다시 시도해 주세요.');
//         }
//     };
//
//     const join = async (email: string) => {
//         try {
//             const response = await apiClient.post('/', { email });
//             const authToken = response.data;
//             setJoinOrFindToken(authToken.userToken);
//             setSuccessMessage("토큰 발급에 성공하셨습니다.");
//             console.log('토큰 발급 성공', authToken);
//         } catch (error) {
//             console.error('회원가입 실패', error);
//             setErrorMessage('회원가입 실패. 정보를 확인하세요.');
//         }
//     };
//
//     return (
//         <AuthContext.Provider value={{
//             login,
//             logout,
//             join,
//             isAuthenticated,
//             errorMessage,
//             setErrorMessage,
//             successMessage,
//             setSuccessMessage,
//             userToken,
//             setUserToken,
//             userEmail,
//             setUserEmail,
//             joinOrFindToken,
//             setJoinOrFindToken,
//             activeForm,
//             setActiveForm,
//             handleSubmit,
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
