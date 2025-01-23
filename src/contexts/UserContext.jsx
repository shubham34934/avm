import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating user fetch
    const fetchUser = async () => {
      try {
        // Replace with actual API call
        const mockUser = {
          id: '1',
          name: 'Vivek Sharma',
          role: 'Super Admin',
          avatar: null,
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with proper loading component
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
