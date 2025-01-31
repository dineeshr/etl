import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AssignEmail = () => {
  // State to hold the email value and success message
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the email via an API POST request to the backend
      const response = await fetch('http://localhost:8080/api/assignEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderEmail: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Error assigning email. Please try again.');
        setMessage('');
      }
    } catch (error) {
      setErrorMessage('Error submitting email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Assign Your Email</h2>

      {/* Success Message */}
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="senderEmail" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="senderEmail"
            name="senderEmail"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AssignEmail;
