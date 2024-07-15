import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataBase from './pages/dataBase/DataBase'

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<DataBase />} />
            <Route path="/database" element={<DataBase />} />
        </Routes>
    );
}

export default App;
