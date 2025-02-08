import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
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
  const navigate = useNavigate();

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
    try {
      const employee = {
        empName: employeeForm.name,
        empMail: employeeForm.email,
        empMobileNumber: employeeForm.mobile,
        empDesignation: employeeForm.designation,
        username: employeeForm.username,
        password: employeeForm.password,
      };

      // Send the POST request to the backend
      const response = await axios.post('http://localhost:8080/employees', employee);

      // Close the modal and show a success message
      setShowAddEmployeeModal(false);
      fetchEmployees(); // Fetch the updated list of employees
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      // Send the DELETE request to the backend
      await axios.delete(`http://localhost:8080/employees/${employeeId}`);

      // Fetch the updated list of employees after deletion
      fetchEmployees();
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle drawer visibility
  };

  const handleLogout = () => {
    // Clear authentication status from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('empDesignation');
    
    // Redirect to the login page after logout
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Settings</h1>

      {/* Open Menu Button positioned on the left side */}
      <div className="text-start mb-4">
        <Button onClick={handleDrawerToggle}>
          Open Menu
        </Button>
      </div>

      {/* Drawer Component */}
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation="manager" // Pass the employee's designation (for example, 'manager')
        handleLogout={handleLogout} // Pass the handleLogout function
      />

      {/* Add Employee Button */}
      <div className="text-end mb-4">
        <Button variant="primary" onClick={() => setShowAddEmployeeModal(true)}>
          Add Employee
        </Button>
      </div>

      {/* Add Employee Modal */}
      <Modal show={showAddEmployeeModal} onHide={() => setShowAddEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEmployeeSubmit}>
            {/* Name Input */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={employeeForm.name}
                onChange={handleEmployeeFormChange}
                required
              />
            </Form.Group>

            {/* Email Input */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={employeeForm.email}
                onChange={handleEmployeeFormChange}
                required
              />
            </Form.Group>

            {/* Mobile Number Input */}
            <Form.Group controlId="mobile" className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mobile number"
                name="mobile"
                value={employeeForm.mobile}
                onChange={handleEmployeeFormChange}
                required
              />
            </Form.Group>

            {/* Designation Dropdown */}
            <Form.Group controlId="designation" className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                as="select"
                name="designation"
                value={employeeForm.designation}
                onChange={handleEmployeeFormChange}
                required
              >
                <option value="engineer">Engineer</option>
                <option value="manager">Manager</option>
              </Form.Control>
            </Form.Group>

            {/* Username Input */}
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={employeeForm.username}
                onChange={handleEmployeeFormChange}
                required
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={employeeForm.password}
                onChange={handleEmployeeFormChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Add Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Employee Records Table */}
      <div className="mt-4">
        <h2>Employee Records</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.empId}>
                <td>{employee.empName}</td>
                <td>{employee.empMail}</td>
                <td>{employee.empMobileNumber}</td>
                <td>{employee.empDesignation}</td>
                <td>{employee.username}</td>
                <td>
                  {/* Delete Button */}
                  <Button variant="danger" onClick={() => handleDeleteEmployee(employee.empId)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SettingsPage;
