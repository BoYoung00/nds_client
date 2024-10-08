import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {changeStampingPreviewData, revisionHistory} from "../services/api";
import {Notification} from "../publicComponents/layout/modal/Notification";
import {useDataBase} from "./DataBaseContext";


interface RevisionContextType {
    loading: boolean;
    stampings: StampingEntity[];
    searchStampings: StampingEntity[];
    setSearchStampings: (stampings: StampingEntity[]) => void;
    currentStamping: StampingEntity | null;
    selectedStamping: StampingEntity | null;
    setSelectedStamping: (selectedStamping: StampingEntity) => void;
    stampingChanges: StampingDataMap | null;
    handelResetSearchStamping: () => void;
}

// Context 생성
const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const RevisionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { selectedDataBase } = useDataBase();

    const [stampings, setStampings] = useState<StampingEntity[]>([]);
    const [searchStampings, setSearchStampings] = useState<StampingEntity[]>([]);
    const [currentStamping, setCurrentStamping] = useState<StampingEntity | null>(null); // 체크아웃

    const [selectedStamping, setSelectedStamping] = useState<StampingEntity | null>(null) // 선택한 스탬핑
    const [stampingChanges, setStampingChanges] = useState<StampingDataMap | null>(null); // 선택한 스탬핑의 변경 사항들

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setSelectedStamping(null); // 초기화
        fetchStampings();
    }, [selectedDataBase])

    useEffect(() => {
        handleFetchDiffData();
    }, [selectedStamping])

    // 히스토리 통신
    const fetchStampings = async () => {
        if (!selectedDataBase) return;

        try {
            setLoading(true);
            const response: StampingEntity[] = await revisionHistory(selectedDataBase.id!);
            // console.log('스탬핑 리스트', response)

            const currentStamping = response.find(s => s.isCurrent); // 체크아웃 선별
            setCurrentStamping(currentStamping ? currentStamping : null)

            setStampings([...response].reverse());
            setSearchStampings([...response].reverse());
        } catch (error) {
            setErrorMessage('히스토리 목록을 가져오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 스탬핑 변경 사항 정보 통신
    const handleFetchDiffData = async () => {
        if (!selectedDataBase || !selectedStamping) return;

        try {
            const response: StampingDataMap = await changeStampingPreviewData(selectedDataBase.id!, selectedStamping.stampingId);
            // console.log('선택한 스탬핑 변경 사항 정보', response);
            setStampingChanges(response);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    const handelResetSearchStamping = () => {
        setSearchStampings(stampings);
    }

    return (
        <>
            <RevisionContext.Provider
                value={{
                    loading,
                    stampings,
                    searchStampings,
                    setSearchStampings,
                    currentStamping,
                    selectedStamping,
                    setSelectedStamping,
                    stampingChanges,
                    handelResetSearchStamping
                }}
            >
                {children}
            </RevisionContext.Provider>

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>

    );
};

// Context를 사용하는 커스텀 훅
export const useRevision = (): RevisionContextType => {
    const context = useContext(RevisionContext);
    if (context === undefined) {
        throw new Error('useErd must be used within a ErdProvider');
    }
    return context;
};