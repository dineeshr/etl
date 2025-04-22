import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import styles from '../css/ManageEmployees.module.css';
import OpenMenuButton from '../MenuButton/OpenMenuButton';

const EmployeeManagement = () => {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false); // Modal for editing
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'engineer',
    username: '',
    password: '',
  });

  const [employees, setEmployees] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false); // Drawer visibility state
  const [editEmployeeId, setEditEmployeeId] = useState(null); // Store ID of employee being edited
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // For storing employee ID for deletion
    const [empDesignation] = useState(localStorage.getItem('empDesignation'));

  // Fetch all employees on page load
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/employees');
      setEmployees(response.data); // Update the employees state with the fetched data
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(employeeForm)) {
      const employee = {
        empName: employeeForm.name,
        empMail: employeeForm.email,
        empMobileNumber: employeeForm.mobile,
        empDesignation: employeeForm.designation,
        username: employeeForm.username,
        password: employeeForm.password,
      };

      await showConfirmationDialogBox('add', employee);
    }
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(employeeForm)) {
      const updatedEmployee = {
        empId: editEmployeeId,  // Include the employee ID for updating the correct employee
        empName: employeeForm.name,
        empMail: employeeForm.email,
        empMobileNumber: employeeForm.mobile,
        empDesignation: employeeForm.designation,
        username: employeeForm.username,
        password: employeeForm.password,
      };

      await showConfirmationDialogBox('edit', updatedEmployee);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    await showConfirmationDialogBox('delete', employeeId);
  };

  const showConfirmationDialogBox = (actionType, employeeData) => {
    setActionType(actionType);
    setShowConfirmationDialog(true);
    setEmployeeToDelete(employeeData);
  };

  const handleConfirmAction = async () => {
    setShowConfirmationDialog(false);
    if (actionType === 'add') {
      try {
        await axios.post('http://localhost:8080/employees', employeeToDelete);
        fetchEmployees();
        alert('Employee added successfully!');
        setShowAddEmployeeModal(false); // Close the Add Employee modal
        resetForm(); // Reset form data
      } catch (error) {
        console.error('Error adding employee:', error);
        alert('Error adding employee');
      }
    } else if (actionType === 'edit') {
      try {
        await axios.put(`http://localhost:8080/employees/${employeeToDelete.empId}`, employeeToDelete);
        fetchEmployees();
        alert('Employee updated successfully!');
        setShowEditEmployeeModal(false); // Close the Edit Employee modal
        resetForm(); // Reset form data
      } catch (error) {
        console.error('Error updating employee:', error);
        alert('Error updating employee');
      }
    } else if (actionType === 'delete') {
      try {
        await axios.delete(`http://localhost:8080/employees/${employeeToDelete}`);
        fetchEmployees();
        alert('Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
      }
    }
  };

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle drawer visibility
  };


  const handleEditClick = (employee) => {
    // Populate the form with the employee data
    setEmployeeForm({
      name: employee.empName,
      email: employee.empMail,
      mobile: employee.empMobileNumber,
      designation: employee.empDesignation,
      username: employee.username,
      password: '', // You might want to keep this empty or add a default value
    });
    setEditEmployeeId(employee.empId);
    setShowEditEmployeeModal(true); // Show the edit modal
  };

  // Reset form data after closing modals
  const resetForm = () => {
    setEmployeeForm({
      name: '',
      email: '',
      mobile: '',
      designation: 'engineer',
      username: '',
      password: '',
    });
  };

  // Validation function
  const validateForm = (form) => {
    // Name validation: Check if the name is not empty
    if (!form.name) {
      alert('Name is required');
      return false;
    }

    // Email validation: Check if the email is not empty and matches email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!form.email || !emailPattern.test(form.email)) {
      alert('Please enter a valid email');
      return false;
    }

    // Mobile number validation: Check if it's 10 characters long and contains only numbers
    const mobilePattern = /^\d{10}$/;
    if (!form.mobile || !mobilePattern.test(form.mobile)) {
      alert('Mobile number must be 10 digits');
      return false;
    }

    // Username validation: Check if the username is not empty
    if (!form.username) {
      alert('Username is required');
      return false;
    }

    // Password validation: Minimum 8 characters, at least one uppercase, one number, and one special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!form.password || !passwordPattern.test(form.password)) {
      alert('Password must be at least 8 characters, contain one uppercase letter, one number, and one special character');
      return false;
    }

    return true;
  };

  return (
    <div className={`container mt-5 ${styles.container}`}>
      <div className={`p-4 rounded shadow-sm ${styles.paddedContent}`}>
        <h1 className={`text-center mb-4 ${styles.title}`}>Manage Employees</h1>

        <div className="mb-4">
          <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
        </div>
        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation={empDesignation}
        />

<div className={`text-end mb-4`}>
  <Button 
    onClick={() => {
      // Call the resetForm() function to reset the form fields
      resetForm();
      setShowAddEmployeeModal(true); // Show the modal after resetting the form
    }} 
    className={styles.buttonPrimary}
  >
    Add Employee
  </Button>
</div>

        {/* Add Employee Modal */}
        <Modal show={showAddEmployeeModal} onHide={() => setShowAddEmployeeModal(false)}>
          <Modal.Header className={styles.modalHeader} closeButton>
            <Modal.Title className={styles.modalTitle}>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddEmployeeSubmit}>
              <Form.Group controlId="name" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={employeeForm.name}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={employeeForm.email}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="mobile" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  name="mobile"
                  value={employeeForm.mobile}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="designation" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="designation"
                  value={employeeForm.designation}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                >
                  <option value="engineer">Engineer</option>
                  <option value="manager">Manager</option>

                </Form.Control>
              </Form.Group>

              <Form.Group controlId="username" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={employeeForm.username}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={employeeForm.password}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Button type="submit" className={styles.buttonPrimary}>
                Add Employee
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Employee Modal */}
        <Modal show={showEditEmployeeModal} onHide={() => setShowEditEmployeeModal(false)}>
          <Modal.Header className={styles.modalHeader} closeButton>
            <Modal.Title className={styles.modalTitle}>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditEmployeeSubmit}>
              <Form.Group controlId="name" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={employeeForm.name}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={employeeForm.email}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="mobile" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  name="mobile"
                  value={employeeForm.mobile}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="designation" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Designation</Form.Label>
                <Form.Control
                  as="select"
                  name="designation"
                  value={employeeForm.designation}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                >
                  <option value="engineer">Engineer</option>
                  <option value="manager">Manager</option>

                </Form.Control>
              </Form.Group>

              <Form.Group controlId="username" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={employeeForm.username}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className={styles.formGroup}>
                <Form.Label className={styles.formLabel}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={employeeForm.password}
                  onChange={handleEmployeeFormChange}
                  className={styles.formControl}
                />
              </Form.Group>

              <Button type="submit" className={styles.buttonPrimary}>
                Update Employee
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Confirmation Dialog */}
        <Modal show={showConfirmationDialog} onHide={() => setShowConfirmationDialog(false)}>
          <Modal.Header className={styles.modalHeader} closeButton>
            <Modal.Title>{actionType === 'delete' ? 'Confirm Deletion' : 'Confirm Action'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {actionType === 'delete'
              ? 'Are you sure you want to delete this employee?'
              : `Are you sure you want to ${actionType} this employee?`}
          </Modal.Body>
          <Modal.Footer>
            <Button variant = "danger "onClick={() => setShowConfirmationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} className={styles.buttonPrimary}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Employee Table */}
        <div className={styles.tableContainer}>
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableCell}>Name</th>
                <th className={styles.tableCell}>Email</th>
                <th className={styles.tableCell}>Mobile</th>
                <th className={styles.tableCell}>Designation</th>
                <th className={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr
                  key={employee.empId}
                  className={`${styles.tableRow} ${index % 2 === 0 ? styles.tableRowEven : ''}`}
                >
                  <td className={styles.tableCell}>{employee.empName}</td>
                  <td className={styles.tableCell}>{employee.empMail}</td>
                  <td className={styles.tableCell}>{employee.empMobileNumber}</td>
                  <td className={styles.tableCell}>{employee.empDesignation}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.tableActions}>
                      <Button
                        onClick={() => handleEditClick(employee)}
                        className={styles.buttonPrimary}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteEmployee(employee.empId)}
                        className={styles.buttonPrimary}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
