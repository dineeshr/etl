import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import styles from '../css/EmployeesProfiles.module.css'; // Import the CSS module
import OpenMenuButton from '../MenuButton/OpenMenuButton';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false); // Drawer visibility state
  const navigate = useNavigate();
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

  const handleExportClick = (employee) => {
    const doc = new jsPDF();
    const headerText = `${employee.empName} - (${employee.username}) details`;
    doc.text(headerText, 10, 10);
    // Table data
    const tableData = [
      ['Id', employee.empId],
      ['Name', employee.empName],
      ['Email', employee.empMail],
      ['Mobile', employee.empMobileNumber],
      ['Designation', employee.empDesignation],
      ['Username', employee.username],
    ];

    // Use autoTable
    autoTable(doc, {
      startY: 20, // Start position of table
      head: [['Field', 'Details']], // Table header
      body: tableData, // Table content
    });

    // Save the PDF
    doc.save(`${employee.empName}_Details.pdf`);
  };

  const handleExportAllClick = () => {
    const doc = new jsPDF();
    const headerText = `Employee Details`;
    doc.text(headerText, 10, 10);

    let startY = 20; // Default start position for the first table

    // Define the headers that should appear horizontally
    const headers = ['Id', 'Name', 'Email', 'Mobile', 'Designation', 'Username'];

    // Create a table for each employee with horizontal headers
    const tableData = employees.map(employee => [
      employee.empId,
      employee.empName,
      employee.empMail,
      employee.empMobileNumber,
      employee.empDesignation,
      employee.username
    ]);

    // Use autoTable for all employees in one table with horizontal headers
    autoTable(doc, {
      startY: startY,
      head: [headers], // Table headers in a horizontal layout
      body: tableData, // Each employee data is a row in the table
      theme: 'grid', // Optional: Adds gridlines to the table
    });

    // Save the PDF with all employee details
    doc.save('All_Employees_Details.pdf');
  };

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle drawer visibility
  };


  return (
    <div className={`container ${styles.container}`}>
      <div className={`p-4 rounded shadow-sm ${styles.paddedContent}`}>
        <h1 className={`text-center mb-4 ${styles.title}`}>Employees Profiles</h1>

        <div className="mb-4">
          <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
        </div>
        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation={empDesignation}
        />

        <div className={`text-end mb-4 ${styles.textEnd}`}>
          <Button onClick={handleExportAllClick} className={styles.actionButton}>
            Export All
          </Button>
        </div>

        {/* Employee Records Table */}
        <div className={`mt-4 ${styles.tableContainer}`}>
          <h2>Employee Records</h2>
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Username</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.empId}>
                  <td>{employee.empId}</td>
                  <td>{employee.empName}</td>
                  <td>{employee.empMail}</td>
                  <td>{employee.empMobileNumber}</td>
                  <td>{employee.empDesignation}</td>
                  <td>{employee.username}</td>
                  <td>
                    <Button 
                      onClick={() => handleExportClick(employee)} 
                      className={styles.actionButton}
                    >
                      Export
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
