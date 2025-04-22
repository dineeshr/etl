import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Modal, Button } from 'react-bootstrap';
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import styles from '../css/Dashboard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function ReportingDashboard() {
  const [env, setEnv] = useState('');
  const [application, setApplication] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showPieChart, setShowPieChart] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [empDesignation] = useState(localStorage.getItem('empDesignation'));


  useEffect(() => {
    // Prevent back navigation by pushing a new state
    window.history.pushState(null, '', window.location.href);
  
    // Handle back button event
    const handleBackButton = (event) => {
      event.preventDefault();  // Prevent going back
    };
  
    // Add event listener to monitor the back button (popstate)
    window.addEventListener('popstate', handleBackButton);
  
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);
  


  useEffect(() => {
    const handleStorageChange = (event) => {
        if (event.key === "refreshReports") {
            console.log("Report list should be refreshed!");
            fetchReports();
        }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:8080/reports/dashboard');
      const sortedReports = response.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      setReports(sortedReports);
      setFilteredReports(sortedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/reports/dashboard/filter', {
        params: {
          env: env,
          application: application,
          currentState: currentState,
        },
      });
      const sortedFilteredReports = response.data.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      setFilteredReports(sortedFilteredReports);
    } catch (error) {
      console.error('Error fetching filtered reports:', error);
    }
  };

  const handleReset = () => {
    setEnv('');
    setApplication('');
    setCurrentState('');
    setFilteredReports(reports);
  };

  const handlePieChartClose = () => {
    setShowPieChart(false);
  };

  const handlePieChartShow = () => {
    setShowPieChart(true);
  };

  const getPieChartData = (data) => {
    const successCount = data.filter((report) => report.currentState === 'SUCCESS').length;
    const failureCount = data.filter((report) => report.currentState === 'FAILED').length;

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




  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer);
  };

  const handleRowClick = (report) => {
    if (empDesignation === 'engineer' && report.initState === 'FAILED' && report.currentState === 'FAILED') {
      report.isViewOnly = false;
      localStorage.setItem("selectedRow", JSON.stringify(report));
      window.open("../../public/detail.html", "_blank");
    }
    if ((empDesignation === 'engineer' || empDesignation === 'manager') && report.currentState === 'SUCCESS' && report.initState === 'FAILED') {
      report.isViewOnly = true;
      localStorage.setItem("selectedRow", JSON.stringify(report));
      window.open("../../public/detail.html", "_blank");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Reporting Dashboard</h1>
  
        <div className="mb-4">
          <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
        </div>
        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation={empDesignation}
        />
  
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Form Fields */}
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label htmlFor="env" className={styles.label}>Environment</label>
              <select
                id="env"
                name="env"
                className={styles.dropdown}
                value={env}
                onChange={(e) => setEnv(e.target.value)}
              >
                <option value="">Select Environment</option>
                <option value="EU">EU</option>
                <option value="US1">US1</option>
                <option value="US2">US2</option>
              </select>
            </div>
  
            <div className={styles.formField}>
              <label htmlFor="application" className={styles.label}>Application</label>
              <select
                id="application"
                name="application"
                className={styles.dropdown}
                value={application}
                onChange={(e) => setApplication(e.target.value)}
              >
                <option value="">Select Application</option>
                <option value="CREDIT">CREDIT</option>
                <option value="EQUITY">EQUITY</option>
                <option value="MONITORING">MONITORING</option>
              </select>
            </div>
  
            <div className={styles.formField}>
              <label htmlFor="currentState" className={styles.label}>Status</label>
              <select
                id="currentState"
                name="currentState"
                className={styles.dropdown}
                value={currentState}
                onChange={(e) => setCurrentState(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>
  
          <div className={styles.buttonRow}>
            <div className={styles.formField}>
              <button type="submit" className={`${styles.button} ${styles.filterBtn}`}>
                Filter
              </button>
            </div>
            <div className={styles.formField}>
              <button type="button" className={`${styles.button} ${styles.resetBtn}`} onClick={handleReset}>
                Reset
              </button>
            </div>
            <div className={styles.formField}>
              <Button
                className={styles.pieChartBtn}
                onClick={handlePieChartShow}
              >
                Show Pie Chart
              </Button>
            </div>
          </div>
        </form>
  
        <Modal show={showPieChart} onHide={handlePieChartClose}>
          <Modal.Header closeButton>
            <Modal.Title>Report Success/Failure</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Pie data={getPieChartData(filteredReports)} />
          </Modal.Body>
        </Modal>
  
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.tableHeaderCell}>Id</th>
                <th className={styles.tableHeaderCell}>Application</th>
                <th className={styles.tableHeaderCell}>Environment</th>
                <th className={styles.tableHeaderCell}>Date and Time</th>
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Created Date</th>
                <th className={styles.tableHeaderCell}>Prev Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr
                  key={report.reportId || index}  // Use reportId if unique, else fallback to index
                  className={`${styles.tableRow} ${empDesignation === 'engineer' && report.currentState === 'FAILED' ? styles.tableRowFailed : ''} 
    ${(empDesignation === 'engineer' || empDesignation === 'manager') && report.currentState === 'SUCCESS' && report.initState === 'FAILED' ? styles.tableRowPassed : ''}`}
                              onClick={() =>handleRowClick(report)} // Allow both engineer and manager to trigger row click
                              >
                  <td className={styles.tableCell}>{report.id}</td>
                  <td className={styles.tableCell}>{report.application}</td>
                  <td className={styles.tableCell}>{report.env}</td>
                  <td className={styles.tableCell}>{report.dateTime}</td>
                  <td className={styles.tableCell}>{report.currentState}</td>
                  <td className={styles.tableCell}>{report.createdDt}</td>
                  <td className={styles.tableCell}>{report.prev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  
}

export default ReportingDashboard;
