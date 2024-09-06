import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface MenuItem {
    path: string;
    text: string;
}

const maxMenuItems: MenuItem[] = [
    { path: '/database', text: 'DATABASE' },
    { path: '/revision', text: 'REVISION' },
    { path: '/api', text: 'API ARCHIVE' },
    { path: '/template', text: 'TEMPLATE' },
];

const minMenuItems: MenuItem[] = [
    { path: '/database', text: 'DB' },
    { path: '/revision', text: 'REV' },
    { path: '/api', text: 'API' },
    { path: '/template', text: 'TEMP' },
];

export const useHeader = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const location = useLocation();

    const handleResize = () => {
        // if (window.innerWidth <= 700)
        //     setMenuItems(minMenuItems);
        // else
            setMenuItems(maxMenuItems);
    };

    useEffect(() => {
        const path = location.pathname;
        const index = minMenuItems.findIndex(item => item.path === path);
        setSelectedIndex(index === -1 ? 0 : index);
    }, [location]);

    useEffect(() => {
        // 반응형 : 글자 줄이기
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return {
        selectedIndex,
        showMenu,
        toggleMenu,
        menuItems,
    };
};
