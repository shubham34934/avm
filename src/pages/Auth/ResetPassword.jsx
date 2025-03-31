import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
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
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    const result = await AuthService.resetPassword(token, password, confirmPassword);
    
    if (result.success) {
      // Redirect to login after successful password reset
      navigate('/login', {
        state: {
          message: 'Password reset successful. Please log in with your new password.'
        }
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <Container className="reset-password-container">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Form onSubmit={handleResetPassword} className="auth-form">
            <h2 className="text-center mb-4">Reset Password</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Reset Password
            </Button>

            <div className="text-center">
              <Link to="/login" className="forgot-password-link">
                Back to Login
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
