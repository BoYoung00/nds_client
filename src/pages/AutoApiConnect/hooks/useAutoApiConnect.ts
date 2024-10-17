import { useState, useEffect } from "react";
import {deleteAPIConnCode, getAllAPIConnCodes} from "../../../services/api";

export const useAutoApiConnect = () => {
    // API 데이터 관련 상태
    const [apiData, setApiData] = useState<ApiConnInfoResponse[]>([]);
    const [selectedApiId, setSelectedApiId] = useState<number | null>(null);

    // 모달 및 메시지 관련 상태
    const [isOpenCreateApiFunctionModal, setIsOpenCreateApiFunctionModal] = useState<boolean>(false);
    const [isItemInfoModalOpen, setIsItemInfoModalOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [questionMessage, setQuestionMessage] = useState<string | null>(null);

    // API 데이터 가져오는 함수
    const fetchGetApiInfos = async () => {
        try {
            const response = await getAllAPIConnCodes();
            setApiData(response);
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // API 연결 코드 삭제하는 함수
    const fetchDeleteAPIConnCode = async () => {
        if (!selectedApiId) return;
        try {
            await deleteAPIConnCode(selectedApiId);
            setApiData((prev) => prev.filter((api) => api.id !== selectedApiId));
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생하였습니다.';
            setErrorMessage(error);
        }
    };

    // 삭제 확인 메시지 핸들러
    const handleRemoveApi = () => {
        setQuestionMessage('해당 함수를 삭제하시겠습니까?');
    };

    // 컴포넌트가 마운트될 때 API 데이터를 가져옴
    useEffect(() => {
        fetchGetApiInfos();
    }, []);

    return {
        hooks: {
            apiData,
            setApiData,
            selectedApiId,
            setSelectedApiId,
            isOpenCreateApiFunctionModal,
            setIsOpenCreateApiFunctionModal,
            isItemInfoModalOpen,
            setIsItemInfoModalOpen,
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage,
            questionMessage,
            setQuestionMessage
        },
        handles: {
            handleRemoveApi,
            fetchDeleteAPIConnCode
        }
    };
};
