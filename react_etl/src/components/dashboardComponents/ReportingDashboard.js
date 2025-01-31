import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Button, Modal } from 'react-bootstrap';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ReportingDashboard() {
  const [env, setEnv] = useState('');
  const [application, setApplication] = useState('');
  const [initState, setinitState] = useState('');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showPieChart, setShowPieChart] = useState(false);
  const navigate = useNavigate();

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
    setinitState('');
    setFilteredReports(reports); // Reset the filtered reports to all reports when the filter is cleared
  };

  const handleChangeEmail = () => {
    navigate('/assign-email');
  };

  const handlePieChartClose = () => {
    setShowPieChart(false);  // Close the Pie Chart Modal
  };

  const handlePieChartShow = () => {
    setShowPieChart(true);   // Show the Pie Chart Modal
  };

  // Get the pie chart data for the selected filtered reports
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Reporting Dashboard</h1>

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
              onChange={(e) => setinitState(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mb-3">
            <button type="submit" className="btn btn-primary btn-block w-100 py-2">
              Filter
            </button>
          </div>
          <div className="col-md-3 mb-3">
            <button type="button" className="btn btn-secondary btn-block w-100 py-2" onClick={handleReset}>
              Clear
            </button>
          </div>
          <div className="col-md-3 mb-3">
            <button
              type="button"
              className="btn btn-warning btn-block w-100 py-2"
              onClick={handleChangeEmail}
            >
              Change Receiver's Mail
            </button>
          </div>
        </div>
      </form>

      {/* Show Pie Chart Button on the next line */}
      <div className="row">
        <div className="col-md-3 mb-3">
          <button
            type="button"
            className="btn btn-info btn-block w-100 py-2"
            onClick={handlePieChartShow}
          >
            Show Pie Chart
          </button>
        </div>
      </div>

      {/* Display Filtered Data */}
      <h2 className="mb-4">Filtered Results:</h2>
      <div className="table-responsive" style={{ overflowX: 'auto', width: '100%' }}>
        <table className="table table-striped table-bordered w-100">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Application</th>
              <th>Environment</th>
              <th>Date and Time</th>
              <th>Initial Status</th>
              <th>Created Date</th>
              <th>Prev Date</th>
              <th>Email Sent Status</th>
              <th>Current State</th>
              <th>Handled By</th>
              <th>Reason</th>
              <th>Fix Method</th>
              <th>Solved Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.application}</td>
                <td>{report.env}</td>
                <td>{report.dateTime}</td>
                <td>{report.initState}</td>
                <td>{report.createdDt}</td>
                <td>{report.prev}</td>
                <td>{report.emailSent}</td>
                <td>{report.currentState}</td>
                <td>{report.handleBy}</td>
                <td>{report.failReason}</td>
                <td>{report.fixMethod}</td>
                <td>{report.solvedDt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie Chart Modal */}
      <Modal show={showPieChart} onHide={handlePieChartClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pie Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Pie data={getPieChartData(filteredReports)} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ReportingDashboard;
