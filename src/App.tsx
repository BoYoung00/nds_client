import React, {useEffect, useState} from 'react';
import styles from "./App.module.scss";
import { Routes, Route, Navigate } from 'react-router-dom';
import Main from "./pages/Main";
import DataBase from './pages/DataBaseTab/DataBase';
import Header from "./publicComponents/layout/Header";

// 임시 유저 정보
const exampleUser: UserToken = {
    userToken: "1",
    userEmail: "user1@example.com"
};

const App: React.FC = () => {
    const [user, setUser] = useState<UserToken | null>(exampleUser);
    // const { isAuthenticated } = useAuth();

    return (
        <div className={styles.app}>
            {user ? (
                <>
                    <Header user={user} onLogout={() => setUser(null)} />
                    <div className={styles.content}>
                        <Routes>
                            <Route path='/' element={<Navigate to="/database" />} />
                            <Route path="/database" element={<DataBase />} />
                        </Routes>
                    </div>
                </>
            ) : ( // 로그인 안 하면 메인으로 돌아감
                <div>
                    <Routes>
                        <Route path='/' element={<Navigate to="/main" />} />
                        <Route path="/main" element={<Main />} />
                    </Routes>
                </div>
            )}
        </div>
    );
}

export default App;
