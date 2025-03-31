import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { AuthService } from "../../services/AuthService";
import "./Auth.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await AuthService.forgotPassword(email);

      if (result.success) {
        setMessage(result.message);
        setError("");
        // Optional: Auto-redirect or show success modal
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.message);
        setMessage("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <Container className="forgot-password-container">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Form onSubmit={handleForgotPassword} className="auth-form">
            <h2 className="text-center mb-4">Forgot Password</h2>

            {message && (
              <Alert variant="success" className="text-center">
                {message}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter the email associated with your account
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-4">
              Send Reset Link
            </Button>

            <div className="text-center d-flex flex-column gap-3">
              <div>
                <Link
                  to="/login"
                  className="forgot-password-link"
                  title="Return to login page"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
