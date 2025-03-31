import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import PropTypes from "prop-types";
import { checkAllowedRole } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAccount } from "../../reducers/authentication";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const RouteGuard = ({ children, allowedRoles }) => {
  const [initialized, setInitialized] = useState(false);
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.authentication);
  const initializeApp = async () => {
    setInitialized(true);
    try {
      await dispatch(getAccount()).unwrap();
    } catch (error) {
      if (!window.location.pathname.startsWith("/login")) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (initialized || account?.login) {
      return;
    }
    initializeApp();
  }, [account, initialized]);

  // Show loading only during initial load
  if (!initialized && !account?.login) {
    return <LoadingSpinner />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!checkAllowedRole(allowedRoles, user.authorities)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RouteGuard;
