import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import WarehouseManagement from './pages/WarehouseManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/warehouse-management" element={<WarehouseManagement />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
