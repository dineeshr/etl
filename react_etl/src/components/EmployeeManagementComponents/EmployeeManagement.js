import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import { useNavigate } from 'react-router-dom';

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
    if (validateForm(employeeForm)) {
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
        await axios.post('http://localhost:8080/employees', employee);

        // Close the modal and show a success message
        setShowAddEmployeeModal(false);
        fetchEmployees(); // Fetch the updated list of employees
        alert('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
        alert('Error adding employee');
      }
    }
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(employeeForm)) {
      try {
        const updatedEmployee = {
          empId: editEmployeeId,  // Include the employee ID for updating the correct employee
          empName: employeeForm.name,
          empMail: employeeForm.email,
          empMobileNumber: employeeForm.mobile,
          empDesignation: employeeForm.designation,
          username: employeeForm.username,
          password: employeeForm.password,
        };

        // Send the PUT request to the backend
        await axios.put(`http://localhost:8080/employees/${editEmployeeId}`, updatedEmployee);

        // Close the edit modal and refresh the employee list
        setShowEditEmployeeModal(false);
        fetchEmployees();
        alert('Employee updated successfully!');
      } catch (error) {
        console.error('Error updating employee:', error);
        alert('Error updating employee');
      }
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
    <div className="container mt-5">
      <div className="p-4 rounded shadow-sm">
        <h1 className="text-center mb-4">Manage Employees</h1>

        <div className="text-start mb-4">
          <Button onClick={handleDrawerToggle}>
            Open Menu
          </Button>
        </div>

        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation="manager" // Pass the employee's designation (for example, 'manager')
          handleLogout={handleLogout} // Pass the handleLogout function
        />

        <div className="text-end mb-4">
          <Button onClick={() => setShowAddEmployeeModal(true)}>
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

              <Button className="custom-add-employee-btn" type="submit">
                Add Employee
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Employee Modal */}
        <Modal show={showEditEmployeeModal} onHide={() => setShowEditEmployeeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditEmployeeSubmit}>
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

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={employeeForm.password}
                  onChange={handleEmployeeFormChange}
                />
              </Form.Group>

              <Button className="custom-add-employee-btn" type="submit">
                Update Employee
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
                    <Button onClick={() => handleEditClick(employee)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteEmployee(employee.empId)}>
                      Delete
                    </Button>
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
