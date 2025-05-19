import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../config/store";
import { authenticate } from "../../reducers/authentication";
import { useToast } from "../../context/ToastContext";
import "./Auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { successToast, errorToast } = useToast();

  const { isAuthenticated, loginError, errorMessage } = useAppSelector(
    (state) => state.authentication
  );

  useEffect(() => {
    // Check for saved credentials on component mount
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Save or clear remembered username based on rememberMe checkbox
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      navigate("/"); // Redirect to home page after successful login
    }
  }, [isAuthenticated, navigate, username, rememberMe]);

  useEffect(() => {
    if (location.state?.message) {
      successToast(location.state.message);
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location.state, successToast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username || !password) {
      errorToast("Please enter both username and password");
      return;
    }

    try {
      await dispatch(
        authenticate({
          username,
          password,
          rememberMe,
        })
      ).unwrap();
    } catch (error) {
      errorToast(error.message || "Login failed");
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Form onSubmit={handleLogin} className="auth-form">
            <h2 className="text-center mb-4">Login</h2>

            {(loginError || error) && (
              <Alert variant="danger" className="text-center">
                {errorMessage || error}
              </Alert>
            )}

            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group
              controlId="formRememberMe"
              className="mb-3 d-flex align-items-center"
            >
              <Form.Check
                type="checkbox"
                label="Remember Me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="me-2"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-4">
              Login
            </Button>

            <div className="text-center d-flex flex-column gap-3">
              <div>
                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                  title="Click here if you need to reset your password"
                >
                  Forgot your password?
                </Link>
              </div>
              <div>
                Don't have an account?{" "}
                <Link to="/register" className="register-link">
                  Register here
                </Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
