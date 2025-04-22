import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state for spinner
  const [error, setError] = useState(''); // State to handle error messages
  const navigate = useNavigate();


  useEffect(() => {
    // Check if the user is authenticated by checking localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // If the user is logged in, redirect to the dashboard
    if (isAuthenticated) {
      navigate('/'); // Redirect to dashboard (or another page)
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing error messages
    setLoading(true); // Start loading indicator

    // Check if username and password are entered
    if (!username || !password) {
      setError('Username and Password are required');
      setLoading(false); // Stop loading if fields are empty
      return;
    }

    try {
      // Send POST request to the backend API with username and password
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      // Check if the response is successful
      if (response.status === 200 && response.data) {
        alert('Login successful');

        // Store necessary data in localStorage
        localStorage.setItem('empId', response.data.empId)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('empDesignation', response.data.empDesignation);
        localStorage.setItem('user', JSON.stringify(response.data)); // Store full user info


        navigate('/'); // Redirect to the ReportingDashboard or home page
      }
    } catch (err) {
      // Handle errors here and provide more meaningful error messages
      console.error('Error during authentication:', err.response ? err.response.data : err);

      // You can extract more specific error messages from the response
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials. Please check your username and password.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Stop loading when the request is completed
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src="src\\components\\images\\kgds-3.png" alt="Logo" className={styles.logo} />
        </div>

        {/* Header */}
        <h1 className={styles.header}>KG DATA SOLUTIONS</h1>
        <h2 className={styles.subHeader}>ETL JOB STATUS DASHBOARD</h2>

        <h2 className={`${styles.textCenter} ${styles.mb4}`}>Login</h2>

        {/* Display error message if exists */}
        {error && <div className={`${styles.alert} ${styles.show}`}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formField}>
            <label htmlFor="username" className={styles.formLabel}>Username</label>
            <input
              type="text"
              id="username"
              className={styles.formInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.formButton}
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className={`${styles.textCenter} ${styles.mt3}`}>
          {/* Optional: You can add a link to reset the password */}
          {/* <a href="/forgot-password">Forgot password?</a> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
