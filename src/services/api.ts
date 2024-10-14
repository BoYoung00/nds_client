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

// 데이터베이스 코멘트 업데이트
export const updateDatabaseComment = async (updateDataBaseId: number, updateDataBaseComment: string = '') => {
    try {
        const response = await client.put('/api/databases', {updateDataBaseId, updateDataBaseComment});
        if (response.status === 200) {
            return response.data; // 성공적으로 업데이트된 데이터 반환
        }
        throw new Error(`Error: ${response.data.message}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

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

// 테이블 코멘트 업데이트
export const updateTableComment = async (updateTableId: number, updateTableComment: string) => {
    try {
        const response = await client.put('/api/tables', {updateTableId, updateTableComment});
        if (response.status === 200) {
            return response.data; // 성공적으로 업데이트된 데이터 반환
        }
        throw new Error(`Error: ${response.data.message}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 테이블 삭제
export const deleteTable = async (id: number) => {
    try {
        const response = await client.delete(`/api/tables/${id}`);
        if (response.status === 200) {
            return response.data; // 성공적으로 삭제된 데이터 반환
        }
        throw new Error(`Error: ${response.data.message}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
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

// .nds 파일 스크립트로 데이터베이스 생성
export const saveStructureToDatabase = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await client.post('/api/file/upload', formData, {
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
export const saveFilteredTableData = async (tableHash: string, tableFilterRequests: CustomAPIRequest) => {
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

// Like 필터링 REST API url 가져오기
export const getTableHashUrl = async (tableHash: string) => {
    try {
        const response = await client.get(`/api/json/like/filter-url/${tableHash}`);
        return response.data; // 필터링 리스트 반환
    } catch (error) {
        throw error;
    }
};


// REST API Archive 리스트 가져오기
export const getUserArchiveApis = async () => {
    try {
        const response = await client.get(`/api/user-apis`);
        return response.data; // 리스트 반환
    } catch (error) {
        throw error;
    }
};

// REST API Archive 삭제
export const restApiDelete = async (id: number) => {
    try {
        const response = await client.delete(`/api/user-apis/${id}`);
        if (response.status === 200) {
            return response.data; // 성공적으로 삭제된 데이터 반환
        }
        throw new Error(`Error: ${response.data.message}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// REST API Archive 저장
export const registerApi = async (tableHash: string) => {
    try {
        const response = await client.post('/api/user-apis', {tableHash});

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


// CSV 엑셀 파일 다운로드
export const exportTable = async (tableID: number, selectColumnNames: string[]) => {
    try {
        const response = await client.get(`/api/csv/export/${tableID}`, {
            params: {
                selectColumnNames: selectColumnNames.join(','), // 배열을 콤마로 구분된 문자열로 변환
            },
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

// 테이블 병합 컨펌
export const tableMergeConfirm = async (tableMergeConfirmRequest: TableMergeConfirmRequest) => {
    try {
        const response = await client.post('/api/tables/merge/confirm', tableMergeConfirmRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 테이블 병합 프리뷰 (SSR)
export const tableMergePreview = async (tableMergeRequest: TableMergeConfirmRequest) => {
    try {
        const response = await client.post('/ssr/merge/confirm', tableMergeRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 테이블 병합 저장
export const tableMergeSave = async (tableMergeSaveRequest: TableMergeSaveRequest) => {
    try {
        const response = await client.post('/api/tables/merge/save', tableMergeSaveRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// join 테이블 프리뷰 (SSR)
export const findJoinPreviewData = async (tableId: number) => {
    try {
        const response = await client.get(`/api/tables/join/preview/${tableId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 스탬핑 : 변경 및 수정 사항 커밋
export const revisionDataFirstCommit = async (dataBaseId: number, commitMessage: string) => {
    try {
        const response = await client.post('/api/revision/stamping', {dataBaseId, commitMessage});
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// 스탬핑 : 변경 사항 가지고 오기 (프리뷰 json)
export const revisionDataDiffData = async (databaseId: number) => {
    try {
        const response = await client.get(`/api/revision/diff/${databaseId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 스탬핑 : 히스토리 리스트
export const revisionHistory = async (databaseId: number) => {
    try {
        const response = await client.get(`/api/revision/history/${databaseId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 스탬핑 : 히스토리 리스트
export const changeStampingPreviewData = async (dataBaseId: number, stampingId: number) => {
    try {
        const response = await client.get(`/api/revision/change/${dataBaseId}/${stampingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 스탬핑 : 리셋
export const resetStampingState = async (dataBaseId: number, stampingId: number) => {
    try {
        const response = await client.get(`/api/revision/reset/${dataBaseId}/${stampingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 스탬핑 : 체크아웃
export const moveToHistoryPoint = async (databaseId: number, stampingId: number) => {
    try {
        const response = await client.get(`/api/revision/move/${databaseId}/${stampingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 템플릿 프리뷰 (링크)
export const userWorkspaceBuild = async (template: string, page: string, username: string) => {
    try {
        const response = await client.get(`/workspace/${template}/${page}/${username}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 템플릿 테이블 데이터 요청
export const getWorkspaceData = async (templateName: string, pageName: string, username: string) => {
    try {
        const response = await client.get(`/api/workspace/${templateName}/${pageName}/${username}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 템플릿 테이블 데이터 저장
export const workSpaceBuildDataSave = async (workspaceRequest: WorkspaceRequest) => {
    try {
        const response = await client.post('/api/workspace/save', workspaceRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};


// ERD 연관 관계 추가
export const tableRelationConnect = async (relationRequest: RelationRequest) => {
    try {
        const response = await client.post('/api/tables/relation/update', relationRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// Auto Api Connect (자동 API 함수 생성) 요청 함수
export const generateAPIConnCode = async (apiConnCodeRequest: ApiConnCodeRequest) => {
    try {
        const response = await client.post('/api/autoAPiConnect/generate', apiConnCodeRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// Auto Api Connect (자동 API 함수 생성) 저장 함수
export const saveAPICode = async (apiConnInfoRequest: ApiConnInfoRequest) => {
    try {
        const response = await client.post('/api/autoAPiConnect', apiConnInfoRequest);
        if (response.status === 200)
            return response.data;
        new Error(`${response.data.message}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};

// Auto Api Connect 함수 목록 가져오기
export const getAllAPIConnCodes = async () => {
    try {
        const response = await client.get(`/api/autoAPiConnect`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Auto Api Connect 코드 가져오기
export const getAPIConnCodeById = async (id: number) => {
    try {
        const response = await client.get(`/api/autoAPiConnect/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Auto Api Connect 함수 삭제
export const deleteAPIConnCode = async (id: number) => {
    try {
        const response = await client.delete(`/api/autoAPiConnect/${id}`);
        if (response.status === 200) {
            return response.data; // 성공적으로 삭제된 데이터 반환
        }
        throw new Error(`Error: ${response.data.message}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data.message || '서버에서 오류가 발생했습니다.';
            throw new Error(message);
        }
        if (error instanceof Error) throw new Error(error.message);
        throw new Error('요청 처리 중 알 수 없는 오류가 발생했습니다.');
    }
};