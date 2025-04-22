import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from 'axios';
import "../css/detail.css";
import ChatRoom from "./chatroom";
import AIAssistant from "./aiassistant";
import { FaMagic } from "react-icons/fa";

const DetailPage = () => {
    const [assignees, setAssignees] = useState([]);
    const [assigneeInactive, setAssigneeInactive] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        reported_date_time: "",
        assignee: "",
        failed_job_details: "",
        issue_description: "",
        issue_fix: "",
        is_view_only: true,
    });
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem('user')).username);
    const [showFixPopup, setShowFixPopup] = useState(false);
    const [fixSuggestion, setFixSuggestion] = useState("");

    // Fetch Assignees from Backend
    useEffect(() => {
        const fetchAssignees = async () => {
            try {
                const response = await axios.get('http://localhost:8080/employees');
                setAssignees(response.data.sort((a, b) => a.empName.localeCompare(b.empName))); // Store fetched assignees
            } catch (error) {
                console.error("Error fetching assignees:", error);
            }
        };
        fetchAssignees();
    }, []);

    useEffect(() => {
        if (assignees.length === 0) return;
        const rowData = JSON.parse(localStorage.getItem("selectedRow"));
        if (!rowData) return;
        const failedJobDetails = `Id: ${rowData.id}\nApplication: ${rowData.application}\nEnvironment: ${rowData.env}`;
        
        // Check if rowData.handleBy exists in assignees
        const assigneeExists = assignees.some((assignee) => assignee.empName === rowData.handleBy);
        setAssigneeInactive(!assigneeExists && rowData.isViewOnly); // Set label visibility
        setFormData({
            id: rowData.id || "",
            reported_date_time: rowData.dateTime || "",
            assignee: rowData.handleBy || "",
            failed_job_details: failedJobDetails || "",
            issue_description: rowData.failReason || "",
            issue_fix: rowData.fixMethod || "",
            is_view_only: rowData.isViewOnly || "",
        });
    
        fetchMessages(rowData.id);
    }, [assignees]);

    const fetchMessages = async (issueId) => {
        if (!issueId) return;
        try {
            const response = await axios.get(`http://localhost:8080/chat/${issueId}`);
            setMessages((prevMessages) => [
                ...prevMessages,
                ...response.data.filter((msg) => !prevMessages.some((m) => m.id === msg.id))
            ]);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFixSuggestion = async () => {
        if(formData.issue_description === "") {
            alert("Please fill Reason of Failure");
            return;
        }
        setFixSuggestion("Fetching suggestion...");
        setShowFixPopup(true);
        try {
            const response = await axios.post("http://localhost:8080/ai/fix-suggestion", {
                issueDescription: formData.issue_description,
            });
            setFixSuggestion(response.data);
        } catch (error) {
            setFixSuggestion("Error fetching suggestion.");
        }
    };

    const handleResetClick = () => {
        const rowData = JSON.parse(localStorage.getItem("selectedRow"));
        const failedJobDetails = "Id : " + rowData.id + "\nApplication : " + rowData.application + "\nEnvironment : " + rowData.env;
        // Check if rowData.handleBy exists in assignees
        const assigneeExists = assignees.some((assignee) => assignee.empName === rowData.handleBy);
        setAssigneeInactive(!assigneeExists && rowData.isViewOnly); // Set label visibility
        if (rowData) {
            setFormData({
                id: rowData.id || "",
                reported_date_time: rowData.dateTime || "",
                assignee: rowData.handleBy || "",
                failed_job_details: failedJobDetails || "",
                issue_description: rowData.failReason || "",
                issue_fix: rowData.fixMethod || "",
            });
        }
    };

    const handleSolveClick = async () => {
        try {
            // Validation checks
            if(formData.assignee == null || formData.assignee === "") {
                alert('Assignee has an in-valid data');
                return;
            }
            if(formData.issue_description == null || formData.issue_description === "") {
                alert('Reason of Failure field has an in-valid data');
                return;
            }
             if(formData.issue_fix == null || formData.issue_fix === "") {
                alert('How you fixed? field has an in-valid data');
                return;
            }
            // Make API call to update the issue as solved
            const response = await axios.post(`http://localhost:8080/detail/update/${formData.id}`, {
                handleBy: formData.assignee,
                failReason: formData.issue_description,
                fixMethod: formData.issue_fix,
                currentState: 'SUCCESS'
            });
            if (response.status === 200) {
                alert("Issue marked as solved!");
                localStorage.setItem("refreshReports", Date.now()); // Notify list screen
                window.close(); // Close the window
            }
        } catch (error) {
            console.error("Error updating issue:", error);
            if (error.response) {
                alert(error.response.data || "Failed to update report");
            } else {
                alert("Network error or server is unreachable.");
            }
        }
    };

    return (
        <div className="container mt-4 p-4">
            <form>
                <h1 className="title-padding">ISSUE DETAILS</h1>

                <div className="mb-2 row">
                    <label htmlFor="reported_date_time" className="col-sm-4 col-form-label">
                        Reported Date and Time
                    </label>
                    <div className="col-sm-3">
                        <input
                            type="datetime-local"
                            className="form-control form-input"
                            id="reported_date_time"
                            value={formData.reported_date_time}
                            disabled
                        />
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="assignee" className="col-sm-4 col-form-label">Assignee</label>
                    <div className="col-sm-3">
                        <select className="form-control form-select-input" id="assignee" value={formData.assignee} onChange={handleChange} disabled={formData.is_view_only}>
                            <option value="">Select Assignee</option>
                            {assignees.map((assignee) => (
                                <option key={assignee.empName} value={assignee.empName}>
                                    {assignee.empName}
                                </option>
                            ))}
                        </select>
                        {assigneeInactive && (<span className="text-danger ms-2">Employee In-Active</span>)}
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="failed_job_details" className="col-sm-4 col-form-label">Failed Job Details</label>
                    <div className="col-sm-6">
                        <textarea
                            className="form-control failed-details-textarea"
                            id="failed_job_details"
                            value={formData.failed_job_details}
                            disabled
                        ></textarea>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="issue_description" className="col-sm-4 col-form-label">Reason of Failure</label>
                    <div className="col-sm-6 position-relative d-flex">
                        <textarea className="form-control w-100" id="issue_description" value={formData.issue_description} onChange={handleChange} disabled={formData.is_view_only}></textarea>
                        <button className="ai-assistant-btn ms-2" type="button" onClick={handleFixSuggestion} disabled={formData.is_view_only}><FaMagic /></button>
                    </div>
                </div>

                <div className="mb-2 row">
                    <label htmlFor="issue_fix" className="col-sm-4 col-form-label">How you Fixed?</label>
                    <div className="col-sm-6">
                        <textarea className="form-control w-100" id="issue_fix" value={formData.issue_fix} onChange={handleChange} disabled={formData.is_view_only}></textarea>
                    </div>
                </div>

                <div className="mb-2 row footer-row">
                    <div className="col-sm-4 footer-update-button">
                        <button onClick={handleSolveClick} type="button" className="btn btn-primary" disabled={formData.is_view_only}>Mark as Solved!</button>
                    </div>
                    <div className="col-sm-3 footer-reset-button">
                        <button onClick={handleResetClick} type="button" className="btn btn-warning" disabled={formData.is_view_only}>Reset</button>
                    </div>
                </div>
                <ChatRoom issueId={formData.id} username={username} disabled={formData.is_view_only} />
            </form>
            {showFixPopup && (
                <div className="popup-overlay">
                    <div className="popup-content fixed-popup">
                        <h3>AI Fix Suggestion</h3>
                        <p>{fixSuggestion}</p>
                        <button className="btn btn-secondary" onClick={() => setShowFixPopup(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DetailPage />);
