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
/*
const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
setErrorMessage(errorMessage);
*/

// 데이터베이스 리스트 불러오기
export const getDataBasesForCurrentUser = async () => {
    try {
        const response = await client.get('/api/databases');
        return response.data; // 현재 사용자에 대한 데이터베이스 목록 반환
    } catch (error) {
        throw error;
    }
};

// 테이블 목록 가져오기
export const getTablesForDataBaseID = async (databaseID: number) => {
    try {
        const response = await client.get(`/api/tables/${databaseID}`);
        return response.data; // 테이블 목록 반환
    } catch (error) {
        throw error;
    }
};

// 조인 테이블 데이터 가져오기
export const getJoinedTableData = async (databaseID: number) => {
    try {
        const response = await client.get(`/api/tables/join/${databaseID}`);
        return response.data; // 조인된 테이블 데이터 반환
    } catch (error) {
        throw error;
    }
};

// 테이블 생성
export const tableStructure = async (tableRequest: TableRequest) => {
    try {
        const response = await client.post(`/api/tables`, tableRequest);
        if (response.status === 200) {
            return response.data; // 생성된 테이블 객체 반환
        }
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error)
            throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 테이블 데이터 추가, 수정, 삭제
export const createData = async (dataRequest: DataRequest) => {
    try {
        const response = await client.post('/api/data', dataRequest);
        if (response.status === 200) {
            return response.data;
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

// .nds 파일 스크립트 다운로드
export const downloadNdsFile = async (databaseID: number) => {
    try {
        const response = await client.get(`/api/file/download/${databaseID}`, {
            responseType: 'blob',
        });
        const disposition = response.headers['content-disposition'];
        const fileName = disposition?.split('filename=')[1]?.replace(/"/g, '') || 'downloadedFile.nds';

        return { blob: response.data, fileName };
    } catch (error) {
        throw error;
    }
};

// 미디어 이미지 리스트 가져오기
export const getImagesPathList = async (tableHash: string) => {
    try {
        const response = await client.get(`/api/medias/images/${tableHash}`);
        return response.data; // 이미지 리스트 반환
    } catch (error) {
        throw error;
    }
};

// 미디어 비디오 리스트 가져오기
export const getVideoPathList = async (tableHash: string) => {
    try {
        const response = await client.get(`/api/medias/videos/${tableHash}`);
        return response.data; // 비디오 리스트 반환
    } catch (error) {
        throw error;
    }
};

// 이미지 파일 추가
export const uploadImageFile = async (tableHash: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableHash', tableHash);

    try {
        const response = await client.post('/api/medias/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
            return response.data; // 성공
        }
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 비디오 파일 추가
export const uploadVideoFile = async (tableHash: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableHash', tableHash);

    try {
        const response = await client.post('/api/medias/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
            return response.data; // 성공
        }
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 이미지 삭제 함수
export const deleteImage = async (imageID: number) => {
    try {
        const response = await client.delete(`/api/medias/images/${imageID}`);
        return response.data; // 삭제된 이미지의 응답 데이터 반환
    } catch (error) {
        throw error;
    }
};

// 비디오 삭제 함수
export const deleteVideo = async (videoID: number) => {
    try {
        const response = await client.delete(`/api/medias/videos/${videoID}`);
        return response.data; // 삭제된 비디오의 응답 데이터 반환
    } catch (error) {
        throw error;
    }
};


// Like 필터링 데이터 가져오기
export const getUserLikeFilters = async (tableHash: string) => {
    try {
        const response = await client.get(`/api/json/like/filter/${tableHash}`);
        return response.data; // 필터링 리스트 반환
    } catch (error) {
        throw error;
    }
};

// Like 필터링 데이터 저장
export const saveFilteredTableData = async (tableHash: string, tableFilterRequests: FilterRequest[]) => {
    try {
        const response = await client.post(`/api/json/like/${tableHash}`, tableFilterRequests);
        if (response.status === 200) {
            return response.data;
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


// CSV 엑셀 다운로드
export const exportTable = async (tableID: number) => {
    try {
        const response = await client.get(`/api/csv/export/${tableID}`, {
            responseType: 'blob',
        });
        const disposition = response.headers['content-disposition'];
        const fileName = disposition?.split('filename=')[1]?.replace(/"/g, '') || 'downloadedFile.xlsx';

        return { blob: response.data, fileName };
    } catch (error) {
        throw error;
    }
};

// CSV 엑셀 데이터 저장
export const saveCsvData = async (csvDataRequest: CsvDataRequest) => {
    try {
        const response = await client.post('/api/csv/import', csvDataRequest);

        if (response.status === 200)
            return response.data;
        new Error(`${response.data?.message || '데이터 저장에 실패했습니다.'}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};