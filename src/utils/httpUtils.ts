import {apiClient} from "../contexts/AuthContext";
import {AxiosRequestConfig, AxiosResponse} from "axios";

export function get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return apiClient.get(url, config);
}

export function post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return apiClient.post(url, data, config);
}

export function put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return apiClient.put(url, data, config);
}

export function del(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return apiClient.delete(url, config);
}

// 예제
/*
    ======= POST
    try {
        const response = await post('/url', requestData});
        console.log('응답:', response.data);
        setIsSuccessOpen(true);
        setMessage('성공');
    } catch (error) {
        setIsErrorOpen(true);
        setMessage('실패');
    }

    ======= GET
    try {
        const response = await get('/data-endpoint');
        console.log('응답:', response.data);
        setIsSuccessOpen(true);
        setMessage('성공');
    } catch (error) {
        setIsErrorOpen(true);
        setMessage('실패');
    }

    ======= PUT
    try {
        const response = await put('/data-endpoint', requestData);
        console.log('응답:', response.data);
        setIsSuccessOpen(true);
        setMessage('성공');
    } catch (error) {
        setIsErrorOpen(true);
        setMessage('실패');
    }

    ======= DELETE
    try {
        const response = await del('/data-endpoint', requestData);
        console.log('응답:', response.data);
        setIsSuccessOpen(true);
        setMessage('성공');
    } catch (error) {
        setIsErrorOpen(true);
        setMessage('실패');
    }
*/