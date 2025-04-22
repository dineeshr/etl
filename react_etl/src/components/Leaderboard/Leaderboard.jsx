import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "../css/Leaderboard.css";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Leaderboard = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchDashboardRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/reports/dashboard");
        if (response.status === 200) {
          setReportData(response.data);
        } else {
          console.error("Failed to fetch dashboard records");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDashboardRecords();
  }, []);

  // Filter data where initState = "FAILED" and currentState = "SUCCESS"
  const filteredData = reportData.filter(
    (item) => item.initState === "FAILED" && item.currentState === "SUCCESS"
  );

  // Group by handleBy (Engineer Success Count)
  const handleByCounts = filteredData.reduce((acc, item) => {
    acc[item.handleBy] = (acc[item.handleBy] || 0) + 1;
    return acc;
  }, {});

  // Group by environment + application
  const envAppCounts = filteredData.reduce((acc, item) => {
    const key = `${item.env} - ${item.application}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Sort engineers by success count in descending order
  const sortedEngineers = Object.entries(handleByCounts)
    .sort((a, b) => b[1] - a[1]) // Sort in descending order
    .slice(0, 10); // Show top 10 engineers

  // Prepare Pie Chart Data
  const handleByChartData = {
    labels: Object.keys(handleByCounts),
    datasets: [
      {
        data: Object.values(handleByCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const envAppChartData = {
    labels: Object.keys(envAppCounts),
    datasets: [
      {
        data: Object.values(envAppCounts),
        backgroundColor: ["#FF9F40", "#9966FF", "#C9CBCF", "#FF6384"],
      },
    ],
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 Engineer Leaderboard 🏆</h2>

      {/* Game-style leaderboard */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>🏅 Rank</th>
            <th>👤 Name</th>
            <th>✅ Success Count</th>
          </tr>
        </thead>
        <tbody>
          {sortedEngineers.map(([name, count], index) => (
            <tr key={name} className={index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "default"}>
              <td>#{index + 1}</td>
              <td>{name}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pie Chart Section */}
      <div className="pie-charts">
        <div>
          <h3>Success by Engineer</h3>
          <Pie data={handleByChartData} />
        </div>

        <div>
          <h3>Success by Environment & Application</h3>
          <Pie data={envAppChartData} />
        </div>
      </div>
    </div>
  );
};

// Prevent multiple calls to createRoot()
const container = document.getElementById("root");
if (!window.rootInstance) {
  window.rootInstance = createRoot(container);
}
window.rootInstance.render(<Leaderboard />);
