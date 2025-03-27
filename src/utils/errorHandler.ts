// src/utils/errorHandler.ts
import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../config/store"; // Import your Redux store
import { logout } from "../reducers/authentication";

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        // Unauthorized - logout user
        store.dispatch(logout());
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
        break;

      case 403:
        toast.error("You do not have permission to perform this action.");
        break;

      case 404:
        toast.error("The requested resource was not found.");
        break;

      case 500:
        toast.error(
          "An internal server error occurred. Please try again later."
        );
        break;

      default:
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again."
        );
    }
  } else {
    // Network error or other types of errors
    toast.error("Network error. Please check your connection.");
  }

  // Optionally rethrow the error for further handling
  throw error;
};

export default handleApiError;
