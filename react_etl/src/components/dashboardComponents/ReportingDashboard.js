import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Modal, Button } from 'react-bootstrap';

// Importing the new OpenMenuButton and Drawer components
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ReportingDashboard() {
  const [env, setEnv] = useState('');
  const [application, setApplication] = useState('');
  const [initState, setInitState] = useState('');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showPieChart, setShowPieChart] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility
  const navigate = useNavigate();
  const [empDesignation, setEmpDesignation] = useState(localStorage.getItem('empDesignation'));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:8080/reports');
      setReports(response.data);
      setFilteredReports(response.data); // Initially set filtered reports to all reports
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/reports/filter', {
        params: {
          env: env,
          application: application,
          initState: initState,
        },
      });
      setFilteredReports(response.data); // Set filtered data to state
    } catch (error) {
      console.error('Error fetching filtered reports:', error);
    }
  };

  const handleReset = () => {
    setEnv('');
    setApplication('');
    setInitState('');
    setFilteredReports(reports); // Reset the filtered reports to all reports when the filter is cleared
  };

  const handlePieChartClose = () => {
    setShowPieChart(false);  // Close the Pie Chart Modal
  };

  const handlePieChartShow = () => {
    setShowPieChart(true);   // Show the Pie Chart Modal
  };

  // Function to get Pie Chart Data
  const getPieChartData = (data) => {
    const successCount = data.filter((report) => report.initState === 'SUCCESS').length;
    const failureCount = data.filter((report) => report.initState === 'FAILED').length;

    return {
      labels: ['SUCCESS', 'FAILED'],
      datasets: [
        {
          data: [successCount, failureCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  };

  const handleLogout = () => {
    // Clear authentication status from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('empDesignation');
    // Redirect to login page after logout
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');  // Redirect to settings page
    setShowDrawer(false); // Close the drawer when navigating
  };

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };

  // Handle row click for a failed report
  const handleRowClick = (report) => {
    if (report.initState === 'FAILED') {
      // If the report's state is 'FAILED', navigate to a retry page or take some action
      navigate(`/retry/${report.reportId}`); // Redirect to a retry page with the reportId
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Reporting Dashboard</h1>

      {/* Use the imported OpenMenuButton component */}
      <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />

      {/* Use the Drawer component */}
      <Drawer
        showDrawer={showDrawer}
        handleDrawerToggle={handleDrawerToggle}
        empDesignation={empDesignation}
        handleSettingsClick={handleSettingsClick}
        handleLogout={handleLogout}
      />

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row mb-3">
          <div className="col-md-3 mb-3">
            <label htmlFor="env" className="form-label">Environment</label>
            <select
              id="env"
              name="env"
              className="form-control"
              value={env}
              onChange={(e) => setEnv(e.target.value)}
            >
              <option value="">Select Environment</option>
              <option value="EU">EU</option>
              <option value="US1">US1</option>
              <option value="US2">US2</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="application" className="form-label">Application</label>
            <select
              id="application"
              name="application"
              className="form-control"
              value={application}
              onChange={(e) => setApplication(e.target.value)}
            >
              <option value="">Select Application</option>
              <option value="CREDIT">CREDIT</option>
              <option value="EQUITY">EQUITY</option>
              <option value="MONITORING">MONITORING</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="initState" className="form-label">Status</label>
            <select
              id="initState"
              name="initState"
              className="form-control"
              value={initState}
              onChange={(e) => setInitState(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="row">
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">Filter</button>
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-secondary w-100 ms-2" onClick={handleReset}>
              Reset
            </button>
          </div>
          <div className="col-md-3">
            <Button variant="info" className="w-100" onClick={handlePieChartShow}>
              Show Pie Chart
            </Button>
          </div>
        </div>
      </form>

      {/* Pie Chart Modal */}
      <Modal show={showPieChart} onHide={handlePieChartClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Success/Failure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Pie data={getPieChartData(filteredReports)} />
        </Modal.Body>
      </Modal>

      {/* Report Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Application</th>
              <th>Environment</th>
              <th>Date and Time</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Prev Date</th>
              {empDesignation === 'engineer' && initState==='FAILED'&&<th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.reportId}
                style={{ cursor: report.initState === 'FAILED' ? 'pointer' : 'default' }}
                onClick={() => handleRowClick(report)}
              >
                <td>{report.id}</td>
                <td>{report.application}</td>
                <td>{report.env}</td>
                <td>{report.dateTime}</td>
                <td>{report.initState}</td>
                <td>{report.createdDt}</td>
                <td>{report.prev}</td>
                {report.initState === 'FAILED' && empDesignation === 'engineer' && (
                  <td> {/* This can be empty or you can customize further actions */}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportingDashboard;
