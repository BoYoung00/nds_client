import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface MenuItem {
    path: string;
    text: string;
}

const maxMenuItems: MenuItem[] = [
    { path: '/database', text: 'DATABASE' },
    { path: '/revision', text: 'REVISION' },
    // { path: '/api', text: 'API ARCHIVE' },
    { path: '/autoApi', text: 'AUTO API CONNECT' },
    // { path: '/workspace', text: 'WORKSPACE' },
    { path: '/dbConnect', text: 'DBMS CONNECT' },
];

const minMenuItems: MenuItem[] = [
    { path: '/database', text: 'DB' },
    { path: '/revision', text: 'REV' },
    // { path: '/api', text: 'API' },
    { path: '/autoApi', text: 'AUTO API' },
    // { path: '/workspace', text: 'WORK' },
    { path: '/dbConnect', text: 'DBMS' },
];

export const useHeader = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const location = useLocation();

    const handleResize = () => {
        // if (window.innerWidth <= 1100)
        //     setMenuItems(minMenuItems);
        // else
            setMenuItems(maxMenuItems);
    };

    useEffect(() => {
        const path = location.pathname;
        const firstPath = path.split('/')[1];
        const index = minMenuItems.findIndex(item => item.path.includes(firstPath));
        setSelectedIndex(index === -1 ? 0 : index);
    }, [location]);


    useEffect(() => {
        handleResize(); // 반응형 : 글자 줄이기
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
