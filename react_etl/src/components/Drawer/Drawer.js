// src/Drawer/Drawer.js

import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Drawer = ({ showDrawer, handleDrawerToggle, empDesignation, handleLogout }) => {
  const navigate = useNavigate(); // To handle navigation

  const handleSettingsRedirect = () => {
    // Navigate to the settings page
    navigate('/settings');
  };

  const handleLogoutAction = () => {
    // Clear authentication status from localStorage (logout)
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('empDesignation');
    
    // Redirect to the login page after logout
    navigate('/login');
  };

  const handleHomeRedirect = () => {
    // Navigate to the home page (root path)
    navigate('/');
  };

  return (
    <Offcanvas show={showDrawer} onHide={handleDrawerToggle}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Home Button */}
        <Button variant="primary" className="mb-2 w-100" onClick={handleHomeRedirect}>
          Home
        </Button>

        {/* Settings Button */}
        {empDesignation === 'admin' && (
          <Button variant="secondary" className="mb-2 w-100" onClick={handleSettingsRedirect}>
            Manage Employees
          </Button>
        )}
                {empDesignation === 'admin' && (
          <Button variant="secondary" className="mb-2 w-100" onClick={"dummyFunctions"}>
            Reports
          </Button>
        )}

        {/* Logout Button */}
        <Button variant="danger" className="w-100" onClick={handleLogoutAction}>
          Logout
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;
