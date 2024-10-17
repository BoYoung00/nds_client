import React, {useEffect, useState} from 'react';
import styles from "./App.module.scss";
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import Main from "./pages/Main";
import UserAuth from "./pages/UserAuth/UserAuth";
import DataBase from "./pages/DataBase/DataBase";
import Header from "./publicComponents/layout/Header";
import Revision from "./pages/Revision";
import Template from "./pages/Template";
import {TableProvider} from "./contexts/TableContext";
import {RevisionProvider} from "./contexts/RevisionContext";
import {WebBuilder} from "./pages/WebBuilder";
import {DataBaseProvider} from "./contexts/DataBaseContext";
import ApiArchive from "./pages/ApiArchive";
import AutoApiConnect from "./pages/AutoApiConnect";
import DBMSConnect from "./pages/DBMSConnect";

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [screenSize, setScreenSize] = useState({ width: window.screen.width, height: window.screen.height });
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const navigate = useNavigate();

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
        } else if (screenSize.width > 1680) {
            html.style.fontSize = '15px';
        } else if (screenSize.width > 1280) {
            html.style.fontSize = '12.5px';
        } else {
            html.style.fontSize = '11px';
        }
    }, [screenSize]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
        setLoading(false); // 로딩 완료
    }, []);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/main');
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
    }

    return (
        <div className={styles.app}>
            {token ? (
                <>
                    <Header token={token} onLogout={handleLogout} />
                    <DataBaseProvider>
                        <div className={styles.app__content}>
                            <Routes>
                                <Route path='/' element={<Navigate to="/database" />} />
                                <Route path="/database" element={<TableProvider> <DataBase /> </TableProvider>} />
                                <Route path="/revision" element={<RevisionProvider> <Revision /> </RevisionProvider>} />
                                <Route path="/api" element={<ApiArchive />} />
                                <Route path="/autoApi" element={<AutoApiConnect />} />
                                {/*<Route path="/workspace" element={<Template />} />*/}
                                {/*<Route path="/workspace/:template" element={<WebBuilder />} />*/}
                                <Route path="/dbConnect" element={<DBMSConnect />} />
                            </Routes>
                        </div>
                    </DataBaseProvider>
                </>
            ) : (
                <Routes>
                    <Route path='/' element={<Navigate to="/main" />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/auth" element={<UserAuth />} />
                </Routes>
            )}
        </div>
    );
};

export default App;