import { useEffect, useState, useCallback, useMemo } from 'react';
import { getWorkspaceData } from '../../services/api';

export const useWebBuilder = (template: string | undefined) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const userEmail = localStorage.getItem('email');
    const [workspaceData, setWorkspaceData] = useState<WorkspaceResponse | null>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

    const tabConfig: { [key: string]: string[] } = {
        Shop: ['main', 'cart', 'order', 'order-list'],
        Board: [
            'login',
            'sign-up',
            'main-notice',
            'main-list',
            'view-notice',
            'view-list',
            'after_login-notice',
            'after_login-list',
            'write-user',
            'write-admin',
        ],
        Todo: ['todo-list'],
        Gallery: ['gallery-list'],
    };

    const tabs = useMemo(() => {
        if (!template) return [];
        return tabConfig[template] || [];
    }, [template]);

    const pageUrl = `${apiUrl}/workspace/${template?.toLowerCase()}/${tabs[selectedTabIndex]}/${userEmail}`;

    const handleError = useCallback((error: unknown) => {
        const errorMsg = (error as Error).message || '알 수 없는 오류가 발생하였습니다.';
        setErrorMessage(errorMsg);
    }, []);

    const fetchTemplateData = useCallback(async () => {
        if (!template || !userEmail || tabs.length === 0 || selectedTabIndex >= tabs.length) return;

        try {
            const response = await getWorkspaceData(template.toLowerCase(), tabs[selectedTabIndex], userEmail);
            console.log('템플릿 테이블 매핑 데이터', response);
            setWorkspaceData(response);
        } catch (error) {
            handleError(error);
        }
    }, [template, tabs, selectedTabIndex, handleError]);

    useEffect(() => {
        if (template) {
            fetchTemplateData();
        }
    }, [template, selectedTabIndex]);

    useEffect(() => {
        if (pageUrl) {
            setIframeSrc(pageUrl); // 페이지 URL 설정
        }
    }, [pageUrl]);

    return {
        workspaceData,
        selectedTabIndex,
        setSelectedTabIndex,
        errorMessage,
        setErrorMessage,
        iframeSrc,
        tabs,
    };
};
