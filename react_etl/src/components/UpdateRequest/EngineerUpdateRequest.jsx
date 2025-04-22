import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';  // Import jsPDF
import { autoTable } from 'jspdf-autotable';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import styles from '../css/EngineerUpdateRequests.module.css'; // Import the CSS module

const EngineerUpdateRequest = () => {
  const [formData, setFormData] = useState({
    empName: '',
    empMail: '',
    empMobileNumber: '',
    username: '',
    password: ''
  });

  const [history, setHistory] = useState([]); // State to store the update history
  const [loadingHistory, setLoadingHistory] = useState(true); // State for loading indicator
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility
  const [empDesignation, setEmpDesignation] = useState(localStorage.getItem('empDesignation'));

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };



  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch update history when the component mounts
  useEffect(() => {
    const fetchUpdateHistory = async () => {
      const empId = localStorage.getItem('empId'); // Retrieve empId from localStorage
      if (!empId) {
        alert('Employee ID not found in localStorage');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/update-requests/history/${empId}`);
      if (response.data && response.data.length > 0) {
        setHistory(response.data); // Set history data in state
      } else {
        setHistory([]); // Set history to an empty array
        alert('No update history available');
      }
    };

    fetchUpdateHistory();
  }, []);

  // Form validation logic
  const validateForm = () => {
    const { empName, empMail, empMobileNumber, username, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!empName) {
      alert("Employee name is required.");
      return false;
    }
    if (!empMail || !emailRegex.test(empMail)) {
      alert("Please enter a valid email address.");
      return false;
    }
    if (!empMobileNumber || !mobileRegex.test(empMobileNumber)) {
      alert("Mobile number must be exactly 10 digits.");
      return false;
    }
    if (!username) {
      alert("Username is required.");
      return false;
    }
    if (!password || !passwordRegex.test(password)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Show confirmation dialog
    const confirmSubmission = window.confirm("Are you sure to submit the data update request?");
    
    if (!confirmSubmission) {
      // If user cancels, don't submit the form
      return;
    }
  
    // Validate form before proceeding
    if (!validateForm()) {
      return; // If validation fails, stop form submission
    }
  
    const empId = localStorage.getItem('empId'); // Retrieve empId from localStorage
    if (!empId) {
      alert('Employee ID not found in localStorage');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:8080/api/update-requests/submit/${empId}`, formData);
      alert('Update request submitted successfully!');
      setHistory([response.data, ...history]); // Optionally update history with the new request
    } catch (error) {
      console.error('Error submitting update request:', error);
      alert('Error submitting update request');
    }
  };
  

  // Export the row data to PDF (for individual row)
  const exportToPDF = (employee) => {
    const doc = new jsPDF();
    
    // Header text for the PDF
    const headerText = `${employee.empName} - (${employee.username}) details`;
    doc.text(headerText, 10, 10);
    
    // Table data - key-value pairs
    const tableData = [
      ['Request ID', employee.requestId],
      ['Employee Name', employee.empName],
      ['Email', employee.empMail],
      ['Mobile Number', employee.empMobileNumber],
      ['Username', employee.username],
      ['Password', employee.password],
      ['Status', employee.status],
      ['Request Time', employee.requestTime],
      ['Approval Time', employee.approvalTime],
    ];
  
    // Use autoTable to generate the table in the PDF
    autoTable(doc, {
      startY: 20, // Starting position of the table (below the header text)
      head: [['Field', 'Details']], // Table header row
      body: tableData, // Table content (key-value pairs)
      theme: 'grid', // Adding grid style to the table
      styles: {
        fontSize: 12, // Font size for the table content
        cellPadding: 5, // Padding inside cells
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [255, 255, 255], // Header text color (white)
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body background color (white)
        textColor: [0, 0, 0], // Body text color (black)
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Column 0 (field names) with fixed width
        1: { cellWidth: 'auto' }, // Column 1 (details) with automatic width
      },
    });
    
    // Save the generated PDF with employee name as the filename
    doc.save(`${employee.empName}_update_request.pdf`);
  };

  // Export all data to PDF
  const exportAllToPDF = () => {
    const doc = new jsPDF('landscape'); // Set the document to landscape orientation
  
    // Header text for the PDF
    const headerText = 'Update Request History';
    doc.text(headerText, 10, 10);
  
    // Table data for all employees
    const tableData = history.map((employee) => [
      employee.requestId,
      employee.empName,
      employee.empMail,
      employee.empMobileNumber,
      employee.username,
      employee.password,
      employee.status,
      employee.requestTime,
      employee.approvalTime,
    ]);
  
    // Configure autoTable settings
    autoTable(doc, {
      startY: 20, // Starting position of the table (below the header text)
      head: [['Request ID', 'Employee Name', 'Email', 'Mobile Number', 'Username', 'Password', 'Status', 'Request Time', 'Approval Time']], // Table header row
      body: tableData, // Table content for all employees
      theme: 'grid', // Adding grid style to the table
      styles: {
        fontSize: 6, // Reduce font size further to fit content
        cellPadding: 2, // Reduce padding inside cells
        halign: 'center', // Align text in columns to the center
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [255, 255, 255], // Header text color (white)
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body background color (white)
        textColor: [0, 0, 0], // Body text color (black)
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Column 0 (Request ID) with fixed width
        1: { cellWidth: 40 }, // Column 1 (Employee Name) with fixed width
        2: { cellWidth: 40 }, // Column 2 (Email) with fixed width
        3: { cellWidth: 30 }, // Column 3 (Mobile Number) with fixed width
        4: { cellWidth: 30 }, // Column 4 (Username) with fixed width
        5: { cellWidth: 30 }, // Column 5 (Password) with fixed width
        6: { cellWidth: 30 }, // Column 6 (Status) with fixed width
        7: { cellWidth: 40 }, // Column 7 (Request Time) with fixed width
        8: { cellWidth: 40 }, // Column 8 (Approval Time) with fixed width
      },
      margin: { top: 20, left: 1, right: 5 }, // Reduced left margin to shift the table left
      pageBreak: 'auto', // Automatically manage page breaks
      didDrawPage: function (data) {
        // Ensure that the content stays within the page height
        const yPosition = data.cursor.y;
        const pageHeight = doc.internal.pageSize.height;
  
        // Check if the current page will overflow
        if (yPosition > pageHeight - 20) {
          doc.addPage(); // Manually add a new page if the content overflows
          doc.text(headerText, 10, 10); // Re-add header on new page
        }
      },
    });
  
    // Save the generated PDF
    doc.save('update_request_history.pdf');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Request Profile Details Update</h2>
      <div className="mb-4">
        {/* Use the imported OpenMenuButton component */}
        <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
      </div>
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation={empDesignation}
      />
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Employee Name:</label>
          <input
            type="text"
            name="empName"
            value={formData.empName}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            name="empMail"
            value={formData.empMail}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Mobile Number:</label>
          <input
            type="text"
            name="empMobileNumber"
            value={formData.empMobileNumber}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Submit Update Request
        </button>
      </form>
  
      <h3 className={styles.historyHeading}>Update Request History</h3>
  
      <div className={styles.tableWrapper}>
        {/* Export All button */}
        <button onClick={exportAllToPDF} className={styles.exportAllBtn}>
          Export All
        </button>
  
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Username</th>
              <th>Password</th>
              <th>Status</th>
              <th>Request Time</th>
              <th>Approval Time</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            {history.map((request) => (
              <tr key={request.requestId}>
                <td>{request.requestId}</td>
                <td>{request.empName}</td>
                <td>{request.empMail}</td>
                <td>{request.empMobileNumber}</td>
                <td>{request.username}</td>
                <td>{request.password}</td>
                <td>{request.status}</td>
                <td>{request.requestTime}</td>
                <td>{request.approvalTime}</td>
                <td>
                  <button
                    onClick={() => exportToPDF(request)}
                    className={styles.exportBtn}
                  >
                    Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default EngineerUpdateRequest;
