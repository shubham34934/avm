import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccount } from "../../reducers/authentication";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Skip if we already have account data or have initialized
      if (initialized) {
        return;
      }
      setInitialized(true);
      try {
        // await dispatch(getAccount()).unwrap();
      } catch (error) {
        // If we get a 401 or any error, redirect to login
        if (!window.location.pathname.startsWith("/login")) {
          navigate("/login");
        }
      }
    };

    initializeApp();
  }, [initialized]);

  // Show loading only during initial load
  if (!initialized) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AppInitializer;
