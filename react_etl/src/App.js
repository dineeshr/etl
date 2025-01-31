import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportingDashboard from './components/dashboardComponents/ReportingDashboard';
import AssignEmail from './components/emailComponents/AssignEmail'; // Your email form component

function App() {
  return (
    <Router>
      <Routes>
        {/* Define routes for different components */}
        <Route path="/" element={<ReportingDashboard />} />
        <Route path="/assign-email" element={<AssignEmail />} /> {/* Email form route */}
      </Routes>
    </Router>
  );
}

export default App;

