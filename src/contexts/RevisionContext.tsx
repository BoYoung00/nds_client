import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getDataBasesForCurrentUser} from "../services/api";
import {Notification} from "../publicComponents/layout/modal/Notification";


interface RevisionContextType {
    loading: boolean;
}

// Context 생성
const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const RevisionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <RevisionContext.Provider
                value={{
                    loading,
                }}
            >
                {children}
            </RevisionContext.Provider>
            {/* 오류 모달 */}
            {/*{ errorMessage && <Notification*/}
            {/*    onClose={() => setErrorMessage(null)}*/}
            {/*    type="error"*/}
            {/*    message={errorMessage}*/}
            {/*/> }*/}
        </>

    );
};

// Context를 사용하는 커스텀 훅
export const useErd = (): RevisionContextType => {
    const context = useContext(RevisionContext);
    if (context === undefined) {
        throw new Error('useErd must be used within a ErdProvider');
    }
    return context;
};