import { useState } from 'react';

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
            token: 'mock_authentication_token' 
          } 
        };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (email, password, confirmPassword) => {
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Simulate registration request
      // In a real app, this would be an API call
      return { 
        success: true, 
        user: { 
          email, 
          token: 'mock_registration_token' 
        } 
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  forgotPassword: async (email) => {
    try {
      // Simulate forgot password request
      // In a real app, this would trigger a password reset email
      return { 
        success: true, 
        message: 'Password reset link sent to your email' 
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      // Validate passwords match
      if (newPassword !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      // Simulate password reset request
      // In a real app, this would verify the token and update the password
      return { 
        success: true, 
        message: 'Password reset successfully' 
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
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
    } else {
      setError(result.message);
    }
    return result.success;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, error, login, logout };
};
