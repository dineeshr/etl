import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
