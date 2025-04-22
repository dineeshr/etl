import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";
import OpenMenuButton from '../MenuButton/OpenMenuButton';
import Drawer from '../Drawer/Drawer';
import html2canvas from "html2canvas"; // Import html2canvas
import styles from '../css/EmployeeLoginLogoutLogDisplay.module.css';// Import the GlobalCSS file
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js';
import autoTable from 'jspdf-autotable';

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);


const EmployeeLoginLogoutLogDisplay = () => {
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [empUsername, setEmpUsername] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [attendance, setAttendance] = useState("");
  const [totalDurations, setTotalDurations] = useState([]);
  const [absentDurations, setAbsentDurations] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false); // State to toggle drawer visibility
    const [empDesignation] = useState(localStorage.getItem('empDesignation'));

  const chartRefPresent = useRef(null);
  const chartRefAbsent = useRef(null);

  const handleDrawerToggle = () => {
    setShowDrawer(!showDrawer); // Toggle the drawer visibility
  };



  // Fetch employee usernames when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/login-logs/employees_username")
      .then((response) => {
        console.log("Employees fetched:", response.data);
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching employees:", error);
      });

    // Fetch all logs when the page loads (first time)
    axios
      .get("http://localhost:8080/api/login-logs/all")
      .then((response) => {
        console.log("Fetched all logs:", response.data);
        setLogs(response.data);
        calculateTotalDurations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
      });
  }, []);

  const convertToHours = (duration, unit) => {
    switch (unit) {
      case "seconds":
        return duration / 3600;
      case "minutes":
        return duration / 60;
      case "hours":
        return duration;
      case "days":
        return duration * 24;
      default:
        return 0;
    }
  };

  const calculateTotalDurations = (logs) => {
    const durations = {};
    const absentEmployees = [];

    logs.forEach((log) => {
      const employee = log.empUsername;
      const attendanceStatus = log.empAttendance;

      // Check for "ABSENT" attendance status and add to the absentEmployees array
      if (attendanceStatus === "ABSENT") {
        absentEmployees.push(employee);
      }

      // For present employees, calculate their work durations
      if (attendanceStatus === "PRESENT" && log.duration && log.durationType) {
        const duration = parseFloat(log.duration);
        const unit = log.durationType.toLowerCase();
        const durationInHours = convertToHours(duration, unit);

        if (durations[employee]) {
          durations[employee] += durationInHours;
        } else {
          durations[employee] = durationInHours;
        }
      }
    });

    // Format durations for the present employees
    const formattedDurations = Object.entries(durations).map(([employee, duration]) => ({
      employee,
      duration: duration.toFixed(2),
    }));

    setTotalDurations(formattedDurations);
    setAbsentDurations(absentEmployees);
  };

  const fetchLogs = () => {
    const params = {
      empUsername: empUsername || undefined,
      empAttendance: attendance || undefined,
    };

    if (fromDate) {
      const formattedFromDate = new Date(fromDate);
      formattedFromDate.setHours(0, 0, 0, 0);
      params.fromDate = formattedFromDate.toISOString().split(".")[0];
    }

    if (toDate) {
      const formattedToDate = new Date(toDate);
      formattedToDate.setHours(23, 59, 59, 999);
      params.toDate = formattedToDate.toISOString().split(".")[0];
    }

    console.log("Fetching logs with params:", params);

    axios
      .get("http://localhost:8080/api/login-logs/filter", { params })
      .then((response) => {
        console.log("Response from API:", response.data);
        if (response.data && response.data.length > 0) {
          setLogs(response.data);
          calculateTotalDurations(response.data);
        } else {
          console.log("No logs found for the given filters.");
          setLogs([]);
          setTotalDurations([]);
          setAbsentDurations([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
        if (error.response) {
          console.error("Error Response:", error.response);
          alert(`Error: ${error.response.data.message || "An error occurred"}`);
        } else {
          alert("An error occurred while fetching the logs. Please try again.");
        }
      });
  };

  const resetFilters = () => {
    setEmpUsername("");
    setFromDate(null);
    setToDate(null);
    setAttendance("");

    axios
      .get("http://localhost:8080/api/login-logs/all")
      .then((response) => {
        console.log("Fetched all logs after reset:", response.data);
        setLogs(response.data);
        calculateTotalDurations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
      });
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Login Logout Logs", 20, 20);
  
    const headers = ["Username", "Login Time", "Logout Time", "Attendance", "Duration", "Timestamp"];
    const columnWidths = [40, 40, 40, 40, 40, 50];
  
    // Prepare data for the table
    const logsToExport = logs.length > 0 ? logs : [];
  
    // Use autoTable for table creation with styles
    autoTable(doc, {
      startY: 40, // Start position for the table (below the header)
      head: [headers], // Table headers
      body: logsToExport.map(log => [
        log.empUsername,
        log.loginTimestamp ? new Date(log.loginTimestamp).toLocaleString() : "N/A",
        log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString() : "N/A",
        log.empAttendance,
        log.duration ? `${log.duration} ${log.durationType}` : "N/A",
        log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
      ]),
      theme: 'grid', // Adds gridlines to the table
      headStyles: { fillColor: '#06402B', textColor: '#FFFFFF' },
      bodyStyles: { fillColor: '#f1f1f1', textColor: '#000000' },
      alternateRowStyles: { fillColor: '#ffffff' },
      margin: { top: 30 },
    });
  
    // Add page break and capture the present chart as an image
    doc.addPage();
    if (chartRefPresent.current) {
      const presentChartCanvas = await html2canvas(chartRefPresent.current);
      const presentChartImage = presentChartCanvas.toDataURL("image/png");
      doc.addImage(presentChartImage, "PNG", 20, 20, 180, 90);
    }
  
    // Add page break and capture the absent chart as an image
    doc.addPage();
    if (chartRefAbsent.current) {
      const absentChartCanvas = await html2canvas(chartRefAbsent.current);
      const absentChartImage = absentChartCanvas.toDataURL("image/png");
      doc.addImage(absentChartImage, "PNG", 20, 20, 180, 90);
    }
  
    // Save the PDF
    doc.save("login_logout_logs.pdf");
  };

  const presentChartData = {
    labels: totalDurations.map((d) => d.employee),
    datasets: [
      {
        label: "Total Hours Worked",
        data: totalDurations.map((d) => d.duration),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const absentChartData = {
    labels: absentDurations,
    datasets: [
      {
        label: "Absent Employees",
        data: Array(absentDurations.length).fill(1),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.filtersSection}>
      <div className="mb-4">
          <OpenMenuButton handleDrawerToggle={handleDrawerToggle} />
        </div>
        <Drawer
          showDrawer={showDrawer}
          handleDrawerToggle={handleDrawerToggle}
          empDesignation={empDesignation}
        />
        <h3>Employee Work Log</h3>
        <div className={styles.inputGroup}>
          <label>Employee Username:</label>
          <select
            value={empUsername}
            onChange={(e) => setEmpUsername(e.target.value)}
            className={styles.inputField}
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Attendance:</label>
          <select
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            className={styles.inputField}
          >
            <option value="">All</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
        <label>From Date:</label>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          className={styles.inputField}
          dateFormat="dd/MM/yyyy"  // Set the desired date format
        />
      </div>

      <div className={styles.inputGroup}>
        <label>To Date:</label>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          className={styles.inputField}
          dateFormat="dd/MM/yyyy"  // Set the desired date format
        />
      </div>


        <div className={styles.buttonContainer}>
          <button onClick={fetchLogs} className={styles.actionButton}>
            Apply Filters
          </button>
          <button onClick={resetFilters} className={styles.actionButton}>
            Reset Filters
          </button>
          <button onClick={exportToPDF} className={styles.actionButton}>
            Export to PDF
          </button>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartContainer} ref={chartRefPresent}>
          <h2>Present Employee Work Durations</h2>
          <Bar data={presentChartData} options={{ responsive: true }} />
        </div>

        <div className={styles.chartContainer} ref={chartRefAbsent}>
          <h2>Absent Employees</h2>
          <Bar data={absentChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div>
        <h3>Logs</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Attendance</th>
              <th>Duration</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.empUsername}</td>
                <td>{log.loginTimestamp ? new Date(log.loginTimestamp).toLocaleString() : "N/A"}</td>
                <td>{log.logoutTimestamp ? new Date(log.logoutTimestamp).toLocaleString() : "N/A"}</td>
                <td>{log.empAttendance}</td>
                <td>{log.duration ? `${log.duration} ${log.durationType}` : "N/A"}</td>
                <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default EmployeeLoginLogoutLogDisplay;
