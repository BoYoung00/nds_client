import React from 'react';
import styled from 'styled-components';

const TabButtonsContainer = styled.div`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: .7rem 1.2rem;
  border: none;
  background-color: ${({ $isActive }) => ($isActive ? '#00A3FF' : 'white')};
  color: ${({ $isActive }) => ($isActive ? 'white' : '#333')};
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:focus {
    outline: none;
  }
`;

interface TabButtonsProps {
    buttons: string[];
    activeTab: string;
    onTabClick: (tab: string) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ buttons, activeTab, onTabClick }) => {
    return (
        <TabButtonsContainer>
            {buttons.map(button => (
                <TabButton
                    key={button}
                    $isActive={activeTab === button}
                    onClick={() => onTabClick(button)}
                >
                    {button}
                </TabButton>
            ))}
        </TabButtonsContainer>
    );
};

export default TabButtons;
