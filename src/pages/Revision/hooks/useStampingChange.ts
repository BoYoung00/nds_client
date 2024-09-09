import { useEffect, useState } from "react";
import { revisionDataDiffData } from "../../../services/api";
import { useDataBase } from "../../../contexts/DataBaseContext";

interface StampingDiffDTO {
    data: string;
    state: number;
}

type StampingDataMap = Record<string, Record<string, StampingDiffDTO[]>>;

export const useStampingChange = () => {
    const { selectedDataBase } = useDataBase();

    const [selectedTableName, setSelectedTableName] = useState<string | null>(null);
    const [stampingData, setStampingData] = useState<StampingDataMap | null>(null);
    const [isStampingPossible, setIsStampingPossible] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        handleFetchDiffData();
    }, [selectedDataBase]);

    const handleFetchDiffData = async () => {
        if (!selectedDataBase) return;
        try {
            const response: StampingDataMap = await revisionDataDiffData(selectedDataBase.id!);
            setStampingData(response);
            setIsStampingPossible(isValidStateInDataMap(response))
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    function isValidStateInDataMap(dataMap: StampingDataMap): boolean {
        for (const outerKey in dataMap) {
            const innerMap = dataMap[outerKey];
            for (const innerKey in innerMap) {
                const stampingDiffArray = innerMap[innerKey];
                for (const stampingDiff of stampingDiffArray) {
                    if (stampingDiff.state === 0 || stampingDiff.state === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const tableNames = stampingData ? Object.keys(stampingData) : [];

    return {
        selectedTableName,
        setSelectedTableName,
        stampingData,
        tableNames,
        isStampingPossible,
        errorMessage,
        setErrorMessage,
    };
};
