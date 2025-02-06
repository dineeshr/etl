import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const SettingsPage = () => {
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'user',
    username: '',
    password: '',
  });

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
      // Map the employee form data to match your backend's employee object
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
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Settings</h1>
      
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
                <option value="user">User</option>
                <option value="admin">Admin</option>
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
    </div>
  );
};

export default SettingsPage;
