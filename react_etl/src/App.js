import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportingDashboard from './components/dashboardComponents/ReportingDashboard';
import AssignEmail from './components/emailComponents/AssignEmail'; // Your email form component
import Login from './components/loginComponents/Login'; // Updated import for Login
import PrivateRoute from './components/PrivateRouteComponents/PrivateRoute'; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />  {/* Login route */}

        {/* Private routes (protected by PrivateRoute) */}
        <Route 
          path="/" 
          element={<PrivateRoute element={<ReportingDashboard />} />} 
        /> {/* Dashboard route */}

        <Route 
          path="/assign-email" 
          element={<PrivateRoute element={<AssignEmail />} />} 
        /> {/* Email form route */}
      </Routes>
    </Router>
  );
}

export default App;
