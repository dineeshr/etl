import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import { autoTable } from 'jspdf-autotable'; // Import autoTable for table styling
import styles from '../css/GrievanceManagement.module.css'; // Importing the CSS module

const GrievanceManager = () => {
  const [tickets, setTickets] = useState([]);
  const empRole = localStorage.getItem('empDesignation'); // Ensure the role is stored in localStorage
  const [empDesignation] = useState(localStorage.getItem('empDesignation'));
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };

  const handleEmployeeManagementClick = () => {
    navigate('/EmployeeManagement');  // Redirect to EmployeeManagement page
    setShowDrawer(false); // Close the drawer when navigating
  };

  // Fetch all tickets for manager
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tickets/');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    if (empRole === 'manager') {
      fetchTickets();
    }
  }, [empRole]);

  // Handle ticket resolution (for managers)
  const handleResolveTicket = async (ticketId) => {
    // Confirmation box
    const isConfirmed = window.confirm('Are you sure you want to mark this ticket as resolved?');
    
    if (isConfirmed) {
      try {
        await axios.put(`http://localhost:8080/api/tickets/resolve/${ticketId}`);
        alert('Ticket resolved');
        // Reload the page to fetch the updated ticket data
        window.location.reload(); // This will refresh the page
      } catch (error) {
        console.error('Error resolving ticket:', error);
      }
    } else {
      console.log('Ticket resolution cancelled');
    }
  };

// Handle ticket rejection
const handleRejectTicket = async (ticketId) => {
  // Confirmation box
  const isConfirmed = window.confirm('Are you sure you want to reject this ticket?');
  
  if (isConfirmed) {
    try {
      await axios.put(`http://localhost:8080/api/tickets/reject/${ticketId}`);
      alert('Ticket rejected');
      // Reload the page to fetch the updated ticket data
      window.location.reload(); // This will refresh the page
    } catch (error) {
      console.error('Error rejecting ticket:', error);
    }
  } else {
    console.log('Ticket rejection cancelled');
  }
};



  // Export individual ticket to PDF
  const exportTicketToPDF = (ticket) => {
    const doc = new jsPDF();
    const headerText = `Ticket Details - ID: ${ticket.ticketId}`;
    doc.text(headerText, 10, 10);
  
    // Include employee details in the PDF data
    const ticketData = [
      ['Ticket ID', ticket.ticketId],
      ['Employee ID', ticket.employee ? ticket.employee.empId : 'N/A'], // Employee ID
      ['Employee Name', ticket.employee ? ticket.employee.empName : 'N/A'], // Employee Name
      ['Issue Description', ticket.issueDescription],
      ['Status', ticket.status],
      ['Date Raised', new Date(ticket.dateRaised).toLocaleString()],
      ['Date Resolved', ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleString() : 'Not Resolved'],
    ];
  
    autoTable(doc, {
      startY: 20, // Start position of the table
      head: [['Field', 'Details']], // Table header
      body: ticketData, // Table content
      theme: 'grid', // Applying grid theme for table
      styles: {
        fontSize: 12,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Custom header color
        textColor: [255, 255, 255], // White text color
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // White background for table rows
        textColor: [0, 0, 0], // Black text color
      },
    });
  
    // Save the PDF
    doc.save(`ticket_${ticket.ticketId}.pdf`);
  };
  

  // Export all tickets to PDF
  const exportAllTicketsToPDF = () => {
    const doc = new jsPDF();
    doc.text('All Tickets', 10, 10);
  
    // Include employee details in the table for each ticket
    const tableData = tickets.map(ticket => [
      ticket.ticketId,
      ticket.employee ? ticket.employee.empId : 'N/A', // Employee ID
      ticket.employee ? ticket.employee.empName : 'N/A', // Employee Name
      ticket.issueDescription,
      ticket.status,
      new Date(ticket.dateRaised).toLocaleString(),
    ]);
  
    autoTable(doc, {
      startY: 20,
      head: [['Ticket ID', 'Employee ID', 'Employee Name', 'Issue Description', 'Status', 'Date Raised']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 12,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
    });
  
    doc.save('all_tickets.pdf');
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grievance Management</h1>
  
      {/* Manager Dashboard */}
      <h3 className={styles.subtitle}>All Tickets</h3>
      <div className="mb-4">
        {/* Use the imported OpenMenuButton component */}
        <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
      </div>
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation={empDesignation}
        handleEmployeeManagementClick={handleEmployeeManagementClick}
      />
  
      {/* Export All Tickets Button */}
      <div className={styles.exportButtonContainer}>
        <button onClick={exportAllTicketsToPDF} className={styles.exportButton}>
          Export All Tickets to PDF
        </button>
      </div>
  
      {/* Tickets Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Employee ID</th> {/* New column for Employee ID */}
            <th>Employee Name</th> {/* New column for Employee Name */}
            <th>Issue Description</th>
            <th>Status</th>
            <th>Date Raised</th>
            <th>Actions</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketId}>
              <td>{ticket.ticketId}</td>
              <td>{ticket.employee ? ticket.employee.empId : 'N/A'}</td> {/* Show Employee ID */}
              <td>{ticket.employee ? ticket.employee.empName : 'N/A'}</td> {/* Show Employee Name */}
              <td>{ticket.issueDescription}</td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.dateRaised).toLocaleString()}</td>

              <td>
  {ticket.status !== 'RESOLVED' && ticket.status !== 'REJECTED' && (
    <>
      <button onClick={() => handleResolveTicket(ticket.ticketId)} className={styles.resolveButton}>
        Resolve Ticket
      </button>
      <button onClick={() => handleRejectTicket(ticket.ticketId)} className={styles.rejectButton}>
        Reject Ticket
      </button>
    </>
  )}
</td>

              <td>
                <button
                  onClick={() => exportTicketToPDF(ticket)}
                  className={styles.exportButton}
                >
                  Export to PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* If no tickets are available */}
      {tickets.length === 0 && <p className={styles.noTicketsMessage}>No tickets available.</p>}
    </div>
  );
  
};

export default GrievanceManager;
