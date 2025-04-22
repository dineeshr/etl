import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "../css/report.css";
import axios from 'axios';

Chart.register(ChartDataLabels);

const ReportPage = () => {
    const [engineers, setEngineers] = useState([]);
    const [environments, setEnvironments] = useState([]);
    const [applications, setApplications] = useState([]);
    const [statusList, setStatusList] = useState([]);

    const [category, setCategory] = useState("Custom");
    const [engineer, setEngineer] = useState("All");
    const [environment, setEnvironment] = useState("All");
    const [application, setApplication] = useState("All");
    const [status, setStatus] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Fetch report screen details from Backend
    useEffect(() => {
        const fetchReportScreenDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8080/reportscreen/details');
                if(response.status == 200) {
                    setEngineers(response.data.engineerList);
                    setEnvironments(response.data.environmentList);
                    setApplications(response.data.applicationList);
                    setStatusList(response.data.currentStateList);
                } else {
                    console.error("Failed to load report screen details");
                }
            } catch (error) {
                console.error("Error fetching report screen details:", error);
            }
        };
        fetchReportScreenDetails();
    }, []);

    // Get the current date-time in "YYYY-MM-DDTHH:MM" format
    const getCurrentDateTime = () => new Date().toISOString().slice(0, 16);
    const getPastDate = (days) => new Date(new Date().setDate(new Date().getDate() - days)).toISOString().slice(0, 16);

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);

        if (selectedCategory === "Custom") {
            setEngineer("All");
            setEnvironment("All");
            setApplication("All");
            setStatus("All");
            setFromDate("");
            setToDate("");
        } else {
            setEngineer("All");
            setEnvironment("All");
            setApplication("All");
            setStatus("All");
        }

        if (selectedCategory === "Engineer") {
            setEngineer("All");
        } else if (selectedCategory === "Status") {
            setStatus("All");
        } else if (selectedCategory === "Environment") {
            setEnvironment("All");
        } else if (selectedCategory === "Weekly") {
            setFromDate(getPastDate(7));
            setToDate(getPastDate(0));
        } else if (selectedCategory === "Monthly") {
            setFromDate(getPastDate(30));
            setToDate(getPastDate(0));
        }
    };

    // Handle 'From Date' Change with Validation
    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        const now = getCurrentDateTime(); // Current date-time

        if (new Date(selectedFromDate) > new Date()) {
            alert("Error: 'From Date' cannot be in the future.");
            return;
        }

        setFromDate(selectedFromDate);

        // Auto-set "To Date" if it's empty or invalid
        if (!toDate || new Date(selectedFromDate) > new Date(toDate)) {
            setToDate(selectedFromDate); // Allow To Date to be equal to From Date
        }
    };

    // Handle 'To Date' Change with Validation
    const handleToDateChange = (e) => {
        const selectedToDate = e.target.value;
        const now = getCurrentDateTime(); // Current date-time

        if (fromDate && new Date(selectedToDate) < new Date(fromDate)) {
            alert("Error: 'To Date' must be greater than or equal to 'From Date'.");
            return;
        }

        if (new Date(selectedToDate) > new Date()) {
            alert("Error: 'To Date' cannot be in the future.");
            return;
        }

        setToDate(selectedToDate);
    };

    const handleReportGenerationClick = async (event) => {
        event.preventDefault();
        try {
            console.log("Category : ", category);
            console.log("Selected Filters:", { engineer, environment, application, status, fromDate, toDate });
            const response = await axios.get('http://localhost:8080/reports/dashboard'
                /*, {
                params: {
                    handleBy: engineer === "All" ? "" : engineer,
                    environment: environment === "All" ? "" : environment,
                    application: application === "All" ? "" : application,
                    status: status === "All" ? "" : status,
                    fromDate: fromDate,
                    toDate: toDate
                }}*/
            );
            if(response.status == 200) {
                if(response.data != null && response.data.length == 0) {
                    alert("No data available for the selected filters.");
                    return;
                }
                generatePDFWithChart(response.data);
            } else {
                console.error("Failed to get filtered records");
            }
        } catch (error) {
            console.error("Error fetching filtered records:", error);
        }
    };

    const generatePDFWithChart = (records) => {
        const doc = new jsPDF();
        doc.text(`Report - ${category}`, 14, 15);

        let pieData = {};
        let tableHead = {};
        let tableData = [];

        // Handling custom Category
        if (category === "Custom") {
            tableHead = [["Id", "Application", "Environment", "DateTime", "InitialStatus", "CreatedDateTime", "PrevDateTime", "CurrentStatus", "Engineer", "FailureReason", "Fixes", "SolvedDateTime"]];
            tableData = records.filter(r => (engineer === "All" || r.handleBy === engineer) && (status === "All" || (r.initState === "FAILED" && r.currentState === "SUCCESS")) 
                                        && (environment === "All" || r.env === environment) && (application === "All" || r.application === application) 
                                        && (
                                            (!fromDate && !toDate) || // If both are empty, include all records
                                            (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || // If only fromDate is empty, check only toDate
                                            (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || // If only toDate is empty, check only fromDate
                                            (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)) // If both exist, check range
                                        ))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.createdDt, r.prev, r.currentState, r.handleBy, r.failReason, r.fixMethod, r.solvedDt]);
        } else if (category === "Engineer") {
          tableHead = [["Id", "Application", "Environment", "DateTime", "InitialStatus", "CurrentStatus", "Engineer"]];
          if (engineer === "All") {
            pieData = getEngineerPieData(records);
            tableData = records.filter(r => r.initState === "FAILED" && r.currentState === "SUCCESS" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                                                                         (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.currentState, r.handleBy]);
           } else {
            pieData = getSingleEngineerPieData(records, engineer);
            tableData = records.filter(r => r.handleBy === engineer && r.initState === "FAILED" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                                                                    (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.currentState, r.handleBy]);
          }
        } else if (category === "Status") {
          tableHead = [["Id", "Application", "Environment", "DateTime", "InitialStatus", "CreatedDateTime", "PrevDateTime", "CurrentStatus", "Engineer", "FailureReason", "Fixes", "SolvedDateTime"]];
          if (status === "All") {
            pieData = getStatusPieData(records);
            tableData = records.filter(r => r.initState === "FAILED" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                            (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.createdDt, r.prev, r.currentState, r.handleBy, r.failReason, r.fixMethod, r.solvedDt]);
          } else {
            pieData = getSpecificStatusPieData(records, status);
            tableData = records.filter(r => r.currentState === status && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                            (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.createdDt, r.prev, r.currentState, r.handleBy, r.failReason, r.fixMethod, r.solvedDt]);
          }
        } else if (category === "Environment") {
          tableHead = [["Id", "Application", "Environment", "DateTime", "InitialStatus", "CurrentStatus", "Engineer"]];
          if (environment === "All") {
            pieData = getEnvironmentPieData(records);
            tableData = records.filter(r => ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                            (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.currentState, r.handleBy]);
          } else {
            pieData = getApplicationPieData(records, environment);
            tableData = records.filter(r => r.env === environment && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                            (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate))))
                               .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.currentState, r.handleBy]);
          }
        } else if (category === "Weekly" || category === "Monthly") {
          tableHead = [["Id", "Application", "Environment", "DateTime", "InitialStatus", "CreatedDateTime", "PrevDateTime", "CurrentStatus", "Engineer", "FailureReason", "Fixes", "SolvedDateTime"]];
          const days = category === "Weekly" ? 7 : 30;
          pieData = getTimeRangePieData(records, days);
          tableData = records.filter(r => isWithinLastDays(r.dateTime, days))
                             .map(r => [r.id, r.application, r.env, r.dateTime, r.initState, r.createdDt, r.prev, r.currentState, r.handleBy, r.failReason, r.fixMethod, r.solvedDt]);
        }

        const canvas = document.createElement("canvas");
        if(category != "Custom") {
            // Create a temporary canvas
            // Draw Pie Chart
            const ctx = canvas.getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(pieData),
                    datasets: [{ data: Object.values(pieData), backgroundColor: ["red", "blue", "green", "orange"] }],
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        datalabels: {
                            formatter: (value) => value, // Shows count instead of percentage
                            color: "#fff",
                            font: {
                                size: 12,
                                weight: "bold"
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }
        if(tableData.length == 0) {
            alert("No data available for the selected filters.");
            return;
        }

        // Convert chart to image and add to PDF after a delay
        setTimeout(() => {
            // Add table to PDF
            autoTable(doc, {
                head: tableHead,
                body: tableData,
                startY: 20,
                styles: {
                    fontSize: 4, // Reduce font size to make content clearer
                    cellPadding: 2, // Adjust padding to prevent crowding
                },
                headStyles: {
                    fontSize: 5, // Slightly larger font for headers
                    fillColor: [22, 160, 133] // Optional: Change header background color
                }
            });
            if(category != "Custom") {
                const imgData = canvas.toDataURL("image/png");
                doc.addImage(imgData, "PNG", 50, doc.lastAutoTable.finalY + 10, 100, 100);
            }
            doc.save(`${category}_Report.pdf`);
        }, 1000);
    };

    // Helper functions for Pie Chart Data
    const getEngineerPieData = (records) => {
        const data = {};
        records.forEach(r => {
          if (r.initState === "FAILED" && r.currentState === "SUCCESS" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))) {
            data[r.handleBy] = (data[r.handleBy] || 0) + 1;
          }
        });
        return data;
    };

    const getSingleEngineerPieData = (records, selectedEngineer) => {
        let selectedCount = 0, othersCount = 0;
        records.forEach(r => {
          if (r.initState === "FAILED" && r.currentState === "SUCCESS" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))) {
            if (r.handleBy === selectedEngineer) {
              selectedCount++;
            } else {
              othersCount++;
            }
          }
        });
        return { [selectedEngineer]: selectedCount, Others: othersCount };
    };

    const getStatusPieData = (records) => {
        return {
          Success: records.filter(r => r.initState === "FAILED" && r.currentState === "SUCCESS" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          Failed: records.filter(r => r.initState === "FAILED" && r.currentState === "FAILED" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length
        };
    };

    const getSpecificStatusPieData = (records, status) => {
        return {
          [`Failed → ${status}`]: records.filter(r => r.initState === "FAILED" && r.currentState === status && ((!fromDate && !toDate) || 
                                                    (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                    (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          [status]: records.filter(r => r.currentState === status  && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                                                       (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                                       (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length
        };
    };

    const getEnvironmentPieData = (records) => {
        return {
          EU: records.filter(r => r.env === "EU" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                    (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          US1: records.filter(r => r.env === "US1" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                    (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          US2: records.filter(r => r.env === "US2" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || 
                                                    (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length
        };
    };

    const getApplicationPieData = (records, environment) => {
        return {
          CREDIT: records.filter(r => r.env === environment && r.application === "CREDIT" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          EQUITY: records.filter(r => r.env === environment && r.application === "EQUITY" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length,
          MONITORING: records.filter(r => r.env === environment && r.application === "MONITORING" && ((!fromDate && !toDate) || (!fromDate && new Date(r.dateTime) <= new Date(toDate)) || 
                                        (!toDate && new Date(r.dateTime) >= new Date(fromDate)) || (new Date(r.dateTime) >= new Date(fromDate) && new Date(r.dateTime) <= new Date(toDate)))).length
        };
    };

    const getTimeRangePieData = (records, days) => {
        return {
          "InitState:::Success → CurrentState:::Success": records.filter(r => isWithinLastDays(r.dateTime, days) && r.initState === "SUCCESS" && r.currentState === "SUCCESS").length,
          "InitState:::Failed → CurrentState:::Success": records.filter(r => isWithinLastDays(r.dateTime, days) && r.initState === "FAILED" && r.currentState === "SUCCESS").length,
          "InitState:::Failed → CurrentState:::Failed": records.filter(r => isWithinLastDays(r.dateTime, days) && r.initState === "FAILED" && r.currentState === "FAILED").length
        };
    };

    // Utility function to check if a record falls within the last `days`
    const isWithinLastDays = (dateTime, days) => {
        const recordDate = new Date(dateTime);
        const currentDate = new Date();
        const differenceInTime = currentDate - recordDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= days;
    };

    return (
        <div className="container mt-4 p-4">
            <form>
                <h1 className="title-padding">REPORT PAGE</h1>

                <div className="mb-2 row">
                    <label htmlFor="category" className="col-sm-4 col-form-label">Report Category</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="category" value={category} onChange={handleCategoryChange}>
                            <option value="Custom">Custom</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Status">Status</option>
                            <option value="Environment">Environment</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="engineer" className="col-sm-4 col-form-label">Engineer</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="engineer" value={engineer} onChange={(e) => setEngineer(e.target.value)} disabled={category !== "Custom" && category !== "Engineer"}>
                            <option value="">All</option>
                            {engineers.map(dev => <option key={dev} value={dev}>{dev}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="environment" className="col-sm-4 col-form-label">Environment</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="environment" value={environment} onChange={(e) => setEnvironment(e.target.value)} disabled={category !== "Custom" && category !== "Environment"}>
                            <option value="">All</option>
                            {environments.map(env => <option key={env} value={env}>{env}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="application" className="col-sm-4 col-form-label">Application</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="application" value={application} onChange={(e) => setApplication(e.target.value)} disabled={category !== "Custom"}>
                            <option value="">All</option>
                            {applications.map(app => <option key={app} value={app}>{app}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="status" className="col-sm-4 col-form-label">Status</label>
                    <div className="col-sm-3">
                        <select className="form-control" id="status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={category !== "Custom" && category !== "Status"}>
                            <option value="">All</option>
                            {statusList.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-2 row align-items-center">
                    <label htmlFor="time_range" className="col-sm-4 col-form-label">Date Range</label>
                    <div className="col-sm-6 d-flex align-items-center">
                        <input type="datetime-local" className="form-control me-2" id="from_date" value={fromDate} max={getCurrentDateTime()} onChange={handleFromDateChange} disabled={category === "Weekly" || category === "Monthly"} />
                        <span className="mx-2">-</span>
                        <input type="datetime-local" className="form-control ms-2" id="to_date" value={toDate} max={getCurrentDateTime()} onChange={handleToDateChange} disabled={category === "Weekly" || category === "Monthly"} />
                    </div>
                </div>

                <div className="mb-2 row footer-row">
                    <div className="col-sm-9 footer-report-button">
                        <button onClick={handleReportGenerationClick} type="button" className="btn btn-primary">Generate Report</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Prevent multiple calls to createRoot()
const container = document.getElementById("root");
// Use a global variable to track root instance
if (!window.rootInstance) {
    window.rootInstance = createRoot(container);
}
window.rootInstance.render(<ReportPage />);