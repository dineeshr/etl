import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import { autoTable } from 'jspdf-autotable'; // Import autoTable for table styling
import Drawer from '../Drawer/Drawer'; // Assuming your Drawer component is in the same directory
import { Button } from 'react-bootstrap';
import styles from '../css/EngineerLeaveRequest.module.css';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker CSS
import DatePicker from 'react-datepicker'; // Correctly import DatePicker from react-datepicker


const EngineerLeaveRequest = () => {
  const [leaveType, setLeaveType] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false); // Drawer visibility state
  const [empDesignation] = useState(localStorage.getItem('empDesignation'));

  const empId = localStorage.getItem('empId'); // Assuming empId is stored in localStorage after login

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle drawer visibility
  };


  // Handle form submission with validation
  const handleSubmit = async () => {
    // Validation for mandatory fields
    if (!leaveType || !leaveStartDate || !leaveEndDate) {
      setMessage('All fields are mandatory.');
      return;
    }
  
    // Validation for leave dates (start date should not be after end date)
    if (new Date(leaveEndDate) < new Date(leaveStartDate)) {
      setMessage('End date cannot be earlier than start date.');
      return;
    }
  
    // Show confirmation dialog
    const confirmSubmission = window.confirm("Are you sure you want to submit the leave request?");
    if (!confirmSubmission) {
      return; // Stop the form submission if the user cancels
    }
  
    try {
      // Prepare the leave request data
      const leaveRequest = {
        leaveType,
        leaveStartDate,
        leaveEndDate,
      };
  
      // Submit the leave request via API
      const response = await axios.post(`http://localhost:8080/api/leave-requests/submit/${empId}`, leaveRequest);
  
      if (response.status === 200) {
        setMessage('Leave request submitted successfully!');
        fetchLeaveRequests(); // Fetch updated leave requests after submission
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setMessage('Error submitting leave request');
    }
  };
  

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/leave-requests/history/${empId}`);
      setLeaveRequests(response.data); // Store leave requests in state
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleExportClick = (leaveRequest) => {
    const doc = new jsPDF();
    const headerText = `Leave Request Details for ${leaveRequest.leaveType}`;
    doc.text(headerText, 10, 10);
  
    // Table data
    const tableData = [
      ['Leave Type', leaveRequest.leaveType],
      ['Start Date', leaveRequest.leaveStartDate],
      ['End Date', leaveRequest.leaveEndDate],
      ['Status', leaveRequest.status],
      ['Request Time', leaveRequest.requestTime],
      ['Employee ID', leaveRequest.employee.empId],  // Employee ID
      ['Employee Name', leaveRequest.employee.empName],  // Employee Name
    ];
  
    // Add conditional fields based on leave request status
    if (leaveRequest.status === 'Approved') {
      tableData.push(['Approved By', leaveRequest.approvedBy]);
      tableData.push(['Approval Time', leaveRequest.approvalTime]);
    } else if (leaveRequest.status === 'Rejected') {
      tableData.push(['Rejected By', leaveRequest.approvedBy]);
      tableData.push(['Rejected Time', leaveRequest.approvalTime]);
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
  

  // New function to export all leave requests to PDF
  const handleExportAllClick = () => {
    const doc = new jsPDF('landscape'); // Use landscape orientation for all data
  
    // Add header text
    const headerText = 'Leave Request History';
    doc.text(headerText, 10, 10);
  
    // Table data for all leave requests
    const tableData = leaveRequests.map((request) => [
      request.leaveType,
      request.leaveStartDate,
      request.leaveEndDate,
      request.status,
      request.requestTime,
      request.employee.empId,  // Employee ID
      request.employee.empName,  // Employee Name
    ]);
  
    // Add conditional columns based on leave status
    tableData.forEach((request, index) => {
      if (leaveRequests[index].status === 'Approved') {
        request.push(leaveRequests[index].approvedBy);
        request.push(leaveRequests[index].approvalTime);
      } else if (leaveRequests[index].status === 'Rejected') {
        request.push(leaveRequests[index].approvedBy);
        request.push(leaveRequests[index].approvalTime);
      } else {
        request.push('-');
        request.push('-');
      }
    });
  
    // Use autoTable to generate the table in the PDF
    autoTable(doc, {
      startY: 20, // Start position of table
      head: [
        ['Leave Type', 'Start Date', 'End Date', 'Status', 'Request Time', 'Employee ID', 'Employee Name', 'Approved By', 'Approval Time']
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
  

  useEffect(() => {
    fetchLeaveRequests(); // Fetch leave requests when component is mounted
  }, []);

  return (
    <div className={styles.container}>
      <div className="mb-4">
        {/* Use the imported OpenMenuButton component */}
        <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
      </div>
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation={empDesignation}
      />
  
      <h2 className={styles.heading}>Submit Leave Request</h2>
  
      <form className={styles.form}>
        <div className={styles.formDiv}>
          <label className={styles.formLabel}>Leave Type:</label>
          <input
            className={styles.formInput}
            type="text"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            placeholder="e.g. Sick Leave"
          />
        </div>
  
        <div className={styles.formDiv}>
          <label className={styles.formLabel}>Leave Start Date:</label>
          <DatePicker
            selected={leaveStartDate}
            onChange={(date) => setLeaveStartDate(date)}
            minDate={new Date()} // Restrict to today or future dates
            dateFormat="dd-MM-yyyy"
            placeholderText="Select Start Date"
            showPopperArrow={false}
            isClearable={false}
            closeOnScroll={true}
            filterDate={(date) => date >= new Date()} // Ensures no past date can be selected
          />
        </div>
  
        <div className={styles.formDiv}>
          <label className={styles.formLabel}>Leave End Date:</label>
          <DatePicker
            selected={leaveEndDate}
            onChange={(date) => setLeaveEndDate(date)}
            minDate={leaveStartDate ? leaveStartDate : new Date()} // Ensures end date can't be before start date
            dateFormat="dd-MM-yyyy"
            placeholderText="Select End Date"
            showPopperArrow={false}
            isClearable={false}
            closeOnScroll={true}
            filterDate={(date) => date >= leaveStartDate} // End date must be the same or later than the start date
          />
        </div>
  
        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit} // Attach the handleSubmit function here
        >
          Submit Request
        </button>
      </form>
  
      {message && (
        <p
          className={message.includes('successfully')
            ? styles.messageSuccess
            : styles.messageError}
        >
          {message}
        </p>
      )}
  
      {/* Export All button */}
      <div className="mb-4">
        <Button onClick={handleExportAllClick} className={styles.button}>
          Export All Requests to PDF
        </Button>
      </div>
  
      <h3 className={styles.subheading}>Your Leave Requests</h3>
  
      {leaveRequests.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableTh}>Leave Type</th>
              <th className={styles.tableTh}>Start Date</th>
              <th className={styles.tableTh}>End Date</th>
              <th className={styles.tableTh}>Status</th>
              <th className={styles.tableTh}>Approval Time</th>
              <th className={styles.tableTh}>Approved By</th>
              <th className={styles.tableTh}>Employee ID</th>
              <th className={styles.tableTh}>Employee Name</th>
              <th className={styles.tableTh}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.requestId} className={styles.tableTr}>
                <td className={styles.tableTd}>{request.leaveType}</td>
                <td className={styles.tableTd}>{request.leaveStartDate}</td>
                <td className={styles.tableTd}>{request.leaveEndDate}</td>
                <td className={styles.tableTd}>{request.status}</td>
                <td className={styles.tableTd}>
                  {request.approvalTime ? new Date(request.approvalTime).toLocaleString() : 'Not Approved'}
                </td>
                <td className={styles.tableTd}>{request.approvedBy ? request.approvedBy : 'N/A'}</td>
                <td className={styles.tableTd}>{request.employee.empId}</td>
                <td className={styles.tableTd}>{request.employee.empName}</td>
                <td className={styles.tableTd}>
                  <button
                    className={styles.exportButton}
                    onClick={() => handleExportClick(request)}
                  >
                    Export to PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noRequestMessage}>No leave requests found.</p>
      )}
    </div>
  );
  
  
};

export default EngineerLeaveRequest;
