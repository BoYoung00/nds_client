import React, {useEffect, useState} from 'react';
import styles from "./App.module.scss";
import {Navigate, Route, Routes} from 'react-router-dom';
import Main from "./pages/Main";
import UserAuth from "./pages/UserAuth/UserAuth";
import DataBase from './pages/DataBase/DataBase';
import Header from "./publicComponents/layout/Header";
import ApiArchive from "./pages/ApiArchive";
import Version from "./pages/Version";
import Erd from "./pages/Erd";
import Template from "./pages/Template";
import {DataBaseProvider} from "./contexts/DataBaseContext";
import {ErdProvider} from "./contexts/ErdContext";

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [screenSize, setScreenSize] = useState({ width: window.screen.width, height: window.screen.height });

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
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        } else {
            setToken(null);
        }
    }, []);

    useEffect(() => {
        const html = document.documentElement;

        if (screenSize.width > 1920) {
            html.style.fontSize = '20px';
        } else if (screenSize.width > 1280) {
            html.style.fontSize = '14px';
        } else {
            html.style.fontSize = '11px';
        }
    }, [screenSize]);

    return (
        <div className={styles.app}>
            {token ? (
                <>
                    <Header token={token} onLogout={() => setToken(null)} />
                    <div className={styles.app__content}>
                        <Routes>
                            <Route path='*' element={<Navigate to="/database" />} />
                            <Route path="/database" element={<DataBaseProvider> <DataBase /> </DataBaseProvider>} />
                            <Route path="/version" element={<Version />} />
                            <Route path="/erd" element={<DataBaseProvider> <Erd /> </ DataBaseProvider>} />
                            <Route path="/api" element={<ApiArchive />} />
                            <Route path="/template" element={<Template />} />
                        </Routes>
                    </div>
                </>
            ) : (
                <>
                    <Routes>
                        <Route path='*' element={<Navigate to="/auth" />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/auth" element={<UserAuth />} />
                    </Routes>
                </>
            )}
        </div>
    );
}

export default App;
