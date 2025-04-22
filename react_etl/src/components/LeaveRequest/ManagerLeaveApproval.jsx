import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import { jsPDF } from 'jspdf'; // Import jsPDF
import { autoTable } from 'jspdf-autotable'; // Import autoTable for table styling
import styles from '../css/ManagerLeaveApproval.module.css';
import OpenMenuButton from '../MenuButton/OpenMenuButton';

const ManagerLeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [showDrawer, setShowDrawer] = useState(false); // Drawer visibility state
  const [empDesignation] = useState(localStorage.getItem('empDesignation'));

  // Fetch all leave requests when the component mounts or the page reloads
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/leave-requests/all');
        setLeaveRequests(response.data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
        setMessage('Error fetching leave requests');
      }
    };

    fetchLeaveRequests();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle drawer visibility
  };


  const handleApproval = async (requestId, approved) => {
    const action = approved ? 'approve' : 'reject';
    const message = `Are you sure you want to ${action} this leave request?`;
  
    // Show confirmation dialog
    const isConfirmed = window.confirm(message);
  
    if (isConfirmed) {
      try {
        const managerId = localStorage.getItem('empId'); // Assume manager's empId is stored in localStorage
        const response = await axios.put(
          `http://localhost:8080/api/leave-requests/approve-reject/${requestId}/${managerId}`,
          null,
          { params: { approved } }
        );
  
        if (response.status === 200) {
          // Update the status of the request in the state without removing it from the list
          setLeaveRequests((prevRequests) =>
            prevRequests.map((request) =>
              request.requestId === requestId
                ? { ...request, status: approved ? 'Approved' : 'Rejected' }
                : request
            )
          );
          setMessage(approved ? 'Leave request approved' : 'Leave request rejected');
        }
      } catch (error) {
        console.error('Error handling leave request approval:', error);
        setMessage('Error handling approval/rejection');
      }
    }
  };
  

  // Export row data to PDF
  const handleExportClick = (leaveRequest) => {
    const doc = new jsPDF();
    const headerText = `Leave Request Details for ${leaveRequest.leaveType}`;
    doc.text(headerText, 10, 10);
  
    // Table data
    const tableData = [
      ['Leave Type', leaveRequest.leaveType],
      ['Start Date', new Date(leaveRequest.leaveStartDate).toLocaleDateString()],
      ['End Date', new Date(leaveRequest.leaveEndDate).toLocaleDateString()],
      ['Status', leaveRequest.status],
      ['Request Time', new Date(leaveRequest.requestTime).toLocaleString()],
      ['Employee ID', leaveRequest.employee.empId],
      ['Employee Name', leaveRequest.employee.empName],
    ];
  
    // Add conditional fields based on leave request status
    if (leaveRequest.status === 'Approved') {
      tableData.push(['Approved By', leaveRequest.approvedBy]);
      tableData.push(['Approval Time', new Date(leaveRequest.approvalTime).toLocaleString()]);
    } else if (leaveRequest.status === 'Rejected') {
      tableData.push(['Rejected By', leaveRequest.approvedBy]);
      tableData.push(['Rejected Time', new Date(leaveRequest.approvalTime).toLocaleString()]);
    }
  
    // Use autoTable to generate the table in the PDF
    autoTable(doc, {
      startY: 20, // Start position of table
      head: [['Field', 'Details']], // Table header
      body: tableData, // Table content
      theme: 'grid', // Applying grid theme for table
      styles: {
        fontSize: 12,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [255, 255, 255], // Header text color
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body background color
        textColor: [0, 0, 0], // Body text color
      },
    });
  
    // Save the PDF with the name of the leave request
    doc.save(`leave_request.pdf`);
  };
  

 
  const handleOverallExportClick = () => {
    const doc = new jsPDF('landscape'); // Use landscape orientation for all data
  
    // Add header text
    const headerText = 'Leave Request History';
    doc.text(headerText, 10, 10);
  
    // Table data for all leave requests
    const tableData = leaveRequests.map((request) => [
      request.requestId,
      request.employee.empId,
      request.employee.empName,
      request.leaveType,
      new Date(request.leaveStartDate).toLocaleDateString(),
      new Date(request.leaveEndDate).toLocaleDateString(),
      request.status,
      new Date(request.requestTime).toLocaleString(),
    ]);
  
    // Add conditional columns based on leave status
    tableData.forEach((request, index) => {
      if (leaveRequests[index].status === 'Approved') {
        request.push(leaveRequests[index].approvedBy);
        request.push(new Date(leaveRequests[index].approvalTime).toLocaleString());
      } else if (leaveRequests[index].status === 'Rejected') {
        request.push(leaveRequests[index].approvedBy);
        request.push(new Date(leaveRequests[index].approvalTime).toLocaleString());
      } else {
        request.push('-');
        request.push('-');
      }
    });
  
    // Use autoTable to generate the table in the PDF
    autoTable(doc, {
      startY: 20, // Start position of table
      head: [
        [
          'Request ID', 'Employee ID', 'Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Request Time', 'Approved By', 'Approval Time'
        ]
      ], // Table header
      body: tableData, // Table content
      theme: 'grid', // Applying grid theme for table
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [255, 255, 255], // Header text color
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Body background color
        textColor: [0, 0, 0], // Body text color
      },
    });
  
    // Save the PDF with the name "leave_request_history.pdf"
    doc.save('leave_request_history.pdf');
  };
  

return (
  <div className={styles.container}>
    {/* Drawer toggle button */}
    <div className="mb-4">
      {/* Use the imported OpenMenuButton component */}
      <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
    </div>
    <Drawer
      showDrawer={showDrawer}
      handleDrawerToggle={handleDrawerToggle}
      empDesignation={empDesignation}
    />

    <h2>All Leave Requests</h2>
    {message && <p className={styles.message}>{message}</p>}

    {leaveRequests.length === 0 ? (
      <p className={styles.message}>No leave requests available</p>
    ) : (
      <>
        {/* Overall Export Button */}
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleOverallExportClick}
            className={styles.exportButton}
          >
            Export All Leave Requests
          </Button>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <Table bordered responsive className={styles.table}>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Leave Start Date</th>
                <th>Leave End Date</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestId}</td>
                  <td>{request.employee.empId}</td>
                  <td>{request.employee.empName}</td>
                  <td>{request.leaveType}</td>
                  <td>{new Date(request.leaveStartDate).toLocaleDateString()}</td>
                  <td>{new Date(request.leaveEndDate).toLocaleDateString()}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === 'Pending' ? (
                      <div className={styles.actionButtonContainer}>
                        <Button
                          onClick={() => handleApproval(request.requestId, true)}
                          className={styles.approveButton}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApproval(request.requestId, false)}
                          className={styles.rejectButton}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span>{request.status}</span>
                    )}
                  </td>
                  {/* Add Export Button in each row */}
                  <td>
                    <Button
                      onClick={() => handleExportClick(request)}
                      className={styles.exportButton}
                    >
                      Export
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    )}
  </div>
);

};

export default ManagerLeaveApproval;
