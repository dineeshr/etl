import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportingDashboard from './components/dashboardComponents/ReportingDashboard';
import Login from './components/loginComponents/Login';
import PrivateRoute from './components/PrivateRouteComponents/PrivateRoute'; // Import PrivateRoute
import EmployeeManagement from './components/EmployeeManagementComponents/EmployeeManagement';
import EmployeeProfileExport from './components/EmployeeManagementComponents/EmployeeProfileExport'; // Import the new component
import EmployeeLoginLogoutLogDisplay from './components/EmployeeLoginLogoutLogDisplay/EmployeeLoginLogoutLogDisplay';
import GrievanceEngineer from './components/Grievance/GrievanceEngineer'; // Import GrievanceEngineer component
import GrievanceManager from './components/Grievance/GrievanceManager'; // Import GrievanceManager component
import EngineerUpdateRequest from './components/UpdateRequest/EngineerUpdateRequest';
import ManagerUpdateRequest from './components/UpdateRequest/ManagerUpdateRequest';
import ManagerLeaveApproval from './components/LeaveRequest/ManagerLeaveApproval';
import EngineerLeaveRequest from './components/LeaveRequest/EngineerLeaveRequest';

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
          path="/EmployeeManagement"
          element={
            <PrivateRoute>
              <EmployeeManagement />
            </PrivateRoute>
          }
        /> {/* EmployeeManagement route */}

        <Route
          path="/EmployeeProfileExport"
          element={
            <PrivateRoute>
              <EmployeeProfileExport />
            </PrivateRoute>
          }
        /> {/* Employee Profile Export route */}

        <Route
          path="/EmployeeLoginLogoutLogDisplay"
          element={
            <PrivateRoute>
              <EmployeeLoginLogoutLogDisplay />
            </PrivateRoute>
          }
        /> {/* EmployeeLoginLogoutLogDisplay route */}

        {/* Conditional Grievance route based on empRole */}
        <Route
          path="/GrievanceManagement"
          element={
            <PrivateRoute>
              < GrievanceManager/>
            </PrivateRoute>
          }
          
        /> {/* Grievance route */}

<Route
          path="/GrievanceRaisal"
          element={
            <PrivateRoute>
              < GrievanceEngineer/>
            </PrivateRoute>
          }
          
        />

        <Route
          path="/EngineerUpdateRequest"
          element={
            <PrivateRoute>
              < EngineerUpdateRequest/>
            </PrivateRoute>
          }
        /> 
<Route
          path="/ManagerUpdateRequest"
          element={
            <PrivateRoute>
              < ManagerUpdateRequest/>
            </PrivateRoute>
          }
          
        /> 

<Route
          path="/ManagerLeaveApproval"
          element={
            <PrivateRoute>
              < ManagerLeaveApproval/>
            </PrivateRoute>
          }
          
        /> 

<Route
          path="/EngineerLeaveRequest"
          element={
            <PrivateRoute>
              < EngineerLeaveRequest/>
            </PrivateRoute>
          }
          
        /> 


      </Routes>
    </Router>
  );
}

export default App;
