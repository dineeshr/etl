import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';  // Import jsPDF and autotable
import styles from '../css/GrievanceRaising.module.css'; // Import the CSS Module

const GrievanceEngineer = () => {
  const [tickets, setTickets] = useState([]); // Store tickets
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [ticketDescription, setTicketDescription] = useState(''); // For ticket description
  const [ticketStatus] = useState('OPEN'); // Default ticket status
  const [ticketSuccess, setTicketSuccess] = useState(null); // Track success message for ticket submission
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility
  const [empDesignation] = useState(localStorage.getItem('empDesignation'));
  const empId = localStorage.getItem('empId'); // Retrieve empId from localStorage
  console.log('empId from localStorage:', empId); // Check if empId is retrieved

  // Fetch tickets for the engineer when component mounts or empId changes
  useEffect(() => {
    const fetchTickets = async () => {
      if (!empId) {
        console.log('empId is missing');
        setError('Employee ID is missing.');
        setLoading(false);
        return; // If empId is missing, don't proceed with fetching
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/tickets/employee/${empId}`);
        console.log('Tickets:', response.data); // Log the tickets response
        if (response.status === 200) {
          setTickets(response.data); // Set tickets data
        } else {
          setError('Failed to fetch tickets. Please try again.');
        }
      } catch (error) {
        setError('Failed to fetch tickets.');
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchTickets();
  }, [empId]); // Fetch tickets every time empId changes (or initially on component mount)

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };


  // Handle raising a new ticket
  const handleRaiseTicket = async (e) => {
    e.preventDefault();

    // Confirmation dialog before raising the ticket
    const isConfirmed = window.confirm('Are you sure you want to raise this ticket?');
    
    if (!isConfirmed) {
      console.log('Ticket raising canceled');
      return; // If the user cancels, stop the process
    }

    // Ensure ticket description is not empty
    if (!ticketDescription.trim()) {
      setTicketSuccess('Please provide a valid description');
      return;
    }
    const newTicket = {
      issueDescription: ticketDescription,
      status: ticketStatus,
      dateRaised: new Date(),
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/tickets/raise/${empId}`, newTicket);
      if (response.status === 200) {
        setTicketSuccess('Ticket raised successfully!');
        setTicketDescription('');  // Reset the form
        setTickets((prevTickets) => [...prevTickets, response.data]); // Add the new ticket to the list
      } else {
        setTicketSuccess('Failed to raise ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error raising ticket:', error);
      setTicketSuccess('Failed to raise ticket.');
    }
  };

  // Function to export specific row data to PDF
  const exportTicketToPDF = (ticket) => {
    const doc = new jsPDF();
    
    // Title of the PDF
    doc.text('Ticket Information', 20, 10);
    
    // Prepare the data to be displayed in the table
    const data = [
      { key: 'Ticket ID', value: ticket.ticketId },
      { key: 'Employee ID', value: ticket.employee ? ticket.employee.empId : 'N/A' }, // Add empId
      { key: 'Employee Name', value: ticket.employee ? ticket.employee.empName : 'N/A' }, // Add empName
      { key: 'Issue Description', value: ticket.issueDescription },
      { key: 'Status', value: ticket.status },
      { key: 'Date Raised', value: new Date(ticket.dateRaised).toLocaleString() },
      { key: 'Date Resolved', value: ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleString() : 'Not Resolved' }
    ];
  
    // Prepare the table data for autoTable
    const tableData = data.map(row => [row.key, row.value]);
  
    // Use autoTable to add a styled table to the PDF
    autoTable(doc, {
      startY: 20,  // Start Y position for the table
      head: [['Field', 'Details']], // Table header
      body: tableData, // Table data
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
  
    // Save the PDF with the ticket ID as the filename
    doc.save(`Ticket_${ticket.ticketId}.pdf`);
  };
  
  // Function to export all tickets data to PDF in table format
// Function to export all tickets data to PDF in table format
const exportAllTicketsToPDF = () => {
  const doc = new jsPDF();
  doc.text('Tickets Information', 20, 10);

  const columns = ['Ticket ID', 'Employee ID', 'Employee Name', 'Issue Description', 'Status', 'Date Raised', 'Date Resolved'];
  
  // Include employee data (empId and empName) for each ticket
  const rows = tickets.map(ticket => [
    ticket.ticketId,
    ticket.employee ? ticket.employee.empId : 'N/A', // Add empId
    ticket.employee ? ticket.employee.empName : 'N/A', // Add empName
    ticket.issueDescription,
    ticket.status,
    new Date(ticket.dateRaised).toLocaleString(),
    ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleString() : 'Not Resolved'
  ]);

  // Use autoTable to generate the table
  autoTable(doc, { head: [columns], body: rows });

  // Save the PDF with a generic name
  doc.save('All_Tickets.pdf');
};


  return (
    <div className={styles.container}>
      <h1>Grievance Raising</h1>
      
      {/* Ticket Raising Form */}
      <div>
        <h3>Raise a New Ticket</h3>
        <div className="mb-4">
          {/* Use the imported OpenMenuButton component */}
          <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
        </div>
        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation={empDesignation}
        />
        <form onSubmit={handleRaiseTicket}>
          <textarea
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
            placeholder="Describe your issue"
            required
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit">Raise Ticket</button>
        </form>
  
        {/* Show success or failure message for raising ticket */}
        {ticketSuccess && <p className={styles.ticketSuccessMessage}>{ticketSuccess}</p>}
      </div>
  
      {/* Global Export Button */}
      <div>
        <button onClick={exportAllTicketsToPDF} className={styles.exportButton}>Export All Tickets</button>
      </div>
  
      {/* Loading State */}
      {loading && <p className={styles.loadingMessage}>Loading your tickets...</p>}
  
      {/* Error State */}
      {error && <p className={styles.errorMessage}>{error}</p>}
  
      {/* Render tickets in table format if available */}
      {!loading && !error && tickets.length > 0 && (
        <div>
          <h3>Your Raised Tickets</h3>
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Employee ID</th> {/* New column for Employee ID */}
                <th>Employee Name</th> {/* New column for Employee Name */}
                <th>Issue Description</th>
                <th>Status</th>
                <th>Date Raised</th>
                <th>Date Resolved</th>
                <th>Actions</th> {/* Add Actions Column */}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>{ticket.ticketId}</td>
                  <td>{ticket.employee ? ticket.employee.empId : 'N/A'}</td> {/* Show empId */}
                  <td>{ticket.employee ? ticket.employee.empName : 'N/A'}</td> {/* Show empName */}
                  <td>{ticket.issueDescription}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.dateRaised ? new Date(ticket.dateRaised).toLocaleString() : 'N/A'}</td>
                  <td>{ticket.dateResolved ? new Date(ticket.dateResolved).toLocaleString() : 'Not Resolved'}</td>
                  <td>
                    <button onClick={() => exportTicketToPDF(ticket)} className={styles.exportRowButton}>Export</button>
                  </td> {/* Export button for each row */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* If no tickets are found */}
      {!loading && !error && tickets.length === 0 && (
        <p className={styles.noTicketsMessage}>No tickets raised yet.</p>
      )}
    </div>
  );
  
};

export default GrievanceEngineer;
