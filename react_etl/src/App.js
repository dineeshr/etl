import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportingDashboard from './components/dashboardComponents/ReportingDashboard';
import Login from './components/loginComponents/Login';
import PrivateRoute from './components/PrivateRouteComponents/PrivateRoute'; // Import PrivateRoute
import EmployeeManagement from './components/EmployeeManagementComponents/EmployeeManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} /> {/* Login route */}

        {/* Private routes (protected by PrivateRoute) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ReportingDashboard />
            </PrivateRoute>
          }
        /> {/* Dashboard route */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <EmployeeManagement />
            </PrivateRoute>
          }
        /> {/* Settings route */}
      </Routes>
    </Router>
  );
}

export default App;
