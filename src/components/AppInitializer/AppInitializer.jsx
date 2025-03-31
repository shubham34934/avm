import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { getAccount } from "../../reducers/authentication";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Skip if we already have initialized
      if (initialized) {
        return;
      }
      
      // Mark as initialized to prevent loops
      setInitialized(true);
      
      // Check if we're on a public route
      const isPublicRoute = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/logout",
      ].some(route => location.pathname.startsWith(route));
      
      // Skip authentication check for public routes
      if (isPublicRoute) {
        return;
      }
      
      try {
        // Uncomment this when backend is ready
        // await dispatch(getAccount()).unwrap();
      } catch (error) {
        // Only redirect to login if not already on a public route
        if (!isPublicRoute) {
          navigate("/login");
        }
      }
    };

    initializeApp();
  }, [dispatch, navigate, location.pathname, initialized]);

  // Show loading only during initial load
  if (!initialized) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AppInitializer;
