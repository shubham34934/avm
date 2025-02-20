import { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { account, loading } = useSelector((state) => state.authentication);

  const value = {
    user: account,
    loading,
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
