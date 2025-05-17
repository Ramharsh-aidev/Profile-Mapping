// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  getLoggedInUser,       // For client-side session state
  setLoggedInUser,       // For client-side session state
  removeLoggedInUser,    // For client-side session state
  loginUserApi,          // API call for login
  addUser as apiAddUser, // API call for signup (renamed to avoid conflict)
  findUserByEmail as apiFindUserByEmail, // API call for email check during signup
} from '../utils/authStorage'; // Ensure this path is correct

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores logged-in user's details
    const [loading, setLoading] = useState(true); // For initial auth check

    useEffect(() => {
        // On initial load, check if a user session exists in localStorage
        const storedUserSession = getLoggedInUser();
        if (storedUserSession) {
            setUser(storedUserSession); // Restore session from localStorage
        }
        setLoading(false);
    }, []);

    // Helper to update both React state and localStorage session
    const _updateUserSessionAndContext = (userDataFromApi) => {
        // userDataFromApi is the object returned by your backend login/signup/profile update
        // It should NOT contain the password.
        const sessionUser = {
            username: userDataFromApi.username,
            email: userDataFromApi.email,
            isAdmin: userDataFromApi.isAdmin || false,
            name: userDataFromApi.name || userDataFromApi.username,
            photoURL: userDataFromApi.photoURL || '',
            // Add any other fields from userDataFromApi that are useful for the session/context
            // token: userDataFromApi.token, // If your API returns a token
        };
        setLoggedInUser(sessionUser); // Update localStorage
        setUser(sessionUser);         // Update React context state
    };

    const login = async (email, password) => {
        console.log(`AuthContext: Attempting API login for: ${email}`);
        const apiResult = await loginUserApi(email, password); // Call API via authStorage

        if (apiResult && apiResult.user) { // Backend's /auth/login returns user object on success
            _updateUserSessionAndContext(apiResult.user);
            console.log("AuthContext: Login successful. User in context:", apiResult.user.username);
            return { success: true, user: apiResult.user };
        } else {
            console.warn("AuthContext: Login failed.", apiResult?.message);
            return { success: false, message: apiResult?.message || 'Invalid credentials or server error.' };
        }
    };

    const signup = async (username, email, password, confirmPassword, location, description, photoURL, name, dateOfBirth, isAdmin = false) => {
        // Basic frontend validation
        if (!username || !email || !password || !confirmPassword || !name || !dateOfBirth) {
            return { success: false, message: 'Required fields are missing.' };
        }
        if (password !== confirmPassword) return { success: false, message: 'Passwords do not match.' };
        if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };
        
        // Check if email already exists (optional, backend also checks)
        const existingUser = await apiFindUserByEmail(email); // API call via authStorage
        if (existingUser) return { success: false, message: 'Email address is already registered.' };

        const newUserFormData = { username, email, password, isAdmin, location, description, photoURL, name, dateOfBirth };
        
        const apiResult = await apiAddUser(newUserFormData); // API call via authStorage

        if (apiResult.success && apiResult.user) {
            _updateUserSessionAndContext(apiResult.user); // Auto-login after successful signup
            console.log("AuthContext: Signup successful. User in context:", apiResult.user.username);
            return { success: true, user: apiResult.user };
        } else {
            return { success: false, message: apiResult.message || 'Could not register user.' };
        }
    };

    const logout = () => {
        removeLoggedInUser(); // Clear localStorage session
        setUser(null);        // Clear React context state
        console.log("AuthContext: User logged out.");
        // Optionally: Call a backend /logout endpoint if your backend manages sessions/tokens
    };

    // Called by UserDashboardPage after it successfully updates profile via PUT /me/profile-info API
    const updateContextUser = (updatedUserDetailsFromApi) => {
        if (user && user.email === updatedUserDetailsFromApi.email) { // Ensure it's the same user
             _updateUserSessionAndContext(updatedUserDetailsFromApi);
             console.log("AuthContext: User details updated in context for:", updatedUserDetailsFromApi.email);
             return { success: true, user: updatedUserDetailsFromApi };
        } else {
            console.warn("AuthContext: Mismatch or no user for context update.");
            return { success: false, message: "User mismatch or not logged in for context update." };
        }
    };

    const isAdminUser = user ? user.isAdmin : false;

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin: isAdminUser,
            login,
            signup,
            logout,
            loading,
            updateContextUser,
            // Removed updateProfileInStorage & deleteAccountInStorage as they were for direct storage manipulation
            // Admin actions should use functions from authStorage that call admin API endpoints
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};