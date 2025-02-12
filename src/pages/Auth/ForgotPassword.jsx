import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const result = await AuthService.forgotPassword(email);
    
    if (result.success) {
      setMessage(result.message);
      setError('');
    } else {
      setError(result.message);
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleForgotPassword}>
        <h2>Forgot Password</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button type="submit">Send Reset Link</button>
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
