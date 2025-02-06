import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportingDashboard from './components/dashboardComponents/ReportingDashboard';
import Login from './components/loginComponents/Login'; // Updated import for Login
import PrivateRoute from './components/PrivateRouteComponents/PrivateRoute'; // Import PrivateRoute
import SettingsPage from './components/SettingsComponents/SettingsPage';

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
        <Route path="/settings" element={<SettingsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
