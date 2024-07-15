import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// HTTP GET 요청을 보내는 함수
export function get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.get(url, config);
}

// HTTP POST 요청을 보내는 함수
export function post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.post(url, data, config);
}

// HTTP PUT 요청을 보내는 함수
export function put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.put(url, data, config);
}

// HTTP DELETE 요청을 보내는 함수
export function del(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios.delete(url, config);
}

// 사용 예제
//
// import { get } from './utils/httpUtils';
//
// // 예제 API 엔드포인트
// const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
//
// // HTTP GET 요청 보내기
// get(apiUrl)
//     .then(response => {
//         console.log('데이터 받음:', response.data);
//     })
//     .catch(error => {
//         console.error('오류 발생:', error);
//     });
//
