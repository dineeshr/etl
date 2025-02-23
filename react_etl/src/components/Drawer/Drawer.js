import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import '../css/Drawer.css'; // External CSS file if any

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

  const handleExportReport = () => {
    // Redirect to the Report Generation page for the manager
    navigate('/report-generation');
  };

  return (
    <>
      <style>{`
        /* Offcanvas Header */
        .offcanvas-header {
          background-color: #34495e; /* Deep Blue background color */
          color: white; /* White text color */
          border-bottom: 2px solid #16a085; /* Emerald Green bottom border */
        }

        /* Offcanvas Title */
        .offcanvas-title {
          color: white; /* White text color */
        }

        /* Button styling */
        button {
          font-size: 16px; /* Button text size */
          padding: 12px; /* Vertical and horizontal padding for buttons */
          border-radius: 5px; /* Rounded button edges */
          transition: all 0.3s ease; /* Smooth transition for hover effects */
        }

        button:hover {
          cursor: pointer;
          opacity: 0.8; /* Slight opacity on hover */
        }

        button.mb-2 {
          margin-bottom: 15px; /* Margin between buttons */
        }

        /* Specific button variants */
        button.variant-primary {
          background-color: #007bff; /* Primary blue background */
          border-color: #007bff; /* Primary blue border */
          color: white; /* White text */
        }

        button.variant-secondary {
          background-color: #6c757d; /* Gray background for secondary */
          border-color: #6c757d; /* Gray border */
          color: white; /* White text */
        }

        button.variant-success {
          background-color: #28a745; /* Green background for success */
          border-color: #28a745; /* Green border */
          color: white; /* White text */
        }

        button.variant-danger {
          background-color: #dc3545; /* Red background for danger */
          border-color: #dc3545; /* Red border */
          color: white; /* White text */
        }

        /* For full-width buttons */
        button.w-100 {
          width: 100%;
        }

        /* Close button styling */
        .offcanvas-header .btn-close {
          color: white; /* White close button */
        }
      `}</style>
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
          {empDesignation === 'manager' && (
            <Button variant="secondary" className="mb-2 w-100" onClick={handleSettingsRedirect}>
              Manage Employees
            </Button>
          )}

          {/* Export Report Button */}
          {empDesignation === 'manager' && (
            <Button variant="success" className="mb-2 w-100" onClick={handleExportReport}>
              Export Report
            </Button>
          )}

          {/* Logout Button */}
          <Button variant="danger" className="w-100" onClick={handleLogoutAction}>
            Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Drawer;
