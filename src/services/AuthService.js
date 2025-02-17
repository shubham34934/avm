import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Mock authentication service (replace with actual backend calls)
export const AuthService = {
  login: async (email, password) => {
    try {
      // Simulate login request
      // In a real app, this would be an API call
      if (email && password) {
        return {
          success: true,
          user: {
            email,
            token: "mock_authentication_token",
          },
        };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (login, email, password) => {
    try {
      const response = await axios.post("/register", {
        login,
        email,
        password,
        langKey: "en", // Default language key
      });
      toast.success("Registration successful");
      return { 
        success: true, 
        data: response.data, 
        message: "Registration successful" 
      };
    } catch (error) {
      console.error("Registration error", error);
      toast.error(error.response?.data?.message || "Registration failed");
      throw {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  forgotPassword: async (email) => {
    try {
      // Simulate forgot password request
      // In a real app, this would trigger a password reset email
      toast.success("Password reset link sent to your email");
      return {
        success: true,
        message: "Password reset link sent to your email",
      };
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return { success: false, message: "Passwords do not match" };
      }

      // Simulate password reset request
      toast.success("Password reset successfully");
      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  },
};

// Custom hook for managing authentication state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    const result = await AuthService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setError(null);
      toast.success("Login successful");
    } else {
      setError(result.message);
      toast.error(result.message);
    }
    return result.success;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, error, login, logout };
};
