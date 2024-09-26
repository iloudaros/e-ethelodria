import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import WarehouseManagement from './pages/WarehouseManagement';
import Welcome from './pages/Welcome';
import PrivateRoute from './components/PrivateRoute';
import Stats from './pages/Stats';
import RescuerManagement from './pages/RescuerManagement';
import Vehicle from './pages/Vehicle'
import AnnouncementManager from './pages/Announcements';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<PrivateRoute component={MapPage} />} />
        <Route path="/warehouse-management" element={<PrivateRoute component={WarehouseManagement} />} />
        <Route path="/" element={<Welcome/>} />
        <Route path='/stats' element={<PrivateRoute component={Stats} />} />
        <Route path="/rescuer-management" element={<PrivateRoute component={RescuerManagement} />} />
        <Route path="/vehicle-management" element={<PrivateRoute component={Vehicle}/>} />  
        <Route path="/admin/announcements" element={<PrivateRoute component={AnnouncementManager } />} />
      </Routes>
    </Router>
  );
};

export default App;
