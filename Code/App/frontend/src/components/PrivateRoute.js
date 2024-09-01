import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('user');

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
