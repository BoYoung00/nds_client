import React, {useEffect, useState} from 'react';
import styles from "./App.module.scss";
import {Navigate, Route, Routes} from 'react-router-dom';
import Main from "./pages/Main";
import UserAuth from "./pages/UserAuth/UserAuth";
import DataBase from "./pages/DataBase/DataBase";
import Header from "./publicComponents/layout/Header";
import ApiArchive from "./pages/ApiArchive";
import Revision from "./pages/Revision";
import Template from "./pages/Template";
import {TableProvider} from "./contexts/TableContext";
import {RevisionProvider} from "./contexts/RevisionContext";

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
        } else if (screenSize.width > 1680) {
            html.style.fontSize = '16px';
        } else if (screenSize.width > 1280) {
            html.style.fontSize = '14px';
        } else {
            html.style.fontSize = '12px';
        }
    }, [screenSize]);

    return (
        <div className={styles.app}>
            {token ? (
                <>
                    <Header token={token} onLogout={() => setToken(null)} />
                    <div className={styles.app__content}>
                        <Routes>
                            <Route path='/' element={<Navigate to="/database" />} />
                            <Route path="/database" element={<TableProvider> <DataBase /> </TableProvider> } />
                            <Route path="/revision" element={<RevisionProvider> <Revision /> </RevisionProvider>} />
                            {/*<Route path="/erd" element={<TableProvider> <ErdMode /> </TableProvider>} />*/}
                            <Route path="/api" element={<ApiArchive />} />
                            <Route path="/template" element={<Template />} />
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
