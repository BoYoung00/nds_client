import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const menuItems = [
    { path: '/database', text: 'DATABASE' },
    { path: '/version', text: 'VERSION' },
    { path: '/erd', text: 'ERD' },
    { path: '/api', text: 'API ARCHIVE' },
    { path: '/template', text: 'TEMPLATE' }
];

export const useHeader = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const index = menuItems.findIndex(item => item.path === path);
        setSelectedIndex(index === -1 ? 0 : index);
    }, [location]);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return {
        selectedIndex,
        showMenu,
        toggleMenu,
        menuItems
    };
};
