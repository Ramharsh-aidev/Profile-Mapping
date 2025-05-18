// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  getLoggedInUser,
  setLoggedInUser,
  removeLoggedInUser,
  loginUserApi,
  addUser as apiAddUser,
  findUserByEmail as apiFindUserByEmail,
} from '../utils/authStorage'; // Ensure this path is correct

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserSession = getLoggedInUser();
        if (storedUserSession) {
            setUser(storedUserSession);
        }
        setLoading(false);
    }, []);

    const _updateUserSessionAndContext = (userDataFromApi) => {
        // This function now assumes userDataFromApi contains ALL relevant fields
        // including those from userInfoData.json (gender, nationality, category, etc.)
        // because both /auth/login (if modified) and PUT /me/profile-info should return this merged data.
        const sessionUser = {
            // Core fields from userAccounts.json
            username: userDataFromApi.username,
            email: userDataFromApi.email,
            isAdmin: userDataFromApi.isAdmin || false,
            name: userDataFromApi.name || userDataFromApi.username,
            photoURL: userDataFromApi.photoURL || '',
            location: userDataFromApi.location || '',
            description: userDataFromApi.description || '',
            dateOfBirth: userDataFromApi.dateOfBirth || null,
            createdAt: userDataFromApi.createdAt, // If available

            // Fields from userInfoData.json
            gender: userDataFromApi.gender || '',
            nationality: userDataFromApi.nationality || '',
            category: userDataFromApi.category || '',
            bloodGroup: userDataFromApi.bloodGroup || '', // Include if needed in context/session
            tShirtSize: userDataFromApi.tShirtSize || '', // Include if needed

            token: userDataFromApi.token || user?.token, // If using tokens
        };
        
        // Ensure no undefined values are stored, replace with empty string or null
        Object.keys(sessionUser).forEach(key => {
            if (sessionUser[key] === undefined) {
                sessionUser[key] = (key === 'dateOfBirth' || key === 'isAdmin') ? null : ''; // Handle specific defaults
                if (key === 'isAdmin') sessionUser[key] = false;
            }
        });

        setLoggedInUser(sessionUser); // Update localStorage (authStorage should handle what it stores)
        setUser(sessionUser);         // Update React context state
    };

    const login = async (email, password) => { /* ... (same as last provided, relies on _updateUserSessionAndContext) ... */
        console.log(`AuthContext: Attempting API login for: ${email}`);
        const apiResult = await loginUserApi(email, password); 

        if (apiResult && apiResult.user) { 
            // Backend's /auth/login MUST return the merged user object including fields like gender, nationality, etc.
            // if you want them immediately in the AuthContext user object upon login.
            // If not, /me/profile-info will fetch them later for UserDashboardPage.
            _updateUserSessionAndContext(apiResult.user);
            console.log("AuthContext: Login successful. User in context:", apiResult.user.username);
            return { success: true, user: apiResult.user };
        } else {
            console.warn("AuthContext: Login failed.", apiResult?.message);
            return { success: false, message: apiResult?.message || 'Invalid credentials or server error.' };
        }
    };

    const signup = async (username, email, password, confirmPassword, location, description, photoURL, name, dateOfBirth, isAdmin = false) => { /* ... (same as last provided, relies on _updateUserSessionAndContext) ... */
        if (!username || !email || !password || !confirmPassword || !name || !dateOfBirth) {
            return { success: false, message: 'Required fields are missing.' };
        }
        if (password !== confirmPassword) return { success: false, message: 'Passwords do not match.' };
        if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters.' };
        
        const existingUser = await apiFindUserByEmail(email);
        if (existingUser) return { success: false, message: 'Email address is already registered.' };

        const newUserFormData = { username, email, password, isAdmin, location, description, photoURL, name, dateOfBirth };
        const apiResult = await apiAddUser(newUserFormData); 

        if (apiResult.success && apiResult.user) {
            // Backend's POST /users should return the merged user object (with default userInfoData fields)
            _updateUserSessionAndContext(apiResult.user);
            console.log("AuthContext: Signup successful. User in context:", apiResult.user.username);
            return { success: true, user: apiResult.user };
        } else {
            return { success: false, message: apiResult.message || 'Could not register user.' };
        }
    };

    const logout = () => { /* ... (same as before) ... */
        removeLoggedInUser(); 
        setUser(null);       
        console.log("AuthContext: User logged out.");
    };

    const updateContextUser = (updatedUserDetailsFromApi) => { /* ... (same as before, relies on _updateUserSessionAndContext) ... */
        if (user && user.email === updatedUserDetailsFromApi.email) { 
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
        <AuthContext.Provider value={{ user, isAdmin: isAdminUser, login, signup, logout, loading, updateContextUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };
export const useAuth = () => { /* ... (same as before) ... */
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};