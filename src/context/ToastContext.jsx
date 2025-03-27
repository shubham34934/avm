import React, { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create toast configuration presets
const toastConfig = {
  position: "top-right",
  autoClose: 2000, // Reduced from 3000 to 2000 ms
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Create toast context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  // Success toast
  const successToast = (message) => {
    toast.success(message, toastConfig);
  };

  // Error toast
  const errorToast = (message) => {
    toast.error(message, toastConfig);
  };

  // Warning toast
  const warningToast = (message) => {
    toast.warning(message, toastConfig);
  };

  // Info toast
  const infoToast = (message) => {
    toast.info(message, toastConfig);
  };

  return (
    <ToastContext.Provider
      value={{ successToast, errorToast, warningToast, infoToast }}
    >
      {children}
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
