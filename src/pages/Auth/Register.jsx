import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useToast } from "../../context/ToastContext";
import "./Auth.css";

const Register = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { successToast, errorToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!login || !email || !password || !confirmPassword) {
      errorToast("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      errorToast("Passwords do not match");
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      errorToast("Password must be at least 8 characters long");
      return;
    }

    try {
      const result = await AuthService.register(login, email, password);

      if (result.success) {
        navigate("/login", {
          state: {
            message: "Registration successful. Please log in.",
          },
        });
      }
    } catch (err) {
      // Error handling is now done in AuthService with toast
      setError(err.message);
    }
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Form onSubmit={handleRegister} className="auth-form">
            <h2 className="text-center mb-4">Register</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group controlId="formLogin" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="register-link">
                Login here
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
