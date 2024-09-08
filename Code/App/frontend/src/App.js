import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import WarehouseManagement from './pages/WarehouseManagement';
import Welcome from './pages/Welcome';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<PrivateRoute component={MapPage} />} />
        <Route path="/warehouse-management" element={<PrivateRoute component={WarehouseManagement} />} />
        <Route path="/" element={<Welcome/>} />
      </Routes>
    </Router>
  );
};

export default App;
