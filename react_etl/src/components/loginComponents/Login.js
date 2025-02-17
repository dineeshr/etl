import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend API with both username and password
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      // Check if the response contains employee data
      if (response.status === 200 && response.data) {
        alert('Login successful');
        
        // Clear any existing session or error states
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('empDesignation', response.data.empDesignation);
        localStorage.setItem('user', JSON.stringify(response.data)); // Store full user info

        navigate('/'); // Redirect to the ReportingDashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during authentication:', error.response ? error.response.data : error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
        </form>
        <div className="text-center mt-3"></div>
      </div>
    </div>
  );
}

export default Login;
