import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import styles from '../css/ManagerUpdateRequests.module.css';

const ManagerUpdateRequest = () => {
  const [updateRequests, setUpdateRequests] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility
  const [empDesignation, setEmpDesignation] = useState(localStorage.getItem('empDesignation'));

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };


  // Fetch the pending update requests for approval
  useEffect(() => {
    const fetchUpdateRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/update-requests/history/all');
        setUpdateRequests(response.data);
      } catch (error) {
        console.error('Error fetching update requests:', error);
        alert('Error fetching update requests');
      }
    };

    fetchUpdateRequests();
  }, []);

  // Handle approval or rejection of the request
  const handleApproval = async (requestId, approved) => {
    const action = approved ? 'approve' : 'reject';
    const message = `Are you sure you want to ${action} this update request?`;
  
    // Show confirmation dialog
    const isConfirmed = window.confirm(message);
  
    if (isConfirmed) {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/update-requests/approve-reject/${requestId}`,
          null,
          {
            params: { approved }
          }
        );
    
        if (response.status === 200) {
          setUpdateRequests(prevRequests =>
            prevRequests.map((request) =>
              request.requestId === requestId
                ? { ...request, status: approved ? 'Approved' : 'Rejected' }
                : request
            )
          );
          alert('Request updated successfully!');
        }
      } catch (error) {
        console.error('Error handling approval:', error);
        alert('Error handling approval');
      }
    }
  };
  

  // Function to export row as PDF
  const exportToPDF = (request) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
  
    // Add title
    doc.text('Update Request Details', 14, 10);
    doc.text('-----------------------', 14, 15);
  
    // Key-value pair data
    const rowData = [
      { key: 'Request ID', value: request.requestId },
      { key: 'Employee ID', value: request.employee.empId },
      { key: 'Employee Name', value: request.empName },
      { key: 'Email', value: request.empMail },
      { key: 'Mobile Number', value: request.empMobileNumber },
      { key: 'Username', value: request.username },
      { key: 'Password', value: request.password },
      { key: 'Status', value: request.status },
      { key: 'Approval Time', value: request.approvalTime ? new Date(request.approvalTime).toLocaleString() : '-' },
    ];
  
    // Convert key-value data into a table format
    const tableData = rowData.map(row => [row.key, row.value]);
  
    // Apply styles to the table in PDF
    autoTable(doc, {
      startY: 20, // Set the starting Y position of the table
      head: [['Field', 'Details']], // Table header
      body: tableData, // Table body (key-value pairs)
      theme: 'grid', // Grid style for table
      styles: {
        fontSize: 12,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Green background color for header
        textColor: [255, 255, 255], // White text color for header
        fontStyle: 'bold', // Bold text in header
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // White background for table rows
        textColor: [0, 0, 0], // Black text color for body
      },
      tableWidth: 'auto', // Automatically adjust the table width
      columnStyles: {
        0: { cellWidth: 50 }, // Set the width for the first column (keys)
        1: { cellWidth: 100 }, // Set the width for the second column (values)
      },
    });
  
    // Save PDF
    doc.save(`${request.requestId}_update_request.pdf`);
  };

  // Function to export all requests as a table in a single PDF
  const exportAllToPDF = () => {
    const doc = new jsPDF('landscape'); // Set the document to landscape orientation
  
    // Header text for the PDF
    const headerText = 'Update Request History';
    doc.text(headerText, 10, 10);
  
    // Table data for all employees (using history from your state or props)
    const tableData = updateRequests.map((employee) => [
      employee.requestId,
      employee.empName,
      employee.empMail,
      employee.empMobileNumber,
      employee.username,
      employee.password,
      employee.status,
      employee.requestTime ? new Date(employee.requestTime).toLocaleString() : '-',
      employee.approvalTime ? new Date(employee.approvalTime).toLocaleString() : '-',
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
      <h2 className={styles.title}>Manager Update Requests</h2>
      <div className="mb-4">
        <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
      </div>
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation={empDesignation}
      />
      
      {/* Export All button above the table */}
      <button onClick={exportAllToPDF} className={styles.exportAllButton}>
        Export All Requests
      </button>
      
      {updateRequests.length === 0 ? (
        <p className={styles.noRequests}>No update requests available</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Username</th>
                <th>Password</th>
                <th>Status</th>
                <th>Approval Time</th>
                <th>Actions</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {updateRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{request.employee.empId}</td>
                  <td>
                    {request.empName} <br />
                    <span className={styles.oldData}>(Old: {request.employee.empName})</span>
                  </td>
                  <td>
                    {request.empMail} <br />
                    <span className={styles.oldData}>(Old: {request.employee.empMail})</span>
                  </td>
                  <td>
                    {request.empMobileNumber} <br />
                    <span className={styles.oldData}>(Old: {request.employee.empMobileNumber})</span>
                  </td>
                  <td>
                    {request.username} <br />
                    <span className={styles.oldData}>(Old: {request.employee.username})</span>
                  </td>
                  <td>
                    {request.password} <br />
                    <span className={styles.oldData}>(Old: {request.employee.password})</span>
                  </td>
                  <td>{request.status}</td>
                  <td>
                    {request.approvalTime ? new Date(request.approvalTime).toLocaleString() : '-'}
                  </td>
                  <td>
                    {request.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleApproval(request.requestId, true)} className={styles.approveButton}>
                          Approve
                        </button>
                        <button onClick={() => handleApproval(request.requestId, false)} className={styles.rejectButton}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span>{request.status}</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => exportToPDF(request)} className={styles.exportButton}>
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerUpdateRequest;
