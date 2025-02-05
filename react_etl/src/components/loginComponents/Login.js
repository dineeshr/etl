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
        password
      });

      // Check if the response contains employee data, including empDesignation
      if (response.data) {
        alert('Login successful');
        localStorage.setItem('isAuthenticated', 'true'); // Store authentication status
        localStorage.setItem('empDesignation', response.data.empDesignation); // Store designation
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
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Login</button>
      </form>
    </div>
  );
}

export default Login;
