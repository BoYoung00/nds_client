import {client} from "../contexts/AuthContext";
import axios from "axios";

// 데이터베이스 생성
export const createDataBase = async (name: string, comment: string) => {
    try {
        const response = await client.post('/api/databases', {name, comment});
        if (response.status === 200) {
            return response.data; // 성공적으로 생성된 데이터베이스 객체 반환
        }
        new Error(`${response.data.message}`)
    } catch (error) {
        // Axios 오류인 경우
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        // 일반 Error의 경우
        if (error instanceof Error) throw new Error(error.message);
        // 알 수 없는 오류의 경우
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 데이터베이스 리스트 불러오기
export const getDataBasesForCurrentUser = async () => {
    try {
        const response = await client.get('/api/databases');
        return response.data; // 현재 사용자에 대한 데이터베이스 목록 반환
    } catch (error) {
        console.error('데이터베이스 조회 실패:', error);
        throw error;
    }
};

// 테이블 목록 가져오기
export const getTablesForDataBaseID = async (databaseID: number) => {
    try {
        const response = await client.get(`/api/tables/${databaseID}`);
        return response.data; // 테이블 목록 반환
    } catch (error) {
        console.error('테이블 목록 조회 실패:', error);
        throw error;
    }
};

// 조인 테이블 데이터 가져오기
export const getJoinedTableData = async (databaseID: number) => {
    try {
        const response = await client.get(`/api/tables/join/${databaseID}`);
        return response.data; // 조인된 테이블 데이터 반환
    } catch (error) {
        console.error('조인된 테이블 데이터 조회 실패:', error);
        throw error;
    }
};