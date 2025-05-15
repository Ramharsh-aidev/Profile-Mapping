import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types'; // Make sure prop-types is installed
import { getLoggedInUser, setLoggedInUser, removeLoggedInUser, findUser, addUser, findUserByEmail } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null or { username, email, isAdmin }
  const [loading, setLoading] = useState(true); // To handle initial loading from storage

  useEffect(() => {
    // Check storage for logged-in user on mount
    const storedUser = getLoggedInUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Finished checking storage
  }, []);

  const login = (email, password) => {
    const foundUser = findUser(email, password);
    if (foundUser) {
      setLoggedInUser(foundUser);
      setUser({
        username: foundUser.username,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin || false,
        address: foundUser.address,
        description: foundUser.description,
        photoURL: foundUser.photoURL,
      });
      return { success: true, user: foundUser };
    } else {
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const signup = (username, email, password, confirmPassword, address, description, photoURL, isAdmin = false) => {
      // Basic validation
      if (!username || !email || !password || !confirmPassword) {
          return { success: false, message: 'All fields are required.' };
      }
      if (password !== confirmPassword) {
          return { success: false, message: 'Passwords do not match.' };
      }
      if (password.length < 6) { // Simple password length check
           return { success: false, message: 'Password must be at least 6 characters long.' };
      }
      if (findUserByEmail(email)) {
          return { success: false, message: 'Email address is already registered.' };
      }

      const newUser = { username, email, password, isAdmin, address, description, photoURL }; // In real app, hash password here
      const added = addUser(newUser);

      if (added) {
           // Auto-login the user after signup (optional)
          setLoggedInUser(newUser);
           setUser({
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin || false,
            address: newUser.address,
            description: newUser.description,
            photoURL: newUser.photoURL,
          });
          return { success: true, user: newUser };
      } else {
           // This case should technically be caught by findUserByEmail, but included as a fallback
           return { success: false, message: 'Could not register user.' };
      }
  };


  const logout = () => {
    removeLoggedInUser();
    setUser(null);
  };

  const isAdmin = user ? user.isAdmin : false;

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};