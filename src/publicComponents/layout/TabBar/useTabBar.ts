import { useState } from 'react';

interface UseTabBarProps {
    initialIndex: number;
    onTabSelect: (index: number) => void;
}

export const useTabBar = ({ initialIndex, onTabSelect }: UseTabBarProps) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    const handleTabClick = (index: number) => {
        setSelectedIndex(index);
        onTabSelect(index);
    };

    return {
        selectedIndex,
        handleTabClick,
    };
};
