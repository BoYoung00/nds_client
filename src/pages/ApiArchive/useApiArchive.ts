import {useCallback, useEffect, useState} from 'react';
import {getUserArchiveApis} from '../../services/api';

export const useApiArchive = () => {
    const [activeTab, setActiveTab] = useState<string>('Normal');
    const [onTester, setOnTester] = useState<boolean>(false);
    const [apis, setApis] = useState<UserAPIResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [openDropdownIndices, setOpenDropdownIndices] = useState<Set<number>>(new Set());

    const handleToggle = () => setOnTester(prevState => !prevState);

    const handleFetchArchiveApis = useCallback(async () => {
        try {
            const response: UserAPIResponse = await getUserArchiveApis();
            setApis(response);
        } catch (error) {
            const message = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            setErrorMessage(message);
        }
    }, []);

    useEffect(() => {
        handleFetchArchiveApis();
    }, [handleFetchArchiveApis]);

    useEffect(() => {
        setOpenDropdownIndices(new Set());
    }, [activeTab]);

    const handleDropdownToggle = (index: number) => {
        setOpenDropdownIndices(prevIndices => {
            const newIndices = new Set(prevIndices);
            if (newIndices.has(index)) {
                newIndices.delete(index);
            } else {
                newIndices.add(index);
            }
            return newIndices;
        });
    };

    return {
        activeTab,
        setActiveTab,
        onTester,
        handleToggle,
        apis,
        setApis,
        errorMessage,
        setErrorMessage,
        openDropdownIndices,
        handleDropdownToggle,
    };
};
