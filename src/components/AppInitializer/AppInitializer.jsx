import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccount } from "../../reducers/authentication";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const { account } = useSelector((state) => state.authentication);

  useEffect(() => {
    const initializeApp = async () => {
      // Skip if we already have account data or have initialized
      if (initialized || account?.login) {
        return;
      }
      try {
        await dispatch(getAccount()).unwrap();
      } catch (error) {
        // If we get a 401 or any error, redirect to login
        if (!window.location.pathname.startsWith("/login")) {
          navigate("/login");
        }
      } finally {
        setInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch, navigate, initialized, account]);

  // Show loading only during initial load
  if (!initialized && !account?.login) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AppInitializer;
