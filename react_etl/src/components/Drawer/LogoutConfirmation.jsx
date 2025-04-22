import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LogoutConfirmation.module.css'; // Import the CSS module

const LogoutConfirmation = ({ show, handleCancel, handleConfirm }) => {

  const navigate = useNavigate(); // To handle navigation

  const handleLogout = async () => {
    // Get the current logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Call the logout API to log out the user
    try {
      const response = await axios.post('http://localhost:8080/api/auth/logout', { 
        empId:user.empId, 
      });

      if (response.status === 200) {
        // Successfully logged out, clear localStorage and redirect to login
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('empDesignation');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out');
    }

    // Close the logout confirmation modal
    handleCancel(); // Close modal after logout
  };

  return (
    <Modal show={show} onHide={handleCancel} className={styles.modalContent}>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <p>Do you want to logout?</p>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button className={`${styles.cancelButton} ${styles.buttonSpacing}`} onClick={handleCancel}>
          Cancel
        </Button>
        <Button className={styles.confirmButton} onClick={handleLogout}>
          Confirm Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutConfirmation;
