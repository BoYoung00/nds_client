import React, { useEffect, useState } from 'react';
import styles from "./App.module.scss";
import { Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";
import UserAuth from "./pages/UserAuth/UserAuth";
import DataBase from './pages/DataBase/DataBase';
import Header from "./publicComponents/layout/Header";

const exampleUser: UserToken = {
    userToken: "1",
    userEmail: "user1@example.com"
};


const App: React.FC = () => {
    const [user, setUser] = useState<UserToken | null>(exampleUser)
    // const [user, setUser] = useState<UserToken | null>(null);
    const [screenSize, setScreenSize] = useState({ width: window.screen.width, height: window.screen.height });

    // 모니터 해상도에 따른 폰트 크기 조절
    useEffect(() => {
        const handleResize = () => {
            setScreenSize({ width: window.screen.width, height: window.screen.height });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const html = document.documentElement;

        if (screenSize.width > 1920) {
            html.style.fontSize = '20px';
        } else if (screenSize.width > 1280) {
            html.style.fontSize = '16px';
        } else {
            html.style.fontSize = '12px';
        }
    }, [screenSize]);

    return (
        <div className={styles.app}>
            {user ? (
                <>
                    <Header user={user} onLogout={() => setUser(null)} />
                    <div className={styles.app__content}>
                        <Routes>
                            <Route path='/' element={<Navigate to="/database" />} />
                            <Route path="/database" element={<DataBase />} />
                        </Routes>
                    </div>
                </>
            ) : (
                <>
                    <Routes>
                        <Route path='/' element={<Navigate to="/auth" />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/auth" element={<UserAuth />} />
                    </Routes>
                </>
            )}
        </div>
    );
}

export default App;
