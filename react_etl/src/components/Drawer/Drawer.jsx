import React, { useState, useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation'; // Import the new LogoutConfirmation component
import styles from '../css/DrawerMenu.module.css';

const Drawer = ({ showDrawer, handleDrawerToggle, empDesignation }) => {
  const navigate = useNavigate(); // To handle navigation
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown visibility
  const [employee, setEmployee] = useState(null); // State to hold employee data

  useEffect(() => {
    // Retrieve employee details from localStorage
    const storedEmployee = JSON.parse(localStorage.getItem('user')); // Storing the full user data in localStorage as 'user'
    setEmployee(storedEmployee);
  }, []); // Empty dependency array to run on mount

  // Fallback values in case employee details are not found in localStorage
  const empName = employee ? employee.empName : 'Employee Name';
  const empMail = employee ? employee.empMail : 'Employee Email';
  const empId = employee ? employee.empId : 'Employee ID';
  
  // Use passed empDesignation prop if available, otherwise fallback to employee data from localStorage
  const empDesignationText = empDesignation || (employee ? employee.empDesignation : 'Employee Designation');

  const handleAddEditDeleteRedirect = () => {
    navigate('/EmployeeManagement');
  };

  const handleProfileExportRedirect = () => {
    navigate('/EmployeeProfileExport');
  };

  const handleEmployeesAttendanceRedirect = () => {
    navigate('/EmployeeLoginLogoutLogDisplay');
  };

  const handleLogoutAction = () => {
    setShowLogoutConfirmation(true);
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  const handleReportButtonClick = () => {
    window.open("../../public/report.html", "_blank");
  };
  
  const handleLeaderboardButtonClick = () => {
    window.open("../../public/leaderboard.html", "_blank");
  };

  const handleGrievanceManagementPageRedirect = () => {
    navigate('/GrievanceManagement');
  };

  const handleGrievanceRaisalPageRedirect = () => {
    navigate('/GrievanceRaisal');
  };

  const handleEngineerUpdateRequestPageRedirect = () => {
    navigate('/EngineerUpdateRequest');
  };

  const handleManagerUpdateRequestPageRedirect = () => {
    navigate('/ManagerUpdateRequest');
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleEngineerLeaveRequestPageRedirect = () => {
    navigate('/EngineerLeaveRequest');
  };

  const handleManagerLeaveApprovalPageRedirect = () => {
    navigate('/ManagerLeaveApproval');
  };

  // Toggle function for dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <Offcanvas show={showDrawer} onHide={handleDrawerToggle}>
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Display employee info at the top of the drawer */}
          {employee && (
            <div className={styles.employeeInfo}>
              <h5>ID : {empId}</h5>
              <h5>Name : {empName.toUpperCase()}</h5>
              <h6>Mail Id : {empMail}</h6>
              <h6>Designation : {empDesignationText.toUpperCase()}</h6> {/* Display employee's designation in uppercase */}
              </div>
          )}

          <Button className={styles.button} onClick={handleHomeRedirect}>
            Dashboard
          </Button>

          {empDesignation === 'manager' && (
            <div style={{ marginBottom: '1rem' }}>
              <Button
                className={`${styles.dropdownToggle} ${isDropdownOpen ? styles.open : ''}`}
                onClick={toggleDropdown} // Toggle dropdown visibility
              >
                Manage Employees
              </Button>
              <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.open : ''}`}>
                <Button className={styles.dropdownItem} onClick={handleAddEditDeleteRedirect}>
                  Add / Edit / Delete Employees
                </Button>
                <Button className={styles.dropdownItem} onClick={handleManagerUpdateRequestPageRedirect}>
                  Manage Updation Request
                </Button>
                <Button className={styles.dropdownItem} onClick={handleEmployeesAttendanceRedirect}>
                Employees Work Log
                </Button>
              </div>
            </div>
          )}

          {empDesignation === 'manager' && (
            <Button className={styles.button} onClick={handleProfileExportRedirect}>
              Profile Export
            </Button>
          )}

          {/* Other buttons */}
          {empDesignation === 'manager' && (
            <Button className={styles.button} onClick={handleGrievanceManagementPageRedirect}>
              Manage Grievance Requests
            </Button>
          )}

          {empDesignation === 'engineer' && (
            <Button className={styles.button} onClick={handleGrievanceRaisalPageRedirect}>
              Raise Grievance
            </Button>
          )}

          {empDesignation === 'engineer' && (
            <Button className={styles.button} onClick={handleEngineerUpdateRequestPageRedirect}>
              Request For Updation
            </Button>
          )}

          {empDesignation === 'manager' && (
            <Button className={styles.button} onClick={handleManagerLeaveApprovalPageRedirect}>
              Manage Leave Requests
            </Button>
          )}

          {empDesignation === 'engineer' && (
            <Button className={styles.button} onClick={handleEngineerLeaveRequestPageRedirect}>
              Raise Leave Request
            </Button>
          )}

          {/* Analytics & Reports Button */}
          {empDesignation === 'manager' && (
            <Button className={styles.button} onClick={handleReportButtonClick}>
              Analytics & Reports
            </Button>
          )}

          {/* Leaderboard Button */}
          {empDesignation === 'manager' && (
            <Button className={styles.button} onClick={handleLeaderboardButtonClick}>
              Leaderboard
            </Button>
          )}

          <Button className={`${styles.button} `} onClick={handleLogoutAction}>
            Logout
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      <LogoutConfirmation
        show={showLogoutConfirmation}
        handleCancel={handleCancelLogout}
        handleConfirm={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
};

export default Drawer;
