import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const result = await AuthService.resetPassword(token, password, confirmPassword);
    
    if (result.success) {
      // Redirect to login after successful password reset
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleResetPassword}>
        <h2>Reset Password</h2>
        {error && <p className="error">{error}</p>}
        <input 
          type="password" 
          placeholder="New Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
