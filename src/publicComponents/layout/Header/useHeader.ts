import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface MenuItem {
    path: string;
    text: string;
}

const maxMenuItems: MenuItem[] = [
    { path: '/database', text: 'DATABASE' },
    { path: '/version', text: 'VERSION' },
    { path: '/erd', text: 'ERD' },
    { path: '/api', text: 'API ARCHIVE' },
    { path: '/template', text: 'TEMPLATE' }
];

const minMenuItems: MenuItem[] = [
    { path: '/database', text: 'DB' },
    { path: '/version', text: 'VCS' },
    { path: '/erd', text: 'ERD' },
    { path: '/api', text: 'API' },
    { path: '/template', text: 'TEMP' }
];

export const useHeader = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const location = useLocation();

    const handleResize = () => {
        if (window.innerWidth <= 700)
            setMenuItems(minMenuItems);
        else
            setMenuItems(maxMenuItems);
    };

    useEffect(() => {
        const path = location.pathname;
        const index = minMenuItems.findIndex(item => item.path === path);
        setSelectedIndex(index === -1 ? 0 : index);
    }, [location]);

    useEffect(() => {
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
