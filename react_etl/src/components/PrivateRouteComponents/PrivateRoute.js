import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user is authenticated and that user data exists
  if (isAuthenticated && user) {
    return children; // If authenticated, render the child components
  }

  // Otherwise, redirect to the login page
  return <Navigate to="/login" />;
};

export default PrivateRoute;
