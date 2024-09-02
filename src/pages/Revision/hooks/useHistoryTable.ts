import { useState, useEffect, MouseEvent } from "react";
import { useRevision } from "../../../contexts/RevisionContext";
import { useDataBase } from "../../../contexts/DataBaseContext";
import { moveToHistoryPoint, resetStampingState } from "../../../services/api";

export const useHistoryTable = () => {
    const { selectedDataBase } = useDataBase();
    const [selectedStampingID, setSelectedStampingID] = useState<number | null>(null);

    const [questionMessage, setQuestionMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null); // 확인 시 실행할 함수
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null); // 클릭 위치

    // 문서 클릭 이벤트 리스너 등록 및 제거
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    // 커밋 선택
    const handleRowClick = (StampingID: number) => {
        setSelectedStampingID(StampingID);
    };

    // 체크아웃 (더블 클릭)
    const handleRowDoubleClick = (StampingID: number) => {
        setQuestionMessage('해당 분기로 변경 하시겠습니까?');
        setConfirmAction(() => handelFetchMove);
    };

    // 오른쪽 클릭 시 컨텍스트 메뉴 표시
    const handleContextMenu = (event: MouseEvent, StampingID: number) => {
        event.preventDefault();
        setSelectedStampingID(StampingID);
        setContextMenu({ x: event.clientX, y: event.clientY });
        handleRowClick(StampingID); // 오른쪽 클릭 시 왼쪽 클릭 핸들러도 호출
    };

    // 문서 클릭 시 컨텍스트 메뉴 닫기
    const handleDocumentClick = () => {
        setContextMenu(null);
    };

    // 메뉴 옵션 클릭 핸들러
    const handleMenuOptionClick = (option: string) => {
        switch (option) {
            case 'reset':
                setQuestionMessage('선택한 분기로 되돌아 가시겠습니까? 최근 내역들은 모두 삭제됩니다.');
                setConfirmAction(() => handelFetchReset);
                break;
            case 'change':
                setQuestionMessage('데이터베이스 저장소를 선택한 분기로 변경하시겠습니까?');
                setConfirmAction(() => handelFetchMove);
                break;
            case 'export':
                console.log('export', selectedStampingID);
                break;
            default:
                break;
        }
        setContextMenu(null); // 메뉴 숨기기
    };

    // 리셋 통신
    const handelFetchReset = async () => {
        if (!selectedDataBase || !selectedStampingID) return;

        try {
            await resetStampingState(selectedDataBase.id!, selectedStampingID);
            setSuccessMessage('리셋에 성공하셨습니다.');
        } catch (error) {
            const errorMessage = (error as Error).message || '리셋에 실패했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    // 체크아웃 통신
    const handelFetchMove = async () => {
        if (!selectedDataBase || !selectedStampingID) return;

        try {
            await moveToHistoryPoint(selectedDataBase.id!, selectedStampingID);
            setSuccessMessage('분기 변경에 성공하셨습니다.');
        } catch (error) {
            const errorMessage = (error as Error).message || '분기 변경에 실패했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return {
        selectedStampingID,
        questionMessage,
        successMessage,
        errorMessage,
        contextMenu,
        handleRowClick,
        handleRowDoubleClick,
        handleContextMenu,
        handleDocumentClick,
        handleMenuOptionClick,
        handelFetchReset,
        handelFetchMove,
        setQuestionMessage,
        setSuccessMessage,
        setErrorMessage,
        confirmAction,
        setConfirmAction,
    };
};
