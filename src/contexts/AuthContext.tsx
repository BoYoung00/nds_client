import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

// Axios 인스턴스 생성 (기본 설정)
export const client = axios.create({
    baseURL: apiUrl,
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
