// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  getLoggedInUser,
  setLoggedInUser,
  removeLoggedInUser,
  findUser,
  addUser,
  findUserByEmail,
  updateUser as updateStorageUser, // Renamed to avoid conflict
  deleteUser as deleteStorageUser  // Renamed
} from '../utils/authStorage'; // Ensure this path is correct

// AuthContext is created and will be used by the useAuth hook
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getLoggedInUser();
        if (storedUser) {
            setUser({
                username: storedUser.username,
                email: storedUser.email,
                isAdmin: storedUser.isAdmin || false,
                name: storedUser.name || storedUser.username,
                photoURL: storedUser.photoURL || '',
                location: storedUser.location || '',
                description: storedUser.description || '',
                dateOfBirth: storedUser.dateOfBirth || null,
            });
        }
        setLoading(false);
    }, []);

    const _updateUserSession = (userData) => {
        const userForContextAndStorage = {
            username: userData.username,
            email: userData.email,
            isAdmin: userData.isAdmin || false,
            name: userData.name || userData.username,
            photoURL: userData.photoURL || '',
            location: userData.location || '',
            description: userData.description || '',
            dateOfBirth: userData.dateOfBirth || null,
        };
        setLoggedInUser(userForContextAndStorage);
        setUser(userForContextAndStorage);
    };

    const login = async (email, password) => {
        const foundUser = await findUser(email, password);
        if (foundUser) {
            _updateUserSession(foundUser);
            return { success: true, user: foundUser };
        } else {
            return { success: false, message: 'Invalid email or password.' };
        }
    };

    const signup = async (username, email, password, confirmPassword, location, description, photoURL, name, dateOfBirth, isAdmin = false) => {
        if (!username || !email || !password || !confirmPassword || !name || !dateOfBirth ) {
            return { success: false, message: 'Required fields are missing (username, email, password, name, date of birth).' };
        }
        if (password !== confirmPassword) return { success: false, message: 'Passwords do not match.' };
        if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters long.' };
        
        const existingUser = await findUserByEmail(email);
        if (existingUser) return { success: false, message: 'Email address is already registered.' };

        const newUser = {
            username, email, password, isAdmin,
            location: location || 'Location Undisclosed',
            description: description || 'No description.',
            photoURL: photoURL || '',
            name, dateOfBirth
        };
        const added = await addUser(newUser);

        if (added) {
            _updateUserSession(typeof added === 'object' ? added : newUser);
            return { success: true, user: (typeof added === 'object' ? added : newUser) };
        } else {
            return { success: false, message: 'Could not register user.' };
        }
    };

    const logout = () => {
        removeLoggedInUser();
        setUser(null);
    };

    const updateContextUser = (updatedUserDetailsFromApi) => {
        if (user && user.email === updatedUserDetailsFromApi.email) {
             _updateUserSession(updatedUserDetailsFromApi);
             return { success: true, user: updatedUserDetailsFromApi };
        } else {
            console.warn("AuthContext: Attempted to update context for a mismatched or non-logged-in user.");
            return { success: false, message: "User mismatch or not logged in for context update." };
        }
    };

    const updateProfileInStorage = async (updatedUserFromForm) => {
        if (user && user.email !== updatedUserFromForm.email) {
            return { success: false, message: "Email cannot be changed through this method."};
        }
        const success = await updateStorageUser(updatedUserFromForm);
        if (success) {
            _updateUserSession(updatedUserFromForm);
            return { success: true, user: updatedUserFromForm };
        } else {
            return { success: false, message: 'Could not update profile in local storage.' };
        }
    };

    const deleteAccountInStorage = async (email) => {
        const success = await deleteStorageUser(email);
        if (success) {
            if (user && user.email === email) {
                removeLoggedInUser();
                setUser(null);
            }
            return { success: true };
        } else {
            return { success: false, message: 'Could not delete account from local storage.' };
        }
    };

    const isAdmin = user ? user.isAdmin : false;

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            login,
            signup,
            logout,
            loading,
            updateContextUser,
            updateProfileInStorage,
            deleteAccountInStorage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to use the AuthContext - THIS IS THE PRIMARY WAY TO ACCESS THE CONTEXT
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};